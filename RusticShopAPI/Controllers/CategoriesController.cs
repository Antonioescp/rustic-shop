using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RusticShopAPI.Data;
using RusticShopAPI.Data.Models;
using RusticShopAPI.Data.Models.DTOs;
using RusticShopAPI.Data.Models.DTOs.CategoryDtos;

namespace RusticShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        #region Category CRUD

        // GET: api/Categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetAllCategories()
        {
            return await _context.Categories.ToListAsync();
        }

        [HttpGet("paginated")]
        public async Task<ActionResult<PaginatedResult<Category>>> GetCategories(
            int pageIndex = 0,
            int pageSize = 10,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumn = null,
            string? filterQuery = null)
        {
            return await PaginatedResult<Category>.CreateAsync(
                _context.Categories,
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery);
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(long id)
        {
          if (_context.Categories == null)
          {
              return NotFound();
          }
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        // PUT: api/Categories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(long id, Category category)
        {
            if (id != category.Id)
            {
                return BadRequest();
            }

            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
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

        // POST: api/Categories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory(Category category)
        {
          if (_context.Categories == null)
          {
              return Problem("Entity set 'ApplicationDbContext.Categories'  is null.");
          }
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCategory", new { id = category.Id }, category);
        }

        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(long id)
        {
            if (_context.Categories == null)
            {
                return NotFound();
            }
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        #endregion

        #region Nested Resources

        #region Products
        [HttpGet("{id}/products")]
        public async Task<ActionResult<IEnumerable<Product>>> GetCategoryProducts(int categoryId)
        {
            var category = await _context.Categories
                .Include(c => c.Products)
                .Where(cat => cat.Id == categoryId)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (category == null || category.Products == null)
            {
                return NotFound();
            }

            return category.Products.ToList();
        }
        #endregion

        #endregion

        #region Checks

        [HttpPost("name-availability")]
        public ActionResult<bool> CheckNameAvailability(CategoryNameOnlyDto data)
        {
            return _context.Categories.All(c => c.Name != data.Name);
        }

        private bool CategoryExists(long id)
        {
            return (_context.Categories?.Any(e => e.Id == id)).GetValueOrDefault();
        }
        #endregion
    }
}
