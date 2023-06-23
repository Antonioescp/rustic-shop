using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using RusticShopAPI.Data;
using RusticShopAPI.Data.Models.DTOs.OrderDtos;
using System.Globalization;

namespace RusticShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ReportsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("orders/{id}/summary")]
        public async Task<ActionResult> GetOrderSummaryReport(long id)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.ShippingAddress!)
                    .ThenInclude(sa => sa.Neighborhood!)
                        .ThenInclude(n => n.City)
                .Include(o => o.OrderDetails!)
                    .ThenInclude(od => od.ProductVariant)
                .FirstOrDefaultAsync(o => o.Id == id);

            var mappedOrder = _mapper.Map<OrderSummaryDto>(order);

            if (order == null || mappedOrder == null)
            {
                return NotFound();
            }

            var cellTextStyle = new TextStyle()
                .FontSize(8)
                .NormalWeight()
                .FontColor(Colors.Black);

            var brandStyle = new TextStyle()
                .FontSize(8)
                .NormalWeight()
                .FontColor(Colors.Grey.Darken1);

            var badProfitStyle = new TextStyle()
                .FontSize(8)
                .NormalWeight()
                .FontColor(Colors.Red.Darken2);

            var goodProfitStyle = new TextStyle()
                .FontSize(8)
                .NormalWeight()
                .FontColor(Colors.Green.Darken2);

            var doc = Document.Create(container =>
            {

                container.Page(page =>
                {
                    page.Size(PageSizes.Letter);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(style =>
                        style.FontSize(12)
                             .NormalWeight());

                    page.Header()
                        .Background(Colors.Orange.Accent2)
                        .PaddingHorizontal(2, Unit.Centimetre)
                        .PaddingVertical(0.5f, Unit.Centimetre)
                        .Row(row =>
                        {
                            row.Spacing(25);

                            row.ConstantItem(100)
                                .Image("Assets/Images/logo2.png");

                            row.RelativeItem()
                                .Column(column =>
                                {
                                    column.Item()
                                        .Text("Rustic Shop - Reporte de orden")
                                        .FontSize(18)
                                        .FontColor(Colors.Black)
                                        .SemiBold();

                                    var today = DateTime.Now.ToLocalTime();

                                    column.Item().Text($"Cliente: {mappedOrder.UserFirstName} {mappedOrder.UserLastName}");
                                    column.Item().Text($"Correo: {mappedOrder.UserEmail}");
                                    column.Item().Text($"Telefono: {mappedOrder.UserPhoneNumber ?? "No aplicable"}");
                                    column.Item().Text($"Número de orden: {mappedOrder.Id}");
                                    column.Item().Text($"Fecha de reporte: {today.ToString("dd \\de MMMM \\del yyyy")}");
                                    column.Item().Text($"Hora: {today.ToString("hh:mm tt")}");

                                });
                        });

                    static IContainer Block(IContainer container)
                    {
                        return container
                            .Border(1)
                            .Padding(5)
                            .ShowOnce();
                    }

                    page.Content()
                        .PaddingHorizontal(2, Unit.Centimetre)
                        .PaddingVertical(1, Unit.Centimetre)
                        .Column(column =>
                        {
                            column.Item()
                                .Text("Direccion")
                                .Bold()
                                .FontSize(12);

                            column.Item()
                                .Table(table =>
                                {
                                    table.ColumnsDefinition(definition =>
                                    {
                                        definition.RelativeColumn();
                                        definition.RelativeColumn();
                                        definition.RelativeColumn();
                                        definition.RelativeColumn();
                                        definition.RelativeColumn();
                                    });

                                    table.Header(header =>
                                    {
                                        var headerTextStyle = new TextStyle()
                                            .FontSize(8)
                                            .Bold();

                                        header.Cell().Element(Block).Text("Nombre").Style(headerTextStyle);
                                        header.Cell().Element(Block).Text("Numero de casa").Style(headerTextStyle);
                                        header.Cell().Element(Block).Text("Barrio").Style(headerTextStyle);
                                        header.Cell().Element(Block).Text("Ciudad").Style(headerTextStyle);
                                        header.Cell().Element(Block).Text("Indicaciones").Style(headerTextStyle);
                                    });

                                    table
                                        .Cell()
                                        .Element(Block)
                                        .Text($"{mappedOrder.ShippingAddressName}")
                                        .Style(cellTextStyle);

                                    table
                                        .Cell()
                                        .Element(Block)
                                        .Text($"{mappedOrder.ShippingAddressHouseNumber}")
                                        .Style(cellTextStyle);

                                    table
                                        .Cell()
                                        .Element(Block)
                                        .Text($"{mappedOrder.ShippingAddressNeighborhoodName}")
                                        .Style(cellTextStyle);

                                    table
                                        .Cell()
                                        .Element(Block)
                                        .Text($"{mappedOrder.ShippingAddressNeighborhoodCityName}")
                                        .Style(cellTextStyle);

                                    table
                                        .Cell()
                                        .Element(Block)
                                        .Text($"{mappedOrder.ShippingAddressDirections}")
                                        .Style(cellTextStyle);
                                });

                            if (mappedOrder.OrderDetails != null)
                            {
                                column.Item()
                                    .Text("Detalles de orden")
                                    .Bold()
                                    .FontSize(12);

                                column
                                    .Item()
                                    .Table(table =>
                                    {

                                        table.ColumnsDefinition(definition =>
                                        {
                                            definition.RelativeColumn();
                                            definition.RelativeColumn();
                                            definition.RelativeColumn();
                                            definition.RelativeColumn();
                                            definition.RelativeColumn();
                                        });

                                        table.Header(header =>
                                        {
                                            var headerTextStyle = new TextStyle()
                                                .FontSize(8)
                                                .Bold();

                                            header.Cell().Element(Block).Text("ID").Style(headerTextStyle);
                                            header.Cell().Element(Block).Text("SKU").Style(headerTextStyle);
                                            header.Cell().Element(Block).Text("Cantidad").Style(headerTextStyle);
                                            header.Cell().Element(Block).Text("Precio unitario").Style(headerTextStyle);
                                            header.Cell().Element(Block).Text("Total").Style(headerTextStyle);
                                        });

                                        if (mappedOrder.OrderDetails != null)
                                        {
                                            foreach (var details in mappedOrder.OrderDetails)
                                            {
                                                table
                                                    .Cell()
                                                    .Element(Block)
                                                    .Text($"{details.Id}")
                                                    .Style(cellTextStyle);

                                                table.Cell().Element(Block)
                                                    .Text($"{details.ProductVariantSKU}")
                                                    .Style(cellTextStyle);

                                                table
                                                    .Cell()
                                                    .Element(Block)
                                                    .Text($"{details.Quantity}")
                                                    .Style(cellTextStyle);

                                                table
                                                    .Cell()
                                                    .Element(Block)
                                                    .Text($"{details.UnitPrice.ToString("C3", CultureInfo.CreateSpecificCulture("es-NI"))}")
                                                    .Style(cellTextStyle);

                                                table
                                                    .Cell()
                                                    .Element(Block)
                                                    .Text($"{details.Total.ToString("C3", CultureInfo.CreateSpecificCulture("es-NI"))}")
                                                    .Style(cellTextStyle);
                                            }

                                            table.Cell()
                                                .Element(Block)
                                                .Text("Total")
                                                .Style(cellTextStyle)
                                                .Bold();
                                            table.Cell()
                                                .Element(Block);

                                            var totalQuantity = mappedOrder.OrderDetails
                                                .Sum(x => x.Quantity)
                                                .ToString();
                                            table.Cell()
                                                .Element(Block)
                                                .Text(totalQuantity)
                                                .Style(cellTextStyle)
                                                .Bold();
                                            table.Cell()
                                                .Element(Block);
                                            table.Cell()
                                                .Element(Block)
                                                .Text(mappedOrder.Total?.ToString("C3", CultureInfo.CreateSpecificCulture("es-NI")))
                                                .Style(cellTextStyle)
                                                .Bold();
                                        }


                                    });
                            }
                        });

                    page.Footer()
                        .Padding(2, Unit.Centimetre)
                        .AlignRight()
                        .Text(text =>
                        {
                            text.DefaultTextStyle(style =>
                                style.FontSize(12)
                                     .FontColor(Colors.Grey.Darken1));

                            text.CurrentPageNumber();
                            text.Span(" / ");
                            text.TotalPages();
                        });
                });
            });

            byte[] pdfFile = doc.GeneratePdf();
            var ms = new MemoryStream(pdfFile);
            return new FileStreamResult(ms, "application/pdf");
        }
    }
}
