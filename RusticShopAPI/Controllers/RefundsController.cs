using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RusticShopAPI.Data;
using RusticShopAPI.Data.Models;

namespace RusticShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RefundsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RefundsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Refunds
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Refund>>> GetRefunds()
        {
          if (_context.Refunds == null)
          {
              return NotFound();
          }
            return await _context.Refunds.ToListAsync();
        }

        // GET: api/Refunds/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Refund>> GetRefund(long id)
        {
          if (_context.Refunds == null)
          {
              return NotFound();
          }
            var refund = await _context.Refunds.FindAsync(id);

            if (refund == null)
            {
                return NotFound();
            }

            return refund;
        }

        // PUT: api/Refunds/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRefund(long id, Refund refund)
        {
            if (id != refund.Id)
            {
                return BadRequest();
            }

            _context.Entry(refund).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RefundExists(id))
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

        // POST: api/Refunds
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Refund>> PostRefund(Refund refund)
        {
          if (_context.Refunds == null)
          {
              return Problem("Entity set 'ApplicationDbContext.Refunds'  is null.");
          }
            _context.Refunds.Add(refund);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRefund", new { id = refund.Id }, refund);
        }

        // DELETE: api/Refunds/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRefund(long id)
        {
            if (_context.Refunds == null)
            {
                return NotFound();
            }
            var refund = await _context.Refunds.FindAsync(id);
            if (refund == null)
            {
                return NotFound();
            }

            _context.Refunds.Remove(refund);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RefundExists(long id)
        {
            return (_context.Refunds?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
