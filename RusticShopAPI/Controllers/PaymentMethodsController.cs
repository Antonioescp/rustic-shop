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
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentMethodsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PaymentMethodsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/PaymentMethods
        [Authorize(Roles = "Administrator")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentMethod>>> GetPaymentMethods()
        {
          if (_context.PaymentMethods == null)
          {
              return NotFound();
          }
            return await _context.PaymentMethods.ToListAsync();
        }

        // GET: api/PaymentMethods/5
        [Authorize(Roles = "Administrator")]
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentMethod>> GetPaymentMethod(long id)
        {
          if (_context.PaymentMethods == null)
          {
              return NotFound();
          }
            var paymentMethod = await _context.PaymentMethods.FindAsync(id);

            if (paymentMethod == null)
            {
                return NotFound();
            }

            return paymentMethod;
        }

        // PUT: api/PaymentMethods/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "Administrator")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymentMethod(long id, PaymentMethod paymentMethod)
        {
            if (id != paymentMethod.Id)
            {
                return BadRequest();
            }

            _context.Entry(paymentMethod).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentMethodExists(id))
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

        // POST: api/PaymentMethods
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "Administrator")]
        [HttpPost]
        public async Task<ActionResult<PaymentMethod>> PostPaymentMethod(PaymentMethod paymentMethod)
        {
          if (_context.PaymentMethods == null)
          {
              return Problem("Entity set 'ApplicationDbContext.PaymentMethods'  is null.");
          }
            _context.PaymentMethods.Add(paymentMethod);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPaymentMethod", new { id = paymentMethod.Id }, paymentMethod);
        }

        // DELETE: api/PaymentMethods/5
        [Authorize(Roles = "Administrator")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymentMethod(long id)
        {
            if (_context.PaymentMethods == null)
            {
                return NotFound();
            }
            var paymentMethod = await _context.PaymentMethods.FindAsync(id);
            if (paymentMethod == null)
            {
                return NotFound();
            }

            _context.PaymentMethods.Remove(paymentMethod);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymentMethodExists(long id)
        {
            return (_context.PaymentMethods?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
