import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriesService } from 'src/app/services/categories.service';
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
import {
  RowActionsDef,
  TableActionDef,
  TableColumnDef,
  TableComponent,
} from 'src/app/shared/components/table/table.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements AfterViewInit {
  @ViewChild(TableComponent) table!: TableComponent<Category>;

  columns: TableColumnDef<Category>[] = [
    {
      def: 'id',
      header: 'ID',
      valueGetter: category => category.id.toString(),
      sortable: true,
    },
    {
      def: 'name',
      header: 'Nombre',
      valueGetter: category => category.name,
      sortable: true,
    },
    {
      def: 'description',
      header: 'Descripción',
      valueGetter: category => category.description,
      sortable: true,
    },
  ];

  displayedColumns = [...this.columns.map(c => c.def), 'actions'];

  tableActions: TableActionDef[] = [
    {
      label: 'Agregar categoría',
      icon: 'add',
      execute: () => this.onCreateCategory(),
      color: 'primary',
    },
  ];

  rowActions: RowActionsDef<Category>[] = [
    {
      tooltip: 'Editar',
      icon: 'edit',
      execute: category => this.onEditCategory(category.id),
      color: 'primary',
    },
    {
      tooltip: 'Eliminar',
      icon: 'delete',
      execute: category => this.onDeleteCategory(category),
      color: 'warn',
    },
  ];

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit(): void {
    this.fetchData({ pageIndex: 0, pageSize: 5, length: 0 });
  }

  fetchData(pageEvent: PageEvent): void {
    this.categoriesService
      .getPaginated(this.table.getPagination(pageEvent))
      .subscribe({
        next: response => {
          this.table.updateWithResults(response);
        },
        error: error => {
          console.error(error);
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
    this.categoriesService.deleteById(category.id).subscribe({
      next: () => {
        this.table.loadData();
        this.snackBar.open(`Categoría "${category.name}" eliminada con éxito.`);
      },
      error: error => {
        console.error(error);
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
        this.table.loadData();
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
        this.table.loadData();
        this.snackBar.open(
          `Categoría "${result.category.name}" actualizada con éxito.`
        );
      } else if (result?.success == false) {
        this.snackBar.open(`No se ha podido actualizar la categoría`);
      }
    });
  }
}
