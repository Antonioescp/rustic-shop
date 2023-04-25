﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using RusticShopAPI.Data;

#nullable disable

namespace RusticShopAPI.Data.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.16")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("CategoryProduct", b =>
                {
                    b.Property<long>("CategoriesId")
                        .HasColumnType("bigint");

                    b.Property<long>("ProductsId")
                        .HasColumnType("bigint");

                    b.HasKey("CategoriesId", "ProductsId");

                    b.HasIndex("ProductsId");

                    b.ToTable("CategoryProduct");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("RoleId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Address", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"), 1L, 1);

                    b.Property<string>("City")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Directions")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("HouseNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Neighborhood")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Address");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.BankCard", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"), 1L, 1);

                    b.Property<long>("BillingAddressId")
                        .HasColumnType("bigint");

                    b.Property<string>("CardHolderId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("CardHolderName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CardNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("ExpirationDate")
                        .HasColumnType("DATE");

                    b.HasKey("Id");

                    b.HasIndex("BillingAddressId");

                    b.HasIndex("CardHolderId");

                    b.ToTable("BankCard");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.BillingAddress", b =>
                {
                    b.Property<long>("Id")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.ToTable("BillingAddress");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Cart", b =>
                {
                    b.Property<long>("ProductId")
                        .HasColumnType("bigint");

                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("Quantity")
                        .HasColumnType("int");

                    b.HasKey("ProductId", "UserId");

                    b.HasIndex("UserId");

                    b.ToTable("Carts");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Category", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"), 1L, 1);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Discount", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"), 1L, 1);

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Discounts");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.DiscountProduct", b =>
                {
                    b.Property<long>("DiscountId")
                        .HasColumnType("bigint");

                    b.Property<long>("ProductId")
                        .HasColumnType("bigint");

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("datetime2");

                    b.Property<decimal>("Percentage")
                        .HasColumnType("DECIMAL(3,2)");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("datetime2");

                    b.HasKey("DiscountId", "ProductId");

                    b.HasIndex("ProductId");

                    b.ToTable("DiscountProducts");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Feature", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"), 1L, 1);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Features");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.FeatureProduct", b =>
                {
                    b.Property<long>("FeatureId")
                        .HasColumnType("bigint");

                    b.Property<long>("ProductId")
                        .HasColumnType("bigint");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("FeatureId", "ProductId");

                    b.HasIndex("ProductId");

                    b.ToTable("FeatureProducts");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Product", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"), 1L, 1);

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsPublished")
                        .HasColumnType("BIT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ShortDescription")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal>("UnitPrice")
                        .HasColumnType("MONEY");

                    b.HasKey("Id");

                    b.ToTable("Products");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.ProductImage", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"), 1L, 1);

                    b.Property<long>("ProductId")
                        .HasColumnType("bigint");

                    b.Property<string>("Url")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("ProductId");

                    b.ToTable("ProductImage");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.ProductTransaction", b =>
                {
                    b.Property<long>("ProductId")
                        .HasColumnType("bigint");

                    b.Property<long>("TransactionId")
                        .HasColumnType("bigint");

                    b.Property<long>("Quantity")
                        .HasColumnType("bigint");

                    b.Property<decimal>("UnitPrice")
                        .HasColumnType("MONEY");

                    b.HasKey("ProductId", "TransactionId");

                    b.HasIndex("TransactionId");

                    b.ToTable("ProductTransaction");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Provider", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"), 1L, 1);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Provider");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Purchase", b =>
                {
                    b.Property<long>("Id")
                        .HasColumnType("bigint");

                    b.Property<long>("ProviderId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("ProviderId");

                    b.ToTable("Purchase");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Refund", b =>
                {
                    b.Property<long>("Id")
                        .HasColumnType("bigint");

                    b.Property<long>("BankCardId")
                        .HasColumnType("bigint");

                    b.Property<string>("Reason")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("BankCardId");

                    b.ToTable("Refund");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Sale", b =>
                {
                    b.Property<long>("Id")
                        .HasColumnType("bigint");

                    b.Property<long>("BankCardId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("BankCardId");

                    b.ToTable("Sale");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Transaction", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"), 1L, 1);

                    b.Property<DateTime>("TransactionDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.ToTable("Transaction");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Users.User", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("FirstName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("IdentificationCardNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LastName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Wishlist", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<long>("ProductId")
                        .HasColumnType("bigint");

                    b.HasKey("UserId");

                    b.HasIndex("ProductId");

                    b.ToTable("Wishlists");
                });

            modelBuilder.Entity("CategoryProduct", b =>
                {
                    b.HasOne("RusticShopAPI.Data.Models.Category", null)
                        .WithMany()
                        .HasForeignKey("CategoriesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RusticShopAPI.Data.Models.Product", null)
                        .WithMany()
                        .HasForeignKey("ProductsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("RusticShopAPI.Data.Models.Users.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("RusticShopAPI.Data.Models.Users.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RusticShopAPI.Data.Models.Users.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("RusticShopAPI.Data.Models.Users.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Address", b =>
                {
                    b.HasOne("RusticShopAPI.Data.Models.Users.User", "User")
                        .WithMany("Addresses")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.BankCard", b =>
                {
                    b.HasOne("RusticShopAPI.Data.Models.BillingAddress", "BillingAddress")
                        .WithMany()
                        .HasForeignKey("BillingAddressId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RusticShopAPI.Data.Models.Users.User", "CardHolder")
                        .WithMany("BankCards")
                        .HasForeignKey("CardHolderId");

                    b.Navigation("BillingAddress");

                    b.Navigation("CardHolder");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.BillingAddress", b =>
                {
                    b.HasOne("RusticShopAPI.Data.Models.Address", "Address")
                        .WithOne("BillingAddress")
                        .HasForeignKey("RusticShopAPI.Data.Models.BillingAddress", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Address");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Cart", b =>
                {
                    b.HasOne("RusticShopAPI.Data.Models.Product", "Product")
                        .WithMany()
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RusticShopAPI.Data.Models.Users.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Product");

                    b.Navigation("User");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.DiscountProduct", b =>
                {
                    b.HasOne("RusticShopAPI.Data.Models.Discount", "Discount")
                        .WithMany("DiscountProducts")
                        .HasForeignKey("DiscountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RusticShopAPI.Data.Models.Product", "Product")
                        .WithMany("DiscountProducts")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Discount");

                    b.Navigation("Product");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.FeatureProduct", b =>
                {
                    b.HasOne("RusticShopAPI.Data.Models.Feature", "Feature")
                        .WithMany("FeatureProducts")
                        .HasForeignKey("FeatureId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RusticShopAPI.Data.Models.Product", "Product")
                        .WithMany("FeatureProducts")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Feature");

                    b.Navigation("Product");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.ProductImage", b =>
                {
                    b.HasOne("RusticShopAPI.Data.Models.Product", "Product")
                        .WithMany("Images")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Product");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.ProductTransaction", b =>
                {
                    b.HasOne("RusticShopAPI.Data.Models.Product", "Product")
                        .WithMany("ProductTransactions")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RusticShopAPI.Data.Models.Transaction", "Transaction")
                        .WithMany("ProductTransactions")
                        .HasForeignKey("TransactionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Product");

                    b.Navigation("Transaction");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Purchase", b =>
                {
                    b.HasOne("RusticShopAPI.Data.Models.Transaction", "Transaction")
                        .WithOne("Purchase")
                        .HasForeignKey("RusticShopAPI.Data.Models.Purchase", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RusticShopAPI.Data.Models.Provider", "Provider")
                        .WithMany("Purchases")
                        .HasForeignKey("ProviderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Provider");

                    b.Navigation("Transaction");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Refund", b =>
                {
                    b.HasOne("RusticShopAPI.Data.Models.BankCard", "BankCard")
                        .WithMany()
                        .HasForeignKey("BankCardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RusticShopAPI.Data.Models.Transaction", "Transaction")
                        .WithOne("Refund")
                        .HasForeignKey("RusticShopAPI.Data.Models.Refund", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("BankCard");

                    b.Navigation("Transaction");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Sale", b =>
                {
                    b.HasOne("RusticShopAPI.Data.Models.BankCard", "BankCard")
                        .WithMany()
                        .HasForeignKey("BankCardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RusticShopAPI.Data.Models.Transaction", "Transaction")
                        .WithOne("Sale")
                        .HasForeignKey("RusticShopAPI.Data.Models.Sale", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("BankCard");

                    b.Navigation("Transaction");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Wishlist", b =>
                {
                    b.HasOne("RusticShopAPI.Data.Models.Product", "Product")
                        .WithMany()
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RusticShopAPI.Data.Models.Users.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Product");

                    b.Navigation("User");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Address", b =>
                {
                    b.Navigation("BillingAddress");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Discount", b =>
                {
                    b.Navigation("DiscountProducts");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Feature", b =>
                {
                    b.Navigation("FeatureProducts");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Product", b =>
                {
                    b.Navigation("DiscountProducts");

                    b.Navigation("FeatureProducts");

                    b.Navigation("Images");

                    b.Navigation("ProductTransactions");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Provider", b =>
                {
                    b.Navigation("Purchases");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Transaction", b =>
                {
                    b.Navigation("ProductTransactions");

                    b.Navigation("Purchase");

                    b.Navigation("Refund");

                    b.Navigation("Sale");
                });

            modelBuilder.Entity("RusticShopAPI.Data.Models.Users.User", b =>
                {
                    b.Navigation("Addresses");

                    b.Navigation("BankCards");
                });
#pragma warning restore 612, 618
        }
    }
}
