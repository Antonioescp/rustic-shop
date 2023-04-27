import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ProductsService } from 'src/app/products.service';
import VProductSummary, { getVProductSummaryCategories } from 'src/app/shared/models/VProductSummary';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-product-list',
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.scss']
})
export class AdminProductListComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<VProductSummary>();
  columnsToDisplay = [
    "id",
    "name",
    "shortDescription",
    "unitPrice",
    "categories",
    "imagesCount",
    "isPublished",
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filter = new FormControl<string>('');

  constructor (
    private productsService: ProductsService
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.productsService.getProductListView().subscribe(
      res => this.dataSource.data = res
    );

    this.filter.valueChanges.subscribe(filter => {
      if (filter) this.dataSource.filter = filter.trim().toLowerCase();
    });
  }

  getCategories(item: VProductSummary): string[] {
    return getVProductSummaryCategories(item);
  }
}
