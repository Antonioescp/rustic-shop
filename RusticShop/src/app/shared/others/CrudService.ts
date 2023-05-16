import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/services/categories.service';
import { PaginatedResponse } from '../models/dtos/PaginatedResponse';

export interface CrudService<
  Model,
  ModelCreateDto = Model,
  ModelUpdateDto = ModelCreateDto
> {
  getAll(): Observable<Model[]>;
  getPaginated(pagination: Pagination): Observable<PaginatedResponse<Model>>;
  getById(id: number): Observable<Model>;
  create(data: ModelCreateDto): Observable<HttpResponse<any>>;
  update(data: ModelUpdateDto): Observable<HttpResponse<any>>;
  deleteById(id: number): Observable<HttpResponse<any>>;
}
