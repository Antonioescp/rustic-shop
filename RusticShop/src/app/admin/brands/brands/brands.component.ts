import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BrandsService } from 'src/app/services/brands.service';
import Brand from 'src/app/shared/models/Brand';
import {
  BrandEditDialogComponent,
  BrandEditDialogData,
  BrandEditDialogResult,
} from '../brand-edit-dialog/brand-edit-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
  ConfirmDialogResult,
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import {
  RowActionsDef,
  TableActionDef,
  TableColumnDef,
  TableComponent,
} from 'src/app/shared/components/table/table.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
})
export class BrandsComponent implements AfterViewInit {
  @ViewChild(TableComponent) table!: TableComponent<Brand>;

  columns: TableColumnDef<Brand>[] = [
    {
      def: 'id',
      header: 'ID',
      valueGetter: brand => brand.id.toString(),
      sortable: true,
    },
    {
      def: 'name',
      header: 'Nombre',
      valueGetter: brand => brand.name,
      sortable: true,
    },
  ];

  displayedColumns = [...this.columns.map(column => column.def), 'actions'];

  tableActions: TableActionDef[] = [
    {
      label: 'Agregar marca',
      icon: 'add',
      execute: () => this.onCreateBrand(),
      color: 'primary',
    },
  ];

  rowActions: RowActionsDef<Brand>[] = [
    {
      tooltip: 'Editar',
      icon: 'edit',
      execute: brand => this.onEditBrand(brand.id),
      color: 'primary',
    },
    {
      tooltip: 'Eliminar',
      icon: 'delete_forever',
      execute: brand => this.onDeleteBrand(brand),
      color: 'warn',
    },
  ];

  constructor(
    private brandsService: BrandsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit(): void {
    this.fetchData({ pageIndex: 0, pageSize: 5, length: 0 });
  }

  fetchData(pageEvent: PageEvent) {
    this.brandsService
      .getPaginated(this.table.getPagination(pageEvent))
      .subscribe({
        next: paginatedBrands => {
          this.table.updateWithResults(paginatedBrands);
        },
        error: error => console.error(error),
      });
  }

  onDeleteBrand(brand: Brand) {
    const dialogRef = this.dialog.open<
      ConfirmDialogComponent,
      ConfirmDialogData,
      ConfirmDialogResult
    >(ConfirmDialogComponent, {
      data: {
        title: `Eliminar la marca ${brand.name}`,
        message: `¿Estás seguro de que deseas eliminar la marca ${brand.name}? Todos los productos con esta serán eliminados.`,
        cancelColor: 'primary',
        confirmColor: 'warn',
        cancelIcon: 'cancel',
        confirmIcon: 'warning',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmed) {
        this.deleteBrand(brand);
      }
    });
  }

  deleteBrand(brand: Brand): void {
    this.brandsService.deleteById(brand.id).subscribe({
      next: () => {
        this.table.loadData();
        this.snackBar.open(`Marca "${brand.name}" eliminada con éxito.`);
      },
      error: error => {
        console.error(error);
        this.snackBar.open(`La marca "${brand.name}" no se pudo eliminar.`);
      },
    });
  }

  onCreateBrand(): void {
    const dialogRef = this.dialog.open<
      BrandEditDialogComponent,
      BrandEditDialogData,
      BrandEditDialogResult
    >(BrandEditDialogComponent);

    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result?.success) {
          this.table.loadData();
          this.snackBar.open(`Marca "${result.brand.name}" creada con éxito`);
        } else if (result?.success == false) {
          this.snackBar.open(
            `La marca "${result.brand.name}" no pudo ser creada`
          );
        }
      },
      error: error => console.error(error),
    });
  }

  onEditBrand(brandId: number) {
    const dialogRef = this.dialog.open<
      BrandEditDialogComponent,
      BrandEditDialogData,
      BrandEditDialogResult
    >(BrandEditDialogComponent, {
      data: {
        id: brandId,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result?.success) {
          this.table.loadData();
          this.snackBar.open(
            `Marca "${result.brand.name}" actualizada con éxito.`
          );
        } else if (result?.success === false) {
          this.snackBar.open(
            `La marca "${result.brand.name}" no pudo ser actualizada.`
          );
        }
      },
      error: error => console.error(error),
    });
  }
}
