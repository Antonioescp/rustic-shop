export default interface VProductList {
  id: number;
  name: string;
  shortDescription: string;
  description?: string;
  unitPrice: number;
  categories?: string;
  features?: string;
  imagesCount: string;
  discountsCount: string;
  isPublished: boolean;
}

export interface VProductListFeature {
  name: string;
  content: string;
}

export function getVProductListCategories(item: VProductList): string[] {
  return item.categories?.split(',') ?? [];
}

export function getFeatures(item: VProductList): VProductListFeature[] {
  return item.features?.split(';').map( feature => {
    const [name, content] = feature.split(':');
    return { name, content };
  }) ?? [];
}
