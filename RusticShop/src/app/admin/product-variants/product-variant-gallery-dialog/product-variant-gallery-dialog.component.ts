import {
  Component,
  Inject,
  ViewChild,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
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

  pendingOperations = 0;
  get isBusy(): boolean {
    return this.pendingOperations > 0;
  }

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
    this.pendingOperations++;
    this.variantService.getById(variantId).subscribe({
      next: result => {
        this.pendingOperations--;
        this.productVariant = result;
        this.getProductImages(result.productId);
      },
      error: error => {
        console.error(error);
        this.pendingOperations--;
      },
    });
  }

  getProductImages(productId: number) {
    this.pendingOperations++;
    this.productsService.getImagesByProductId(productId).subscribe({
      next: result => {
        this.pendingOperations--;
        this.availableImages = result.map(image => {
          return {
            url: image.url,
            value: image.id,
          };
        });
      },
      error: error => {
        console.error(error);
        this.pendingOperations--;
      },
    });
  }

  getProductVariantImages(variantId: number) {
    this.pendingOperations++;
    this.variantService.getVariantImagesById(variantId).subscribe({
      next: result => {
        this.pendingOperations--;
        const uniqueImages: GalleryImage<number>[] = [];
        result.forEach(image => {
          if (!uniqueImages.some(i => i.value === image.id)) {
            uniqueImages.push({
              url: image.url,
              value: image.id,
            });
          }
        });

        this.productVariantImages = uniqueImages;

        this.imageGallery.values = this.productVariantImages.map(
          image => image.value
        );
      },
      error: error => {
        this.pendingOperations--;
        console.error(error);
      },
    });
  }

  async onSubmit() {
    const imagesToDelete = this.productVariantImages
      .filter(pvi => !this.imageGallery.values.includes(pvi.value))
      .map(pvi => pvi.value);

    const imagesToAdd = this.imageGallery.values.filter(
      value => !this.productVariantImages.some(pvi => pvi.value === value)
    );

    this.pendingOperations++;

    const promises: Promise<any>[] = [];

    imagesToAdd.forEach(imageId => {
      promises.push(
        lastValueFrom(
          this.variantService.addImage(
            this.dialogData.productVariantId,
            imageId
          )
        )
      );
    });

    imagesToDelete.forEach(imageId => {
      promises.push(
        lastValueFrom(
          this.variantService.removeImage(
            this.dialogData.productVariantId,
            imageId
          )
        )
      );
    });

    await Promise.allSettled(promises);

    this.dialogRef.close({
      success: true,
      resource: this.productVariant!,
    });
  }
}
