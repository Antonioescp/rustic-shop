import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FeatureService } from 'src/app/feature.service';
import Feature from 'src/app/shared/models/Feature';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {
  features!: MatTableDataSource<Feature>;
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

  constructor(
    private featuresService: FeatureService
  ) {

  }

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
    this.featuresService.getPaginatedFeatures({
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
        this.features = new MatTableDataSource(result.data);
        this.isLoadingAction = false;
      },
      error: error => {
        console.log(error);
        this.isLoadingAction = false;
      }
    });
  }

  deleteFeature(feature: Feature) {
    this.isLoadingAction = true;
    this.featuresService.deleteFeature(feature.id).subscribe({
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
