using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RusticShopAPI.Data;
using RusticShopAPI.Data.Models;
using Microsoft.AspNetCore.Authorization;

namespace RusticShopAPI.Controllers
{
    [Authorize(Roles = "Administrator")]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductImagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductImagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ProductImages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductImage>>> GetProductImages()
        {
          if (_context.ProductImages == null)
          {
              return NotFound();
          }
            return await _context.ProductImages.ToListAsync();
        }

        // GET: api/ProductImages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductImage>> GetProductImage(long id)
        {
          if (_context.ProductImages == null)
          {
              return NotFound();
          }
            var productImage = await _context.ProductImages.FindAsync(id);

            if (productImage == null)
            {
                return NotFound();
            }

            return productImage;
        }

        // PUT: api/ProductImages/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductImage(long id, ProductImage productImage)
        {
            if (id != productImage.Id)
            {
                return BadRequest();
            }

            _context.Entry(productImage).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductImageExists(id))
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

        // POST: api/ProductImages
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProductImage>> PostProductImage(ProductImage productImage)
        {
          if (_context.ProductImages == null)
          {
              return Problem("Entity set 'ApplicationDbContext.ProductImages'  is null.");
          }
            _context.ProductImages.Add(productImage);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProductImage", new { id = productImage.Id }, productImage);
        }

        // DELETE: api/ProductImages/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductImage(long id)
        {
            if (_context.ProductImages == null)
            {
                return NotFound();
            }
            var productImage = await _context.ProductImages.FindAsync(id);
            if (productImage == null)
            {
                return NotFound();
            }

            _context.ProductImages.Remove(productImage);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductImageExists(long id)
        {
            return (_context.ProductImages?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
