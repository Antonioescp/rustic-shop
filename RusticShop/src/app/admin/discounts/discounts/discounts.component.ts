import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DiscountsService } from 'src/app/discounts.service';
import Discount from 'src/app/shared/models/Discount';

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.scss']
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
    private discountsService: DiscountsService
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
    this.discountsService.getPaginatedDiscounts({
      defaultSortColumn: this.defaultSortColumn,
      defaultSortOrder: this.defaultSortOrder,
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
      sort: this.sort,
      defaultFilterColumn: this.defaultFilterColumn,
      filterQuery: this.filterQuery
    }).subscribe({
      next: result => {
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = result.pageIndex;
        this.paginator.pageSize = result.pageSize;
        this.discounts = new MatTableDataSource(result.data);
        this.isLoadingAction = false;
      },
      error: error => {
        console.log(error);
        this.isLoadingAction = false;
      }
    });
  }

  deleteFeature(discount: Discount) {
    this.isLoadingAction = true;
    this.discountsService.deleteDiscount(discount.id).subscribe({
      next: result => {
        this.loadData();
      },
      error: error => {
        console.error(error);
        this.isLoadingAction = false;
      }
    });
  }

}