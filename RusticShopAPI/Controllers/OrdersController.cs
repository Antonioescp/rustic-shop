using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RusticShopAPI.Data;
using RusticShopAPI.Data.Models;
using RusticShopAPI.Data.Models.DTOs;
using RusticShopAPI.Data.Models.DTOs.OrderDtos;

namespace RusticShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public OrdersController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("summary/paginated")]
        public async Task<ActionResult<PaginatedResult<OrderDetailsDto>>> GetSummaryPaginated(
            int pageIndex = 0,
            int pageSize = 10,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumn = null,
            string? filterQuery = null)
        {
            var source = _context.Orders
                .Include(o => o.ProductVariants)
                .Include(o => o.User);

            var orders = await PaginatedResult<Order>.CreateAsync(
                source,
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery);

            return _mapper.Map<PaginatedResult<OrderDetailsDto>>(orders);
        }

        [HttpGet("paginated")]
        public async Task<ActionResult<PaginatedResult<Order>>> GetPaginated(
            int pageIndex = 0,
            int pageSize = 10,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumn = null,
            string? filterQuery = null)
        {
            return await PaginatedResult<Order>.CreateAsync(
                _context.Orders,
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery);
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            if (_context.Orders == null)
            {
                return NotFound();
            }
            return await _context.Orders.ToListAsync();
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(long id)
        {
            if (_context.Orders == null)
            {
                return NotFound();
            }
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        // PUT: api/Orders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(long id, Order order)
        {
            if (id != order.Id)
            {
                return BadRequest();
            }

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
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

        // POST: api/Orders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(Order order)
        {
            if (_context.Orders == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Orders'  is null.");
            }
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrder", new { id = order.Id }, order);
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(long id)
        {
            if (_context.Orders == null)
            {
                return NotFound();
            }
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{id}/summary")]
        public async Task<ActionResult<OrderSummaryDto>> GetSummary(long id)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.ShippingAddress!)
                    .ThenInclude(sa => sa.Neighborhood!)
                        .ThenInclude(n => n.City)
                .Include(o => o.OrderDetails!)
                    .ThenInclude(od => od.ProductVariant)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            return _mapper.Map<OrderSummaryDto>(order);
        }

        private bool OrderExists(long id)
        {
            return (_context.Orders?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
