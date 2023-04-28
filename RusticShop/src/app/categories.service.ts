import { Injectable } from '@angular/core';
import Category from './shared/models/Category';
import { Observable } from 'rxjs';

const categories: Category[] = [
  { id: 1, name: 'Smartphone' },
  { id: 2, name: 'Laptop' },
  { id: 3, name: 'Desktop' },
  { id: 4, name: 'Smart Watch' },
];

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor() { }

  getCategories(): Observable<Category[]> {
    return new Observable(sub => sub.next(categories));
  }
}
