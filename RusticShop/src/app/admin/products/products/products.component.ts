import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/shared/models/Product';
import {
  BaseEditDialogData,
  BaseEditDialogResult,
} from '../../../shared/components/base-edit-dialog.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
  ConfirmDialogResult,
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ProductEditDialogComponent } from '../product-edit-dialog/product-edit-dialog.component';
import {
  ProductEditSchemaDialogComponent,
  ProductEditSchemaDialogData,
  ProductEditSchemaDialogResult,
} from '../product-edit-schema-dialog/product-edit-schema-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products!: MatTableDataSource<Product>;
  displayedColumns = [
    'id',
    'name',
    'shortDescription',
    'description',
    'isPublished',
    'actions',
  ];

  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = 'name';
  public defaultSortOrder: 'asc' | 'desc' = 'asc';
  defaultFilterColumn: string = 'name';
  filterQuery?: string;

  isLoadingAction: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productsService: ProductsService,
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
    this.productsService
      .getPaginated({
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
          this.products = new MatTableDataSource(result.data);
          this.isLoadingAction = false;
        },
        error: (error) => {
          console.log(error);
          this.isLoadingAction = false;
        },
      });
  }

  onDelete(product: Product): void {
    const dialogRef = this.dialog.open<
      ConfirmDialogComponent,
      ConfirmDialogData,
      ConfirmDialogResult
    >(ConfirmDialogComponent, {
      data: {
        title: `Eliminar product ${product.name}`,
        message: `¿Está seguro de que desea elimnar ${product.name}? Todas sus variantes serán eliminadas.`,
        cancelColor: 'primary',
        confirmColor: 'warn',
        cancelIcon: 'cancel',
        confirmIcon: 'warning',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.confirmed) {
        this.deleteProduct(product);
      }
    });
  }

  deleteProduct(product: Product) {
    this.isLoadingAction = true;
    this.productsService.deleteById(product.id).subscribe({
      next: (result) => {
        this.loadData();
        this.snackBar.open(`Producto "${product.name}" eliminado con éxito.`);
      },
      error: (error) => {
        console.error(error);
        this.isLoadingAction = false;
        this.snackBar.open(
          `El producto "${product.name}" no se ha podido eliminar.`
        );
      },
    });
  }

  onCreateProduct(): void {
    const dialogRef = this.dialog.open<
      ProductEditDialogComponent,
      BaseEditDialogData,
      BaseEditDialogResult<Product>
    >(ProductEditDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        this.snackBar.open(
          `Producto "${result.resource.name}" creado con éxito.`
        );
        this.loadData();
      } else if (result?.success == false) {
        this.snackBar.open(
          `Producto "${result.resource.name}" no se ha podido crear.`
        );
        this.loadData();
      }
    });
  }

  onUpdateProduct(id: number): void {
    const dialogRef = this.dialog.open<
      ProductEditDialogComponent,
      BaseEditDialogData,
      BaseEditDialogResult<Product>
    >(ProductEditDialogComponent, {
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        this.snackBar.open(
          `Producto "${result.resource.name}" actualizado con éxito.`
        );
        this.loadData();
      } else if (result?.success == false) {
        this.snackBar.open(
          `Producto "${result.resource.name}" no se ha podido actualizado.`
        );
        this.loadData();
      }
    });
  }

  onEditSchema(id: number): void {
    const dialogRef = this.dialog.open<
      ProductEditSchemaDialogComponent,
      ProductEditSchemaDialogData,
      ProductEditSchemaDialogResult
    >(ProductEditSchemaDialogComponent, {
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        this.snackBar.open('Actualizado');
      }
    });
  }
}
