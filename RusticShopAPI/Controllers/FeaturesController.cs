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

namespace RusticShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeaturesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FeaturesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Features
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Data.Models.Attribute>>> GetAllFeatures()
        {
          if (_context.Features == null)
          {
              return NotFound();
          }
            return await _context.Features.ToListAsync();
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<Data.Models.Attribute>>> GetFeatures(
            int pageIndex = 0,
            int pageSize = 10,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumn = null,
            string? filterQuery = null)
        {
            return await PaginatedResult<Data.Models.Attribute>.CreateAsync(
                _context.Features,
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery);
        }

        // GET: api/Features/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Data.Models.Attribute>> GetFeature(long id)
        {
          if (_context.Features == null)
          {
              return NotFound();
          }
            var feature = await _context.Features.FindAsync(id);

            if (feature == null)
            {
                return NotFound();
            }

            return feature;
        }

        // PUT: api/Features/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFeature(long id, Data.Models.Attribute feature)
        {
            if (id != feature.Id)
            {
                return BadRequest();
            }

            _context.Entry(feature).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FeatureExists(id))
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

        // POST: api/Features
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Data.Models.Attribute>> PostFeature(Data.Models.Attribute feature)
        {
          if (_context.Features == null)
          {
              return Problem("Entity set 'ApplicationDbContext.Features'  is null.");
          }
            _context.Features.Add(feature);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFeature", new { id = feature.Id }, feature);
        }

        // DELETE: api/Features/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFeature(long id)
        {
            if (_context.Features == null)
            {
                return NotFound();
            }
            var feature = await _context.Features.FindAsync(id);
            if (feature == null)
            {
                return NotFound();
            }

            _context.Features.Remove(feature);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FeatureExists(long id)
        {
            return (_context.Features?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        [HttpPost("name-availability")]
        public bool FeatureNameTaken(FeatureNameOnlyDto data)
        {
            return (_context.Features?.Any(f => f.Name == data.FeatureName)).GetValueOrDefault();
        }
    }
}
