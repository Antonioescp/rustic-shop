using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RusticShopAPI.Data;
using RusticShopAPI.Data.Models;
using RusticShopAPI.Data.Models.DTOs;
using RusticShopAPI.Data.Models.DTOs.AttributeDtos;
using AttributeModel = RusticShopAPI.Data.Models.Attribute;

namespace RusticShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttributesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AttributesController(ApplicationDbContext context)
        {
            _context = context;
        }

        #region CRUD

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AttributeModel>>> GetAllAttributes()
        {
            return await _context.Attributes.ToListAsync();
        }

        // GET: api/Attributes
        [HttpGet("paginated")]
        public async Task<ActionResult<PaginatedResult<AttributeModel>>> GetAttributes(
            int pageIndex = 0,
            int pageSize = 10,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumn = null,
            string? filterQuery = null)
        {
            return await PaginatedResult<AttributeModel>.CreateAsync(
                _context.Attributes,
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery);
        }

        // GET: api/Attributes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AttributeModel>> GetAttribute(long id)
        {
          if (_context.Attributes == null)
          {
              return NotFound();
          }
            var attribute = await _context.Attributes.FindAsync(id);

            if (attribute == null)
            {
                return NotFound();
            }

            return attribute;
        }

        // PUT: api/Attributes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAttribute(long id, AttributeModel attribute)
        {
            if (id != attribute.Id)
            {
                return BadRequest();
            }

            _context.Entry(attribute).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AttributeExists(id))
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

        // POST: api/Attributes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AttributeModel>> PostAttribute(AttributeModel attribute)
        {
          if (_context.Attributes == null)
          {
              return Problem("Entity set 'ApplicationDbContext.Attributes'  is null.");
          }
            _context.Attributes.Add(attribute);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAttribute", new { id = attribute.Id }, attribute);
        }

        // DELETE: api/Attributes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttribute(long id)
        {
            if (_context.Attributes == null)
            {
                return NotFound();
            }
            var attribute = await _context.Attributes.FindAsync(id);
            if (attribute == null)
            {
                return NotFound();
            }

            _context.Attributes.Remove(attribute);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        #endregion

        #region Checks
        private bool AttributeExists(long id)
        {
            return (_context.Attributes?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        [HttpPost("name-availability")]
        public ActionResult<bool> CheckNameAvailability(AttributeNameOnlyDto data)
        {
            return _context.Attributes.All(att => att.Name != data.Name);
        }

        #endregion
    }
}
