using System.Collections.Immutable;
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
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            var list = await _context.Products.ToListAsync();
            return Ok(list);
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<Product>>> GetPaginatedProducts(
            int pageIndex = 0,
            int pageSize = 10,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumn = null,
            string? filterQuery = null)
        {
            return await PaginatedResult<Product>.CreateAsync(
                _context.Products,
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery); 
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

        [HttpGet("views/product-list")]
        public async Task<ActionResult<ICollection<VProductSummary>>> GetProductListView()
        {
            var list = await _context.ProductListView.ToListAsync();
            return Ok(list);
        }

        // PUT: api/Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
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

            var newEntry = new ProductAttribute
            {
                FeatureId = featureId,
                ProductId = id,
                Content = data.Content
            };

            _context.FeatureProducts.Add(newEntry);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}/features/{featureId}")]
        public async Task<IActionResult> UpdateFeature(long id, long featureId, ProductAddFeatureRequest data)
        {
            var featureProduct = await _context.FeatureProducts
                .Where(fp => fp.ProductId == id && fp.FeatureId == featureId)
                .FirstOrDefaultAsync();

            if (featureProduct == null)
            {
                return NotFound(new CommonResponse
                {
                    Message = "La caracteristica no fue encontrada"
                });
            }

            featureProduct.Content = data.Content;
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

        [HttpGet("{id}/images")]
        public async Task<ActionResult<IEnumerable<ProductImage>>> GetImages(long id)
        {
            if (!ProductExists(id))
            {
                return NotFound(new CommonResponse
                {
                    Message = $"El producto con el id {id} no fue encontrado"
                });
            }

            var images = await _context.ProductImages
                .Where(pi => pi.ProductId == id)
                .ToListAsync();

            return Ok(images);
        }

        [HttpGet("{id}/discounts")]
        public async Task<ActionResult<IEnumerable<DiscountDto>>> GetDiscounts(long id)
        {
            var product = await _context.Products
                .Where(p => p.Id == id)
                .Include(p => p.DiscountProducts)
                .ThenInclude(p => p.Discount)
                .AsSplitQuery()
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (product == null || product.DiscountProducts == null)
            {
                return NotFound(new CommonResponse
                {
                    Message = "Producto no encontrado"
                });
            }

            var discounts = product!.DiscountProducts.Select(dp =>
            {
                return new DiscountDto
                {
                    Id = dp.DiscountId,
                    Name = dp.Discount.Name,
                    Description = dp.Discount.Description,
                    Percentage = dp.Percentage,
                    StartDate = dp.StartDate,
                    EndDate = dp.EndDate
                };
            });

            return Ok(discounts);
        }

        [HttpPost("{id}/discounts/{discountId}")]
        public async Task<IActionResult> AddDiscount(long id, long discountId, ProductAddDiscountRequest data)
        {
            var product = await _context.Products
                .Where(p => p.Id == id)
                .Include(p => p.DiscountProducts)
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound(new CommonResponse
                {
                    Message = "Producto no encontrado"
                });
            }

            if (product!.DiscountProducts!.Any(dp => dp.DiscountId == discountId))
            {
                return BadRequest(new CommonResponse
                {
                    Message = "El descuento ya se encuentra aplicado al producto"
                });
            }

            if (!_context.Discounts.Any(d => d.Id == discountId))
            {
                return BadRequest(new CommonResponse
                {
                    Message = "El descuento a aplicar no fue encontrado"
                });
            }

            var newEntry = new DiscountProduct
            {
                DiscountId = discountId,
                ProductId = id,
                StartDate = data.StartDate,
                EndDate = data.EndDate,
                Percentage = data.Percentage
            };

            _context.DiscountProducts.Add(newEntry);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}/discounts/{discountId}")]
        public async Task<IActionResult> UpdateDiscount(long id, long discountId, ProductAddDiscountRequest data)
        {
            var discountProduct = await _context.DiscountProducts
                .Where(dp => dp.ProductId == id && dp.DiscountId == discountId)
                .FirstOrDefaultAsync();

            if (discountProduct == null)
            {
                return NotFound(new CommonResponse
                {
                    Message = "Descuento no encontrado en producto"
                });
            }

            discountProduct.StartDate = data.StartDate;
            discountProduct.EndDate = data.EndDate;
            discountProduct.Percentage = data.Percentage;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}/discounts/{discountId}")]
        public async Task<IActionResult> DeleteDiscount(long id, long discountId)
        {
            var product = await _context.Products
                .Where(p => p.Id == id)
                .Include(p => p.Discounts)
                .FirstOrDefaultAsync();

            if (product == null || product.Discounts == null)
            {
                return NotFound(new CommonResponse
                {
                    Message = "Producto no encontrado"
                });
            }

            if (!product.Discounts.Any(d => d.Id == discountId))
            {
                return NotFound(new CommonResponse
                {
                    Message = "El descuento no ha sido aplicado a este producto"
                });
            }

            var discount = await _context.Discounts.FindAsync(discountId);
            product.Discounts.Remove(discount!);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
