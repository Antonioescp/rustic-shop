using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Drawing.Printing;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RusticShopAPI.Data;
using RusticShopAPI.Data.Models;
using RusticShopAPI.Data.Models.DTOs;
using RusticShopAPI.Data.Models.Views;

namespace RusticShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            var list = await _context.Products.ToListAsync();
            return Ok(list);
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(long id)
        {
          if (_context.Products == null)
          {
              return NotFound();
          }
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("views/product-list")]
        public async Task<ActionResult<ICollection<VProductSummary>>> GetProductListView()
        {
            var list = await _context.ProductListView.ToListAsync();
            return Ok(list);
        }

        // PUT: api/Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "Administrator")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(long id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Products
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "Administrator")]
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
          if (_context.Products == null)
          {
              return Problem("Entity set 'ApplicationDbContext.Products'  is null.");
          }
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        }

        // DELETE: api/Products/5
        [Authorize(Roles = "Administrator")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(long id)
        {
            if (_context.Products == null)
            {
                return NotFound();
            }
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(long id)
        {
            return (_context.Products?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        [HttpGet("{id}/categories")]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories(long id)
        {
            var product = await _context.Products
                .Where(p => p.Id == id)
                .Include(p => p.Categories)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound();
            }

            var result = product.Categories?.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
            });
            return Ok(result);
        }

        [HttpPost("{id}/categories/{categoryId}")]
        public async Task<IActionResult> AddCategory(long id, long categoryId)
        {
            var cat = await _context.Categories.FindAsync(categoryId);
            if (cat == null)
            {
                return NotFound(new CommonResponse
                {
                    Success = false,
                    Message = "Categoria no encontrada"
                });
            }

            var product = await _context.Products
                .Include(p => p.Categories)
                .Where(p => p.Id == id)
                .FirstAsync();

            if (product == null || product.Categories == null)
            {
                return NotFound(new CommonResponse
                {
                    Success = false,
                    Message = "Producto no encontrado"
                });
            }

            if (product.Categories.ToImmutableList().Contains(cat))
            {
                return BadRequest(new CommonResponse
                {
                    Success = false,
                    Message = "Category already in product"
                });
            }

            product.Categories.Add(cat);
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}/categories/{categoryId}")]
        public async Task<IActionResult> RemoveCategory(long id, long categoryId)
        {
            var product = await _context.Products
                .Where(p => p.Id == id)
                .Include(p => p.Categories)
                .FirstOrDefaultAsync();

            if (product == null || product.Categories == null)
            {
                return NotFound();
            }

            if (!product.Categories.Any(c => c.Id == categoryId))
            {
                return NotFound();
            }

            var category = await _context.Categories.FindAsync(categoryId);
            product.Categories.Remove(category!);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{id}/features")]
        public async Task<ActionResult<IEnumerable<FeatureDto>>> GetFeatures(long id)
        {
            var product = await _context.Products
                .Where(p => p.Id == id)
                .Include(p => p.FeatureProducts)
                .ThenInclude(fp => fp.Feature)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound();
            }

            var result = product.FeatureProducts?.Select(fp =>
            {
                return new FeatureDto
                {
                    Content = fp.Content,
                    Id = fp.FeatureId,
                    Name = fp.Feature!.Name
                };
            }).ToImmutableList();

            return Ok(result);
        }

        [HttpPost("{id}/features/{featureId}")]
        public async Task<IActionResult> AddFeature(long id, long featureId, ProductAddFeatureRequest data)
        {
            var product = await _context.Products
                .Where(p => p.Id == id)
                .Include(p => p.Features)
                .FirstOrDefaultAsync();

            if (product == null || product.Features == null)
            {
                return NotFound(new CommonResponse
                {
                    Message = "Producto no encontrado"
                });
            }

            if (!_context.Features.Any(f => f.Id == featureId))
            {
                return NotFound(new CommonResponse
                {
                    Message = "Caracteristica no encontrada"
                });
            }

            if (product.Features.Any(f => f.Id == featureId))
            {
                return BadRequest(new CommonResponse
                {
                    Message = "El producto ya contiene la característica"
                });
            }

            var newEntry = new FeatureProduct
            {
                FeatureId = featureId,
                ProductId = id,
                Content = data.Content
            };

            _context.FeatureProducts.Add(newEntry);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}/features/{featureId}")]
        public async Task<IActionResult> RemoveFeature(long id, long featureId)
        {
            var product = await _context.Products
                .Where(p => p.Id == id)
                .Include(p => p.FeatureProducts)
                .AsSplitQuery()
                .FirstOrDefaultAsync();

            if (product == null || product.FeatureProducts == null)
            {
                return NotFound(new CommonResponse
                {
                    Message = "Producto no encontrado"
                });
            }

            if (!product.FeatureProducts.Any(fp => fp.FeatureId == featureId))
            {
                return NotFound(new CommonResponse
                {
                    Message = "El producto no contiene la caracteristica"
                });
            }

            var featureProduct = await _context.FeatureProducts.Where(
                fp => fp.ProductId == id && fp.FeatureId == featureId)
                .FirstOrDefaultAsync();

            product.FeatureProducts.Remove(featureProduct!);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
