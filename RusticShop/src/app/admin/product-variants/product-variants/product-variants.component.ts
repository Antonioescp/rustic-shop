import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProductVariantsService } from 'src/app/services/product-variants.service';
import {
  BaseEditDialogData,
  BaseEditDialogResult,
} from 'src/app/shared/components/base-edit-dialog.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
  ConfirmDialogResult,
} from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ProductVariant } from 'src/app/shared/models/ProductVariant';
import { ProductVariantEditDialogComponent } from '../product-variant-edit-dialog/product-variant-edit-dialog.component';
import { ProductVariantListItem } from 'src/app/shared/models/dtos/product-variants/ProductVariantListItem';
import { Pagination } from 'src/app/services/categories.service';

@Component({
  selector: 'app-product-variants',
  templateUrl: './product-variants.component.html',
  styleUrls: ['./product-variants.component.scss'],
})
export class ProductVariantsComponent implements OnInit {
  variants!: MatTableDataSource<ProductVariantListItem>;
  displayedColumns = [
    'id',
    'productName',
    'productBrandName',
    'sku',
    'unitPrice',
    'isPublished',
    'actions',
  ];

  defaultPageIndex = 0;
  defaultPageSize = 10;
  public defaultSortColumn = 'id';
  public defaultSortOrder: 'asc' | 'desc' = 'asc';
  defaultFilterColumn = 'sku';
  filterQuery?: string;

  isLoadingAction = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productVariantsService: ProductVariantsService,
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
    this.productVariantsService
      .getPaginatedListItem(
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
          this.variants = new MatTableDataSource(result.data);
          this.isLoadingAction = false;
        },
        error: error => {
          console.log(error);
          this.isLoadingAction = false;
        },
      });
  }

  onDeleteVariant(productVariant: ProductVariant): void {
    const dialogRef = this.dialog.open<
      ConfirmDialogComponent,
      ConfirmDialogData,
      ConfirmDialogResult
    >(ConfirmDialogComponent, {
      data: {
        title: `Eliminar la variante ${productVariant.sku}`,
        message: `¿Está seguro de que desea eliminar la variante ${productVariant.sku}?`,
        confirmColor: 'warn',
        confirmIcon: 'warning',
        cancelColor: 'primary',
        cancelIcon: 'cancel',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmed) {
        this.deleteVariant(productVariant);
      }
    });
  }

  deleteVariant(productVariant: ProductVariant) {
    this.isLoadingAction = true;
    this.productVariantsService.deleteById(productVariant.id).subscribe({
      next: () => {
        this.loadData();
        this.snackBar.open(
          `Variante "${productVariant.sku} eliminado con éxito."`
        );
      },
      error: error => {
        console.error(error);
        this.snackBar.open(
          `Variante "${productVariant.sku} no se ha podido eliminar."`
        );
      },
      complete: () => (this.isLoadingAction = false),
    });
  }

  onCreateVariant(): void {
    const dialogRef = this.dialog.open<
      ProductVariantEditDialogComponent,
      BaseEditDialogData,
      BaseEditDialogResult<ProductVariant>
    >(ProductVariantEditDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.loadData();
        this.snackBar.open(
          `Variante "${result.resource.sku}" ha sido creado con éxito.`
        );
      } else if (result?.success == false) {
        this.snackBar.open(
          `Variante "${result.resource.sku}" no se ha podido crear.`
        );
      }
    });
  }

  onUpdateVariant(id: number): void {
    const dialogRef = this.dialog.open<
      ProductVariantEditDialogComponent,
      BaseEditDialogData,
      BaseEditDialogResult<ProductVariant>
    >(ProductVariantEditDialogComponent, {
      data: { id },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.loadData();
        this.snackBar.open(
          `Variante "${result.resource.sku}" ha sido actualizado con éxito.`
        );
      } else if (result?.success == false) {
        this.snackBar.open(
          `Variante "${result.resource.sku}" no se ha podido actualizar.`
        );
      }
    });
  }
}
