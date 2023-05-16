import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BrandsService } from 'src/app/services/brands.service';
import Brand from 'src/app/shared/models/Brand';
import {
  BrandEditDialogComponent,
  BrandEditDialogData,
  BrandEditDialogResult,
} from '../brand-edit-dialog/brand-edit-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
})
export class BrandsComponent implements OnInit {
  brands!: MatTableDataSource<Brand>;
  displayedColumns = ['id', 'name', 'actions'];

  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = 'name';
  public defaultSortOrder: 'asc' | 'desc' = 'asc';
  defaultFilterColumn: string = 'name';
  filterQuery?: string;

  isLoadingAction: boolean = false;

  readonly brandEditDialogConfig: MatDialogConfig<BrandEditDialogData> = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private brandsService: BrandsService,
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
    this.brandsService
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
          this.brands = new MatTableDataSource(result.data);
          this.isLoadingAction = false;
        },
        error: (error) => {
          console.log(error);
          this.isLoadingAction = false;
        },
      });
  }

  onDeleteBrand(brand: Brand) {
    this.isLoadingAction = true;
    this.brandsService.deleteById(brand.id).subscribe({
      next: (_) => {
        this.loadData();
        this.snackBar.open(`Marca "${brand.name}" eliminada con éxito.`);
      },
      error: (error) => {
        console.error(error);
        this.isLoadingAction = false;
        this.snackBar.open(`La marca "${brand.name}" no se pudo eliminar.`);
      },
    });
  }

  onCreateBrand(): void {
    const dialogRef = this.dialog.open<
      BrandEditDialogComponent,
      BrandEditDialogData,
      BrandEditDialogResult
    >(BrandEditDialogComponent, this.brandEditDialogConfig);

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result?.success) {
          this.loadData();
          this.snackBar.open(`Marca "${result.brand.name}" creada con éxito`);
        } else if (result?.success == false) {
          this.snackBar.open(
            `La marca "${result.brand.name}" no pudo ser creada`
          );
        }
      },
      error: (error) => console.error(error),
    });
  }

  onEditBrand(brandId: number) {
    const dialogRef = this.dialog.open<
      BrandEditDialogComponent,
      BrandEditDialogData,
      BrandEditDialogResult
    >(BrandEditDialogComponent, {
      ...this.brandEditDialogConfig,
      data: {
        id: brandId,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result?.success) {
          this.loadData();
          this.snackBar.open(
            `Marca "${result.brand.name}" actualizada con éxito.`
          );
        } else if (result?.success) {
          this.snackBar.open(
            `La marca "${result.brand.name}" no pudo ser actualizada.`
          );
        }
      },
      error: (error) => console.error(error),
    });
  }
}
