import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/services/categories.service';
import { PaginatedResponse } from '../models/dtos/PaginatedResponse';

export interface CrudService<
  Model
> {
  getAll(): Observable<Model[]>;
  getPaginated(pagination: Pagination): Observable<PaginatedResponse<Model>>;
  getById(id: number): Observable<Model>;
  create(data: Partial<Model>): Observable<HttpResponse<any>>;
  update(data: Partial<Model>): Observable<HttpResponse<any>>;
  deleteById(id: number): Observable<HttpResponse<any>>;
}
