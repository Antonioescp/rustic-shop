using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RusticShopAPI.Data.Migrations
{
    public partial class RemoveProvidersRefundsAndPurchases : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                @"DROP TABLE PurchaseDetails;
                DROP TABLE Purchases;
                DROP TABLE RefundDetails;
                DROP TABLE Refunds;
                DROP TABLE Providers;");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                /****** Object:  Table [dbo].[Providers]    Script Date: 21/6/2023 12:12:32 PM ******/
                SET ANSI_NULLS ON
                GO
                SET QUOTED_IDENTIFIER ON
                GO
                CREATE TABLE [dbo].[Providers](
                    [Id] [bigint] IDENTITY(1,1) NOT NULL,
                    [Name] [nvarchar](max) NOT NULL,
                    [PhoneNumber] [nvarchar](max) NULL,
                    [Email] [nvarchar](max) NULL,
                CONSTRAINT [PK_Providers] PRIMARY KEY CLUSTERED 
                (
                    [Id] ASC
                )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
                ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
                GO
                /****** Object:  Table [dbo].[Purchases]    Script Date: 21/6/2023 12:12:32 PM ******/
                SET ANSI_NULLS ON
                GO
                SET QUOTED_IDENTIFIER ON
                GO
                CREATE TABLE [dbo].[Purchases](
                    [Id] [bigint] IDENTITY(1,1) NOT NULL,
                    [ProviderId] [bigint] NOT NULL,
                    [Date] [datetime2](7) NOT NULL,
                CONSTRAINT [PK_Purchases] PRIMARY KEY CLUSTERED 
                (
                    [Id] ASC
                )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
                ) ON [PRIMARY]
                GO
                /****** Object:  Table [dbo].[PurchaseDetails]    Script Date: 21/6/2023 12:12:32 PM ******/
                SET ANSI_NULLS ON
                GO
                SET QUOTED_IDENTIFIER ON
                GO
                CREATE TABLE [dbo].[PurchaseDetails](
                    [Id] [bigint] IDENTITY(1,1) NOT NULL,
                    [PurchaseId] [bigint] NOT NULL,
                    [ProductVariantId] [bigint] NOT NULL,
                    [Quantity] [bigint] NOT NULL,
                    [UnitPrice] [money] NOT NULL,
                CONSTRAINT [PK_PurchaseDetails] PRIMARY KEY CLUSTERED 
                (
                    [Id] ASC
                )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
                ) ON [PRIMARY]
                GO
                /****** Object:  Table [dbo].[Refunds]    Script Date: 21/6/2023 12:12:32 PM ******/
                SET ANSI_NULLS ON
                GO
                SET QUOTED_IDENTIFIER ON
                GO
                CREATE TABLE [dbo].[Refunds](
                    [Id] [bigint] IDENTITY(1,1) NOT NULL,
                    [UserId] [nvarchar](450) NOT NULL,
                    [OrderId] [bigint] NOT NULL,
                    [Reason] [text] NOT NULL,
                    [Date] [datetime2](7) NOT NULL,
                CONSTRAINT [PK_Refunds] PRIMARY KEY CLUSTERED 
                (
                    [Id] ASC
                )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
                ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
                GO
                /****** Object:  Table [dbo].[RefundDetails]    Script Date: 21/6/2023 12:12:32 PM ******/
                SET ANSI_NULLS ON
                GO
                SET QUOTED_IDENTIFIER ON
                GO
                CREATE TABLE [dbo].[RefundDetails](
                    [Id] [bigint] IDENTITY(1,1) NOT NULL,
                    [RefundId] [bigint] NOT NULL,
                    [ProductVariantId] [bigint] NOT NULL,
                    [Quantity] [bigint] NOT NULL,
                CONSTRAINT [PK_RefundDetails] PRIMARY KEY CLUSTERED 
                (
                    [Id] ASC
                )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
                ) ON [PRIMARY]
                GO
                ALTER TABLE [dbo].[PurchaseDetails]  WITH CHECK ADD  CONSTRAINT [FK_PurchaseDetails_ProductVariants_ProductVariantId] FOREIGN KEY([ProductVariantId])
                REFERENCES [dbo].[ProductVariants] ([Id])
                ON DELETE CASCADE
                GO
                ALTER TABLE [dbo].[PurchaseDetails] CHECK CONSTRAINT [FK_PurchaseDetails_ProductVariants_ProductVariantId]
                GO
                ALTER TABLE [dbo].[PurchaseDetails]  WITH CHECK ADD  CONSTRAINT [FK_PurchaseDetails_Purchases_PurchaseId] FOREIGN KEY([PurchaseId])
                REFERENCES [dbo].[Purchases] ([Id])
                ON DELETE CASCADE
                GO
                ALTER TABLE [dbo].[PurchaseDetails] CHECK CONSTRAINT [FK_PurchaseDetails_Purchases_PurchaseId]
                GO
                ALTER TABLE [dbo].[Purchases]  WITH CHECK ADD  CONSTRAINT [FK_Purchases_Providers_ProviderId] FOREIGN KEY([ProviderId])
                REFERENCES [dbo].[Providers] ([Id])
                ON DELETE CASCADE
                GO
                ALTER TABLE [dbo].[Purchases] CHECK CONSTRAINT [FK_Purchases_Providers_ProviderId]
                GO
                ALTER TABLE [dbo].[RefundDetails]  WITH CHECK ADD  CONSTRAINT [FK_RefundDetails_ProductVariants_ProductVariantId] FOREIGN KEY([ProductVariantId])
                REFERENCES [dbo].[ProductVariants] ([Id])
                ON DELETE CASCADE
                GO
                ALTER TABLE [dbo].[RefundDetails] CHECK CONSTRAINT [FK_RefundDetails_ProductVariants_ProductVariantId]
                GO
                ALTER TABLE [dbo].[RefundDetails]  WITH CHECK ADD  CONSTRAINT [FK_RefundDetails_Refunds_RefundId] FOREIGN KEY([RefundId])
                REFERENCES [dbo].[Refunds] ([Id])
                ON DELETE CASCADE
                GO
                ALTER TABLE [dbo].[RefundDetails] CHECK CONSTRAINT [FK_RefundDetails_Refunds_RefundId]
                GO
                ALTER TABLE [dbo].[Refunds]  WITH CHECK ADD  CONSTRAINT [FK_Refunds_AspNetUsers_UserId] FOREIGN KEY([UserId])
                REFERENCES [dbo].[AspNetUsers] ([Id])
                ON DELETE CASCADE
                GO
                ALTER TABLE [dbo].[Refunds] CHECK CONSTRAINT [FK_Refunds_AspNetUsers_UserId]
                GO
                ALTER TABLE [dbo].[Refunds]  WITH CHECK ADD  CONSTRAINT [FK_Refunds_Orders_OrderId] FOREIGN KEY([OrderId])
                REFERENCES [dbo].[Orders] ([Id])
                ON DELETE CASCADE
                GO
                ALTER TABLE [dbo].[Refunds] CHECK CONSTRAINT [FK_Refunds_Orders_OrderId]
                GO
                ALTER TABLE [dbo].[PurchaseDetails]  WITH CHECK ADD  CONSTRAINT [CK_PurchaseDetails_Quantity_Range] CHECK  (([Quantity]>=(1)))
                GO
                ALTER TABLE [dbo].[PurchaseDetails] CHECK CONSTRAINT [CK_PurchaseDetails_Quantity_Range]
                GO
                ALTER TABLE [dbo].[RefundDetails]  WITH CHECK ADD  CONSTRAINT [CK_RefundDetails_Quantity_Range] CHECK  (([Quantity]>(0)))
                GO
                ALTER TABLE [dbo].[RefundDetails] CHECK CONSTRAINT [CK_RefundDetails_Quantity_Range]
                GO
            ");
        }
    }
}
