using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Cms;
using RusticShopAPI.Data;
using RusticShopAPI.Data.Models;
using RusticShopAPI.Data.Models.DTOs;
using RusticShopAPI.Data.Models.DTOs.ProductDtos;
using RusticShopAPI.Data.Models.DTOs.ProductVariantImageDtos;

namespace RusticShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductVariantsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ProductVariantsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/ProductVariants
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductVariant>>> GetProductVariants()
        {
            if (_context.ProductVariants == null)
            {
                return NotFound();
            }
            return await _context.ProductVariants.ToListAsync();
        }

        [HttpGet("paginated")]
        public async Task<ActionResult<PaginatedResult<ProductVariant>>> GetPaginatedProductVariants(
            int pageIndex = 0,
            int pageSize = 10,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumn = null,
            string? filterQuery = null)
        {
            return await PaginatedResult<ProductVariant>.CreateAsync(
              _context.ProductVariants,
              pageIndex,
              pageSize,
              sortColumn,
              sortOrder,
              filterColumn,
              filterQuery);
        }

        [HttpGet("details")]
        public async Task<ActionResult<PaginatedResult<ProductVariantListItem>>> GetPaginatedProductVariantsListItems(
            int pageIndex = 0,
            int pageSize = 10,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumn = null,
            string? filterQuery = null)
        {
            var source = _context.ProductVariants
              .Include(pv => pv.Product)
                .ThenInclude(p => p!.Brand)
              .AsNoTracking()
              .AsSplitQuery();

            var result = await PaginatedResult<ProductVariant>.CreateAsync(
              source,
              pageIndex,
              pageSize,
              sortColumn,
              sortOrder,
              filterColumn,
              filterQuery);

            return _mapper.Map<PaginatedResult<ProductVariantListItem>>(result);
        }

        // GET: api/ProductVariants/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductVariant>> GetProductVariant(long id)
        {
            if (_context.ProductVariants == null)
            {
                return NotFound();
            }
            var productVariant = await _context.ProductVariants.FindAsync(id);

            if (productVariant == null)
            {
                return NotFound();
            }

            return productVariant;
        }

        // PUT: api/ProductVariants/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductVariant(long id, ProductVariant productVariant)
        {
            if (id != productVariant.Id)
            {
                return BadRequest();
            }

            _context.Entry(productVariant).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductVariantExists(id))
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

        // POST: api/ProductVariants
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProductVariant>> PostProductVariant(ProductVariant productVariant)
        {
            if (_context.ProductVariants == null)
            {
                return Problem("Entity set 'ApplicationDbContext.ProductVariants'  is null.");
            }
            _context.ProductVariants.Add(productVariant);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProductVariant", new { id = productVariant.Id }, productVariant);
        }

        // DELETE: api/ProductVariants/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductVariant(long id)
        {
            if (_context.ProductVariants == null)
            {
                return NotFound();
            }
            var productVariant = await _context.ProductVariants.FindAsync(id);
            if (productVariant == null)
            {
                return NotFound();
            }

            _context.ProductVariants.Remove(productVariant);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductVariantExists(long id)
        {
            return (_context.ProductVariants?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        [HttpPost("sku-availability")]
        public ActionResult<bool> IsSkuAvailable(ProductVariantSkuOnlyDto data)
        {
            return _context.ProductVariants.All(pv => pv.SKU != data.SKU);
        }

        [HttpGet("{id}/images")]
        public async Task<ActionResult<IEnumerable<ProductVariantImageOnlyDto>>> GetProductVariantImages(long id)
        {
            var productVariant = await _context.ProductVariants
              .Include(pv => pv.Images)
              .AsNoTracking()
              .FirstOrDefaultAsync(pv => pv.Id == id);

            if (productVariant == null || productVariant.Images == null)
            {
                return NotFound();
            }

            var result = productVariant.Images.Select(pv => new ProductVariantImageOnlyDto
            {
                Id = pv.Id,
                ProductId = pv.ProductId,
                URL = pv.URL
            });

            return Ok(result);
        }

        [HttpDelete("{id}/images/{imageId}")]
        public async Task<ActionResult> DeleteProductVariantImage(long id, long imageId)
        {
            var productVariantImage = await _context.ProductVariantImages
                .AsNoTracking()
                .FirstOrDefaultAsync(pvi => pvi.ProductImageId == imageId && pvi.ProductVariantId == id);

            if (productVariantImage == null)
            {
                return NotFound();
            }

            _context.ProductVariantImages.Remove(productVariantImage);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{id}/images/{imageId}")]
        public async Task<ActionResult> AddProductVariantImage(long id, long imageId)
        {
            var newImage = new ProductVariantImage
            {
                ProductVariantId = id,
                ProductImageId = imageId
            };

            _context.ProductVariantImages.Add(newImage);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        #region Attributes

        [HttpGet("{id}/attributes")]
        public async Task<ActionResult<IEnumerable<ProductVariantAttributeDto>>> GetAttributes(long id)
        {
            var result = await _context.ProductVariantAttributes
                .Include(pva => pva.Attribute)
                .Where(pva => pva.ProductVariantId == id)
                .AsNoTracking()
                .ToListAsync();

            return _mapper.Map<List<ProductVariantAttributeDto>>(result);
        }

        [HttpPost("{id}/attributes")]
        public async Task<ActionResult> AddAttribute(long id, ProductVariantAttribute productVariantAttribute)
        {
            productVariantAttribute.ProductVariantId = id;

            _context.ProductVariantAttributes.Add(productVariantAttribute);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}/attributes/{attributeId}")]
        public async Task<ActionResult> DeleteAttribute(long id, long attributeId)
        {
            var productVariantAttribute = await _context.ProductVariantAttributes
                .AsNoTracking()
                .FirstOrDefaultAsync(pva => pva.ProductVariantId == id && pva.AttributeId == attributeId);

            if (productVariantAttribute == null)
            {
                return NotFound();
            }

            _context.ProductVariantAttributes.Remove(productVariantAttribute);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        #endregion
    }
}
