using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using RusticShopAPI.Controllers;
using RusticShopAPI.Data;
using RusticShopAPI.Data.Models;

namespace RusticShopAPI.Tests
{
    [TestFixture]
    public class ProductsController_Tests
    {
        private ProductsController _controller;
        private ApplicationDbContext _context;

        [SetUp]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new ApplicationDbContext(options);

            var products = new List<Product>
            {
                new Product
                {
                    Id = 1,
                    Name = "Huawei",
                    Category = new Category { Id = 1, Name = "Phones" },
                    ShortDescription = "A good phone",
                    Description = "Great phone",
                    Price = 10M,
                    Stock = 10
                },
                new Product
                {
                    Id = 2,
                    Name = "Xiaomi",
                    Category = new Category { Id = 2, Name = "New Category" },
                    ShortDescription = "Calidad precio",
                    Description = "El xiaomi es mejor porque...",
                    Price = 23.12314M,
                    Stock = 20
                }
            };

            _context.AddRange(products);
            _context.SaveChanges();

            _controller = new ProductsController(_context);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        [Test]
        public async Task GetProduct_GetsTheGivenProductById()
        {
            var productExisting = (await _controller.GetProduct(1)).Value;
            var productNonExisting = (await _controller.GetProduct(3)).Value;

            Assert.Multiple(() =>
            {
                Assert.That(productExisting, Is.Not.Null);
                Assert.That(productNonExisting, Is.Null);
            });
        }

        [Test]
        public async Task GetProducts_GetsAllProducts()
        {
            var products = (await _controller.GetProducts()).Value?.ToList();

            Assert.Multiple(() =>
            {
                Assert.That(products, Is.Not.Null);
                Assert.That(products, Has.Count.EqualTo(2));
            });
        }

        [Test]
        public async Task PutProduct_UpdatesTheGivenProduct()
        {
            var product = (await _controller.GetProduct(1)).Value;
            Assert.That(product, Is.Not.Null);
            
            product.Description = "Updated";

            var result = await _controller.PutProduct(product.Id, product);
            Assert.That(result, Is.InstanceOf<NoContentResult>());

            var updatedProduct = (await _controller.GetProduct(1)).Value;
            Assert.That(updatedProduct, Is.Not.Null);
            Assert.That(updatedProduct.Description, Is.EqualTo("Updated"));
        }

        [Test]
        public async Task DeleteProduct_DeletesTheGivenProduct()
        {
            var result = await _controller.DeleteProduct(1);
            Assert.That(result, Is.InstanceOf<NoContentResult>());
        }

        [Test]
        public async Task PostProduct_CreatesOneProduct()
        {
            var newProduct = new Product
            {
                Id = 3,
                Name = "New phone",
                Description = "Jaja",
                ShortDescription = "Jeje",
                Price = 100M,
                Stock = 10,
                CategoryId = 1
            };

            var result = (await _controller.PostProduct(newProduct)).Result;
            var insertedProduct = (await _controller.GetProduct(3)).Value;

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.InstanceOf<CreatedAtActionResult>());
                Assert.That(insertedProduct, Is.Not.Null);
                Assert.That(newProduct, Is.EqualTo(insertedProduct));
            });
        }
    }
}
