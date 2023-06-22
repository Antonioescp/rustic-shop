import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductImageService } from 'src/app/services/product-image.service';
import { ProductsService } from 'src/app/services/products.service';
import {
  GalleryImage,
  ImageGalleryComponent,
} from 'src/app/shared/components/image-gallery/image-gallery.component';
import { Product } from 'src/app/shared/models/Product';
import { lastValueFrom } from 'rxjs';

export interface ProductGalleryDialogData {
  productId: number;
}

export interface ProductGalleryDialogResult {
  resource: Product;
  success: boolean;
}

@Component({
  selector: 'app-product-gallery-dialog',
  templateUrl: './product-gallery-dialog.component.html',
  styleUrls: ['./product-gallery-dialog.component.scss'],
})
export class ProductGalleryDialogComponent implements OnInit {
  @ViewChild(ImageGalleryComponent, { static: false })
  imageGallery!: ImageGalleryComponent<number>;

  product?: Product;
  productImages: GalleryImage<number>[] = [];
  imagesToDelete: GalleryImage<number>[] = [];

  isBusy = false;

  filesToUpload: File[] = [];
  private imagesFileMap = new Map<string, string>();

  constructor(
    private productsService: ProductsService,
    private productsImageService: ProductImageService,
    @Inject(MAT_DIALOG_DATA) private dialogData: ProductGalleryDialogData,
    private dialogRef: MatDialogRef<
      ProductGalleryDialogComponent,
      ProductGalleryDialogResult
    >
  ) {}

  ngOnInit(): void {
    this.getProduct(this.dialogData.productId);
    this.getProductImages(this.dialogData.productId);
  }

  getProduct(productId: number) {
    this.isBusy = true;
    this.productsService.getById(productId).subscribe({
      next: product => {
        this.product = product;
        this.isBusy = false;
      },
      error: err => {
        console.log(err);
        this.isBusy = false;
      },
    });
  }

  getProductImages(productId: number) {
    this.productsService.getImagesByProductId(productId).subscribe({
      next: images => {
        this.productImages = images.map(image => ({
          value: image.id,
          url: image.url,
        }));
      },
      error: error => console.error(error),
    });
  }

  onDeleteSelected() {
    this.imagesToDelete.push(
      ...this.productImages.filter(img => {
        return this.imageGallery.values.includes(img.value) && img.value > 0;
      })
    );

    this.productImages = this.productImages.filter(img => {
      return !this.imageGallery.values.includes(img.value);
    });

    const selectedImages = this.imageGallery.images.filter(img =>
      this.imageGallery.values.includes(img.value)
    );

    this.filesToUpload = this.filesToUpload.filter(file => {
      const url = this.getFileUrl(file);
      return !selectedImages.some(img => {
        return img.url === url;
      });
    });
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const newFiles = Array.from(files);
    this.filesToUpload.push(...newFiles);

    // adding them to product images
    this.productImages = [
      ...this.productImages,
      ...newFiles.map((file, index) => ({
        value: this.productImages.length * -1 + index,
        url: this.getFileUrl(file),
      })),
    ];
  }

  getFileUrl(file: File): string {
    if (!this.imagesFileMap.has(file.name)) {
      this.imagesFileMap.set(file.name, URL.createObjectURL(file));
    }
    return this.imagesFileMap.get(file.name) ?? '';
  }

  async onSubmit() {
    const promises: Promise<any>[] = [];

    this.isBusy = true;

    this.imagesToDelete.forEach(image => {
      const { value } = image;
      if (this.product) {
        promises.push(
          lastValueFrom(
            this.productsService.deleteImage(this.product.id, value)
          )
        );
      }
    });

    if (this.product) {
      promises.push(
        lastValueFrom(
          this.productsService.uploadImages(this.product.id, this.filesToUpload)
        )
      );
    }

    try {
      await Promise.allSettled(promises);
    } catch (error) {
      console.error(error);
    } finally {
      this.isBusy = false;
    }

    if (this.product) {
      this.dialogRef.close({
        resource: this.product,
        success: true,
      });
    }
  }
}
