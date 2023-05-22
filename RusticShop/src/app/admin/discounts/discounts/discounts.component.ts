import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DiscountsService } from 'src/app/services/discounts.service';
import Discount from 'src/app/shared/models/Discount';
import { BaseEditDialogData, BaseEditDialogResult } from '../../../shared/components/base-edit-dialog.component';
import { DiscountEditDialogComponent } from '../discount-edit-dialog/discount-edit-dialog.component';

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.scss'],
})
export class DiscountsComponent implements OnInit {
  discounts!: MatTableDataSource<Discount>;
  displayedColumns = ['id', 'name', 'description', 'actions'];

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
    private discountsService: DiscountsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

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
    this.discountsService
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
          this.discounts = new MatTableDataSource(result.data);
          this.isLoadingAction = false;
        },
        error: (error) => {
          console.log(error);
          this.isLoadingAction = false;
        },
      });
  }

  deleteFeature(discount: Discount) {
    this.isLoadingAction = true;
    this.discountsService.deleteById(discount.id).subscribe({
      next: (result) => {
        this.loadData();
        this.snackBar.open(`Descuento "${discount.name}" eliminado con éxito.`);
      },
      error: (error) => {
        console.error(error);
        this.isLoadingAction = false;
        this.snackBar.open(`Descuento "${discount.name}" no pudo ser eliminado.`);
      },
      complete: () => (this.isLoadingAction = false),
    });
  }

  onCreateDiscount(): void {
    const dialogRef = this.dialog.open<
      DiscountEditDialogComponent,
      BaseEditDialogData,
      BaseEditDialogResult<Discount>
      >(DiscountEditDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.loadData();
        this.snackBar.open(`Descuento "${result.resource.name}" creado con éxito.`);
      } else if (result?.success == false) {
        this.snackBar.open(`Descuento "${result.resource.name}" no pudo ser creado.`);
      }
    });
  }

  onUpdateDiscount(id: number): void {
    const dialogRef = this.dialog.open<
      DiscountEditDialogComponent,
      BaseEditDialogData,
      BaseEditDialogResult<Discount>
      >(DiscountEditDialogComponent, {
        data: { id },
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.loadData();
        this.snackBar.open(`Descuento "${result.resource.name}" actualizado con éxito.`);
      } else if (result?.success == false) {
        this.snackBar.open(`Descuento "${result.resource.name}" no pudo ser actualizado.`);
      }
    });
  }
}
