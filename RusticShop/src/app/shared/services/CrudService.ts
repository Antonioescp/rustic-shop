import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/services/categories.service';
import { PaginatedResponse } from '../models/dtos/PaginatedResponse';

export interface CrudService<
  Model,
  IdType = number,
  CreateDto = Partial<Model>,
  UpdateDto = Partial<Model>
> {
  getAll(): Observable<Model[]>;
  getPaginated(pagination: Pagination): Observable<PaginatedResponse<Model>>;
  getById(id: IdType): Observable<Model>;
  create(data: CreateDto): Observable<HttpResponse<any>>;
  update(data: UpdateDto, id: IdType): Observable<HttpResponse<any>>;
  deleteById(id: IdType): Observable<HttpResponse<any>>;
}
