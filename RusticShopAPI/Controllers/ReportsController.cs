using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using RusticShopAPI.Data;
using RusticShopAPI.Data.Models.Views;
using System.Globalization;

namespace RusticShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private ApplicationDbContext _context;

        public ReportsController(ApplicationDbContext context) 
        {
            _context = context;
        }

        [HttpGet]
        public async Task<FileStreamResult> GetSalesReport()
        {
            var productSales = await _context.ProductSales
                .AsNoTracking()
                .AsSplitQuery()
                .ToListAsync();

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
                                        .Text("Rustic Shop - Reporte de ventas")
                                        .FontSize(18)
                                        .FontColor(Colors.Black)
                                        .SemiBold();

                                    var totalUtility = productSales.Sum(p => p.Profit); 
                                    
                                    var profitStyle = totalUtility > 0 
                                        ? goodProfitStyle 
                                        : ( totalUtility == 0 ? cellTextStyle : badProfitStyle );

                                    var totalUtilityFormat = totalUtility.ToString("C", CultureInfo.CurrentCulture);

                                    var totalIncome = productSales.Sum(ps => ps.Incomes)
                                        .ToString("C", CultureInfo.CurrentCulture);
                                    var totalCosts = productSales.Sum(ps => ps.Costs)
                                        .ToString("C", CultureInfo.CurrentCulture);

                                    var today = DateTime.Now.ToLocalTime();

                                    column.Item().Text($"Fecha de reporte: {today.ToString("dd \\de MMMM \\del yyyy")}");
                                    column.Item().Text($"Hora: {today.ToString("hh:mm tt")}");
                                    column.Item().Text($"Costo total: {totalCosts}");
                                    column.Item().Text($"Ingreso total: {totalIncome}");
                                    column.Item()
                                        .Text(text =>
                                        {
                                            text.DefaultTextStyle(style => style.FontColor(Colors.Black));

                                            text.Span("Utilidad total: ");
                                            text.Span(totalUtilityFormat)
                                                .Style(profitStyle)
                                                .FontSize(12)
                                                .SemiBold();
                                        });
                                        
                                });
                        });

                    page.Content()
                        .PaddingHorizontal(2, Unit.Centimetre)
                        .PaddingVertical(1, Unit.Centimetre)
                        .Table(table =>
                        {
                            table.ColumnsDefinition(definition =>
                            {
                                definition.RelativeColumn();
                                definition.ConstantColumn(50);
                                definition.RelativeColumn();
                                definition.ConstantColumn(50);
                                definition.RelativeColumn();
                                definition.RelativeColumn();
                            });

                            table.Header(header =>
                            {
                                var headerTextStyle = new TextStyle()
                                    .FontSize(8)
                                    .NormalWeight();

                                header.Cell().Text("Producto").Style(headerTextStyle);
                                header.Cell().Text("Compras").Style(headerTextStyle);
                                header.Cell().Text("Costos").Style(headerTextStyle);
                                header.Cell().Text("Ventas").Style(headerTextStyle);
                                header.Cell().Text("Ingresos").Style(headerTextStyle);
                                header.Cell().Text("Utilidad").Style(headerTextStyle);
                            });

                            foreach (var productSale in productSales)
                            {
                                var profitStyle = productSale.Profit > 0 ? goodProfitStyle : (
                                    productSale.Profit == 0 ? cellTextStyle : badProfitStyle
                                );

                                table.Cell()
                                    .Column(column =>
                                    {
                                        column.Item()
                                            .Text(productSale.ProductName)
                                            .Style(cellTextStyle);
                                        column.Item()
                                            .Text(productSale.BrandName)
                                            .Style(brandStyle);
                                    });
                                table.Cell()
                                    .Text($"{productSale.Purchases}")
                                    .Style(cellTextStyle);
                                table.Cell()
                                    .Text(productSale.Costs.ToString("C", CultureInfo.CurrentCulture))
                                    .Style(cellTextStyle);
                                table.Cell()
                                    .Text($"{productSale.Sales}")
                                    .Style(cellTextStyle);
                                table.Cell()
                                    .Text(productSale.Incomes.ToString("C", CultureInfo.CurrentCulture))
                                    .Style(cellTextStyle);
                                table.Cell()
                                    .Text(productSale.Profit.ToString("C", CultureInfo.CurrentCulture))
                                    .Style(profitStyle);
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
