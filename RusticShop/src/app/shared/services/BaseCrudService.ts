import { Observable } from 'rxjs';
import { CrudService } from './CrudService';
import { Pagination } from 'src/app/services/categories.service';
import { PaginatedResponse } from '../models/dtos/PaginatedResponse';
import { HttpClient, HttpResponse } from '@angular/common/http';

export abstract class BaseCrudService<
  Model,
  IdType = number,
  CreateDto = Partial<Model>,
  UpdateDto = Partial<Model>
> implements CrudService<Model, IdType, CreateDto, UpdateDto>
{
  constructor(protected resourceUrl: string, protected http: HttpClient) {}

  getAll(): Observable<Model[]> {
    return this.http.get<Model[]>(this.resourceUrl);
  }

  getPaginated(pagination: Pagination): Observable<PaginatedResponse<Model>> {
    const params = pagination.toHttpParams();
    return this.http.get<any>(this.resourceUrl + 'paginated', { params });
  }

  getById(id: IdType): Observable<Model> {
    return this.http.get<Model>(`${this.resourceUrl}${id}`);
  }

  create(data: CreateDto): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.resourceUrl, data);
  }

  update(data: UpdateDto, id: IdType): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${this.resourceUrl}${id}`, data);
  }

  deleteById(id: IdType): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}${id}`);
  }
}
