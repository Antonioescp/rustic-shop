import { Component, Input, OnChanges } from '@angular/core';

export interface GalleryImage<Value> {
  value: Value;
  url: string;
}

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
})
export class ImageGalleryComponent<Value> implements OnChanges {
  @Input() images: GalleryImage<Value>[] = [];
  @Input() selectable = true;
  @Input() values: Value[] = [];

  public ngOnChanges(): void {
    // keep values updated with any change in images
    this.values = this.values.filter(value =>
      this.images.some(image => image.value === value)
    );
  }

  public isImageSelected(image: GalleryImage<Value>): boolean {
    return this.values.includes(image.value);
  }

  public getSelectedIndex(image: GalleryImage<Value>): number {
    return this.values.indexOf(image.value);
  }

  onImageClick(image: GalleryImage<Value>) {
    if (this.values.includes(image.value)) {
      this.values = this.values.filter(value => value !== image.value);
    } else {
      this.values.push(image.value);
    }

    console.log(this.values);
  }
}
