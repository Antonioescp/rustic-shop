import {
  Component,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CrudService } from '../../services/CrudService';
import { Pagination } from 'src/app/services/categories.service';

export interface TableColumnDef<Model> {
  def: string;
  header: string;
  sortable?: boolean;
  valueGetter: (row: Model) => string;
}

export interface RowActionsDef<Model> {
  icon: string;
  tooltip: string;
  color: string;
  execute: (row: Model) => void;
}

@Component({
  selector: 'app-crud',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class CrudComponent<Model> implements OnInit {
  @Input() columns: TableColumnDef<Model>[] = [];
  @Input() displayedColumns: string[] = [];

  @Input() actions: RowActionsDef<Model>[] = [];

  @Input() service!: CrudService<Model>;

  // crud settings
  @Input() resourceDeletable = true;
  @Input() resourceEditable = true;

  // paginator settings
  @Input() pageSizeOptions = [5, 10, 20];
  @Input() pageIndex = 0;
  @Input() pageSize = 10;
  @Input() showFirstLastButtons = true;

  // sorting settings
  @Input() sortColumn = '';
  @Input() sortOrder: 'asc' | 'desc' = 'asc';
  @Input() filterColumn = '';
  @Input() filterQuery?: string;

  @Input() createButtonLabel = 'Agregar recurso';

  @Input() title?: string;

  @Input() disableActions = false;
  @Input() isLoading = false;
  isFetchingData = false;

  @Output() createResource = new EventEmitter<void>();
  @Output() deleteResource = new EventEmitter<Model>();
  @Output() editResource = new EventEmitter<Model>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<Model>([]);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(query?: string): void {
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = this.pageIndex;
    pageEvent.pageSize = this.pageSize;
    this.filterQuery = query;
    this.getData(pageEvent);
  }

  getData(pageEvent: PageEvent) {
    this.isFetchingData = true;
    this.service
      .getPaginated(
        new Pagination({
          defaultSortColumn: this.sortColumn,
          defaultSortOrder: this.sortOrder,
          pageIndex: pageEvent.pageIndex,
          pageSize: pageEvent.pageSize,
          sort: this.sort,
          defaultFilterColumn: this.filterColumn,
          filterQuery: this.filterQuery,
        })
      )
      .subscribe({
        next: result => {
          this.paginator.length = result.totalCount;
          this.paginator.pageIndex = result.pageIndex;
          this.paginator.pageSize = result.pageSize;
          this.dataSource.data = result.data;
          this.isFetchingData = false;
        },
        error: error => {
          console.log(error);
          this.isFetchingData = false;
        },
      });
  }
}
