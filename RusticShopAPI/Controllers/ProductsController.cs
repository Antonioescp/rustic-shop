using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;
using Microsoft.EntityFrameworkCore;
using RusticShopAPI.Data;
using RusticShopAPI.Data.Models;
using RusticShopAPI.Data.Models.DTOs;
using RusticShopAPI.Data.Models.DTOs.ProctImageDtos;
using RusticShopAPI.Data.Models.DTOs.ProductDtos;
using AttributeModel = RusticShopAPI.Data.Models.Attribute;
using Microsoft.AspNetCore.Authorization;

namespace RusticShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _hostEnvironment;

        public ProductsController(ApplicationDbContext context, IMapper mapper, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _mapper = mapper;
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet("details")]
        public async Task<ActionResult<PaginatedResult<ProductDetailDto>>> GetPaginatedDetailedProducts(
            int pageIndex = 0,
            int pageSize = 10,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumn = null,
            string? filterQuery = null)
        {
            var source = _context.Products
                .Include(p => p.Categories!)
                .Include(p => p.Brand!)
                .Include(p => p.Images!)
                .Include(p => p.Variants!)
                    .ThenInclude(pv => pv.ProductVariantAttributes!)
                        .ThenInclude(pva => pva.Attribute)
                .Include(p => p.Variants!)
                    .ThenInclude(pv => pv.OrderDetails)
                .Include(p => p.Variants!)
                    .ThenInclude(pv => pv.Images)
                .Include(p => p.Variants!)
                    .ThenInclude(pv => pv.ProductVariantDiscounts!)
                        .ThenInclude(pv => pv.Discount)
                .Include(p => p.Variants!)
                    .ThenInclude(pv => pv.WishlistedByUsers)
                .AsSplitQuery()
                .AsNoTracking();

            var paginated = await PaginatedResult<Product>.CreateAsync(
                source,
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery);

            return _mapper.Map<PaginatedResult<ProductDetailDto>>(paginated);
        }

        [HttpGet("with-brand-name")]
        public async Task<ActionResult<IEnumerable<ProductWithBrandName>>> GetProductsWithBrandName()
        {
            var result = await _context.Products
              .Include(p => p.Brand)
              .AsSplitQuery()
              .AsNoTracking()
              .ToListAsync();

            if (result == null)
            {
                return StatusCode(500);
            }

            return _mapper.Map<List<ProductWithBrandName>>(result);
        }

        // GET: api/Products
        [Authorize(Roles = "Administrator")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            var list = await _context.Products.ToListAsync();
            return Ok(list);
        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("paginated")]
        public async Task<ActionResult<PaginatedResult<Product>>> GetPaginatedProducts(
            int pageIndex = 0,
            int pageSize = 10,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumn = null,
            string? filterQuery = null)
        {
            return await PaginatedResult<Product>.CreateAsync(
                _context.Products
                    .Include(p => p.Variants)
                    .AsNoTracking(),
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery);
        }

        // GET: api/Products/5
        [Authorize(Roles = "Administrator")]
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

        #region Nested Resources

        #region Attributes

        [Authorize(Roles = "Administrator")]
        [HttpGet("{id}/attributes")]
        public async Task<ActionResult<IEnumerable<AttributeModel>>> GetProductAttributes(long id)
        {
            if (!ProductExists(id))
            {
                return NotFound();
            }

            var productAttributes = await _context.ProductAttributes
                .Include(pa => pa.Attribute)
                .Where(pa => pa.ProductId == id)
                .Select(pa => pa.Attribute!)
                .AsNoTracking()
                .ToListAsync();

            if (productAttributes == null)
            {
                return NotFound();
            }

            return productAttributes;
        }

        [Authorize(Roles = "Administrator")]
        [HttpPost("{id}/attributes/{attributeId}")]
        public async Task<IActionResult> AddProductAttribute(long id, long attributeId)
        {
            var product = await _context.Products
                .Include(p => p.Attributes)
                .Where(p => p.Id == id)
                .FirstOrDefaultAsync();

            if (product == null || product.Attributes == null)
            {
                return NotFound();
            }

            if (product.Attributes.Any(att => att.Id == attributeId))
            {
                return BadRequest();
            }

            var attribute = await _context.Attributes.FindAsync(attributeId);

            if (attribute == null)
            {
                return BadRequest();
            }

            product.Attributes.Add(attribute);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return NoContent();
            }
            else
            {
                return StatusCode(500);
            }
        }

        [Authorize(Roles = "Administrator")]
        [HttpDelete("{id}/attributes/{attributeId}")]
        public async Task<IActionResult> RemoveProductAttribute(long id, long attributeId)
        {
            var product = await _context.Products
                .Include(p => p.Attributes)
                .Where(p => p.Id == id)
                .FirstOrDefaultAsync();

            if (product == null || product.Attributes == null)
            {
                return NotFound();
            }

            if (!product.Attributes.Any(att => att.Id == attributeId))
            {
                return BadRequest();
            }

            var attribute = await _context.Attributes.FindAsync(attributeId);
            if (attribute == null)
            {
                return NotFound();
            }

            product.Attributes.Remove(attribute);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return NoContent();
            }
            else
            {
                return StatusCode(500);
            }
        }

        #endregion

        #region Categories

        [Authorize(Roles = "Administrator")]
        [HttpGet("{id}/categories")]
        public async Task<ActionResult<IEnumerable<Category>>> GetProductCategories(long id)
        {
            if (!ProductExists(id))
            {
                return NotFound();
            }

            var categories = await _context.CategoryProducts
                .Where(cp => cp.ProductId == id)
                .Include(cp => cp.Category)
                .Select(cp => cp.Category!)
                .AsNoTracking()
                .ToListAsync();

            if (categories == null)
            {
                return NotFound();
            }

            return categories;
        }

        [Authorize(Roles = "Administrator")]
        [HttpPost("{id}/categories/{categoryId}")]
        public async Task<IActionResult> AddProductCategory(long id, long categoryId)
        {
            var product = await _context.Products
                .Include(p => p.Categories)
                .Where(p => p.Id == id)
                .FirstOrDefaultAsync();

            if (product == null || product.Categories == null)
            {
                return NotFound();
            }

            if (product.Categories.Any(c => c.Id == categoryId))
            {
                return BadRequest();
            }

            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null)
            {
                return NotFound();
            }

            product.Categories.Add(category);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return NoContent();
            }
            else
            {
                return StatusCode(500);
            }

        }

        [Authorize(Roles = "Administrator")]
        [HttpDelete("{id}/categories/{categoryId}")]
        public async Task<IActionResult> RemoveProductCategory(long id, long categoryId)
        {
            var product = await _context.Products
                .Include(p => p.Categories)
                .Where(p => p.Id == id)
                .FirstOrDefaultAsync();

            if (product == null || product.Categories == null)
            {
                return NotFound();
            }

            if (!product.Categories.Any(c => c.Id == categoryId))
            {
                return BadRequest();
            }

            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null)
            {
                return NotFound();
            }

            product.Categories.Remove(category);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return NoContent();
            }
            else
            {
                return StatusCode(500);
            }
        }

        #endregion

        #region Images

        [Authorize(Roles = "Administrator")]
        [HttpPost("{id}/images")]
        public async Task<ActionResult> UploadImage(long id, List<IFormFile> images)
        {
            var files = images.ToList();
            var path = Path.Combine(_hostEnvironment.WebRootPath, "Products", $"{id}");
            var hostUrl = $"{Request.Scheme}://{Request.Host.Value}/gallery";

            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            foreach (var file in files)
            {
                var filePath = Path.Combine(path, file.FileName);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }

                await using var stream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(stream);

                _context.ProductImages.Add(new ProductImage
                {
                    ProductId = id,
                    URL = $"{hostUrl}/Products/{id}/{file.FileName}"
                });
            }

            await _context.SaveChangesAsync();

            return Ok();
        }

        [Authorize(Roles = "Administrator")]
        [HttpDelete("{id}/images/{imageId}")]
        public async Task<ActionResult> DeleteImage(long id, long imageId)
        {
            var productImage = await _context.ProductImages.FindAsync(imageId);
            var productVariantImages = await _context.ProductVariantImages
                .Include(pvi => pvi.ProductImage)
                .ToListAsync();

            if (productImage == null || productImage.ProductId != id || productVariantImages == null)
            {
                return NotFound();
            }

            var hostUrl = $"{Request.Scheme}://{Request.Host.Value}/gallery/";
            var filePath = Path.Combine(
                _hostEnvironment.WebRootPath,
                productImage.URL.Replace(hostUrl, ""));

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }



            // delete product variant images with imageId
            foreach (var pvi in productVariantImages)
            {
                if (pvi.ProductImageId == imageId)
                {
                    _context.ProductVariantImages.Remove(pvi);
                }
            }
            await _context.SaveChangesAsync();

            _context.ProductImages.Remove(productImage!);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("{id}/images")]
        public async Task<ActionResult<IEnumerable<ProductImage>>> GetProductImages(long id)
        {
            var images = await _context.ProductImages
                .Where(pimg => pimg.ProductId == id)
                .AsNoTracking()
                .ToListAsync();

            if (images == null)
            {
                return NotFound();
            }

            return images;
        }

        #endregion

        #region Product Variants

        [Authorize(Roles = "Administrator")]
        [HttpGet("{id}/variants")]
        public async Task<ActionResult<IEnumerable<ProductVariant>>> GetProductVariants(long id)
        {
            if (!ProductExists(id))
            {
                return NotFound();
            }

            var variants = await _context.ProductVariants
                .Where(pv => pv.ProductId == id)
                .AsNoTracking()
                .ToListAsync();

            if (variants == null)
            {
                return NotFound();
            }

            return variants;
        }

        #endregion

        #region Brand

        [Authorize(Roles = "Administrator")]
        [HttpGet("{id}/brand")]
        public async Task<ActionResult<Brand>> GetProductBrand(long id)
        {
            var product = await _context.Products
                .Include(p => p.Brand)
                .Where(p => p.Id == id)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (product == null || product.Brand == null)
            {
                return NotFound();
            }

            return product.Brand;
        }

        #endregion

        #endregion
    }
}
