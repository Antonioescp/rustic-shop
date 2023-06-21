import {
  Component,
  Inject,
  ViewChild,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductVariantsService } from 'src/app/services/product-variants.service';
import { ProductsService } from 'src/app/services/products.service';
import {
  GalleryImage,
  ImageGalleryComponent,
} from 'src/app/shared/components/image-gallery/image-gallery.component';
import { ProductVariant } from 'src/app/shared/models/ProductVariant';

export interface ProductVariantGalleryDialogData {
  productVariantId: number;
}

export interface ProductVariantGalleryDialogResult {
  success: boolean;
  resource: ProductVariant;
}

@Component({
  selector: 'app-product-variant-gallery-dialog',
  templateUrl: './product-variant-gallery-dialog.component.html',
  styleUrls: ['./product-variant-gallery-dialog.component.scss'],
})
export class ProductVariantGalleryDialogComponent
  implements AfterViewInit, OnInit
{
  @ViewChild(ImageGalleryComponent)
  imageGallery!: ImageGalleryComponent<number>;
  productVariant?: ProductVariant;

  availableImages: GalleryImage<number>[] = [];
  productVariantImages: GalleryImage<number>[] = [];

  constructor(
    private variantService: ProductVariantsService,
    private productsService: ProductsService,
    @Inject(MAT_DIALOG_DATA)
    private dialogData: ProductVariantGalleryDialogData,
    private dialogRef: MatDialogRef<
      ProductVariantGalleryDialogComponent,
      ProductVariantGalleryDialogResult
    >
  ) {}

  ngOnInit(): void {
    this.getVariant(this.dialogData.productVariantId);
  }

  ngAfterViewInit(): void {
    this.getProductVariantImages(this.dialogData.productVariantId);
  }

  getVariant(variantId: number) {
    this.variantService.getById(variantId).subscribe({
      next: result => {
        this.productVariant = result;
        this.getProductImages(result.productId);
      },
      error: error => console.error(error),
    });
  }

  getProductImages(productId: number) {
    this.productsService.getImagesByProductId(productId).subscribe({
      next: result => {
        this.availableImages = result.map(image => {
          return {
            url: image.url,
            value: image.id,
          };
        });
      },
      error: error => console.error(error),
    });
  }

  getProductVariantImages(variantId: number) {
    this.variantService.getVariantImagesById(variantId).subscribe({
      next: result => {
        this.productVariantImages = result.map(image => {
          return {
            url: image.url,
            value: image.id,
          };
        });

        this.imageGallery.values = this.productVariantImages
          .map(image => image.value)
          .filter((id, index, array) => array.indexOf(id) === index);
      },
      error: error => console.error(error),
    });
  }

  onSubmit() {
    console.log(this.imageGallery.values);
    console.log(this.productVariantImages);
  }
}
