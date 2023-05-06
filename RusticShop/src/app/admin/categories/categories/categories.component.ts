import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoriesService } from 'src/app/categories.service';
import Category from 'src/app/shared/models/Category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  categories!: MatTableDataSource<Category>;
  displayedColumns = ['id', 'name', 'actions'];

  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = 'name';
  public defaultSortOrder: 'asc' | 'desc' = 'asc';
  defaultFilterColumn: string = 'name';
  filterQuery?: string;

  isLoadingAction: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(query?: string) {
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.filterQuery = query;
    this.getData(pageEvent);
  }

  getData(event: PageEvent): void {
    this.categoriesService
      .getPaginatedCategories({
        defaultSortColumn: this.defaultSortColumn,
        defaultSortOrder: this.defaultSortOrder,
        pageIndex: event.pageIndex,
        pageSize: event.pageSize,
        sort: this.sort,
        defaultFilterColumn: this.defaultFilterColumn,
        filterQuery: this.filterQuery,
      })
      .subscribe({
        next: (result) => {
          this.paginator.length = result.totalCount;
          this.paginator.pageIndex = result.pageIndex;
          this.paginator.pageSize = result.pageSize;
          this.categories = new MatTableDataSource(result.data);
          this.isLoadingAction = false;
        },
        error: (error) => {
          console.log(error);
          this.isLoadingAction = false;
        },
      });
  }

  deleteCategory(category: Category) {
    this.isLoadingAction = true;
    this.categoriesService.deleteCategory(category.id).subscribe({
      next: (result) => {
        this.loadData();
      },
      error: (error) => {
        console.error(error);
        this.isLoadingAction = false;
      },
    });
  }
}
