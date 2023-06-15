import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  CategoriesService,
  Pagination,
} from 'src/app/services/categories.service';
import Category from 'src/app/shared/models/Category';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
  ConfirmDialogResult,
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import {
  CategoryEditDialogComponent,
  CategoryEditDialogData,
  CategoryEditDialogResult,
} from '../category-edit-dialog/category-edit-dialog.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  categories!: MatTableDataSource<Category>;
  displayedColumns = ['id', 'name', 'description', 'actions'];

  defaultPageIndex = 0;
  defaultPageSize = 10;
  public defaultSortColumn = 'name';
  public defaultSortOrder: 'asc' | 'desc' = 'asc';
  defaultFilterColumn = 'name';
  filterQuery?: string;

  isLoadingAction = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

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
      .getPaginated(
        new Pagination({
          defaultSortColumn: this.defaultSortColumn,
          defaultSortOrder: this.defaultSortOrder,
          pageIndex: event.pageIndex,
          pageSize: event.pageSize,
          sort: this.sort,
          defaultFilterColumn: this.defaultFilterColumn,
          filterQuery: this.filterQuery,
        })
      )
      .subscribe({
        next: result => {
          this.paginator.length = result.totalCount;
          this.paginator.pageIndex = result.pageIndex;
          this.paginator.pageSize = result.pageSize;
          this.categories = new MatTableDataSource(result.data);
          this.isLoadingAction = false;
        },
        error: error => {
          console.log(error);
          this.isLoadingAction = false;
        },
      });
  }

  onDeleteCategory(category: Category): void {
    const dialogRef = this.dialog.open<
      ConfirmDialogComponent,
      ConfirmDialogData,
      ConfirmDialogResult
    >(ConfirmDialogComponent, {
      data: {
        title: `Eliminar categoría ${category.name}`,
        message: `¿Estás seguro de que deseas eliminar la categoría ${category.name}?`,
        confirmColor: 'warn',
        cancelColor: 'primary',
        confirmIcon: 'warning',
        cancelIcon: 'cancel',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmed) {
        this.deleteCategory(category);
      }
    });
  }

  deleteCategory(category: Category) {
    this.isLoadingAction = true;
    this.categoriesService.deleteById(category.id).subscribe({
      next: () => {
        this.loadData();
        this.snackBar.open(`Categoría "${category.name}" eliminada con éxito.`);
      },
      error: error => {
        console.error(error);
        this.isLoadingAction = false;
        this.snackBar.open(`Categoría "${category.name}" no se pudo eliminar.`);
      },
    });
  }

  onCreateCategory(): void {
    const dialogRef = this.dialog.open<
      CategoryEditDialogComponent,
      CategoryEditDialogData,
      CategoryEditDialogResult
    >(CategoryEditDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.loadData();
        this.snackBar.open(
          `Categoría "${result.category.name}" creada con éxito.`
        );
      } else if (result?.success == false) {
        this.snackBar.open(`No ha sido posible crear la categoría.`);
      }
    });
  }

  onEditCategory(id: number): void {
    const dialogRef = this.dialog.open<
      CategoryEditDialogComponent,
      CategoryEditDialogData,
      CategoryEditDialogResult
    >(CategoryEditDialogComponent, {
      data: { id },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.loadData();
        this.snackBar.open(
          `Categoría "${result.category.name}" actualizada con éxito.`
        );
      } else if (result?.success == false) {
        this.snackBar.open(`No se ha podido actualizar la categoría`);
      }
    });
  }
}
