import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AttributesService } from 'src/app/services/attributes.service';
import Attribute from 'src/app/shared/models/Attribute';
import { BaseEditDialogData, BaseEditDialogResult } from '../../../shared/components/base-edit-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogData, ConfirmDialogResult } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AttributeEditDialogComponent } from '../attribute-edit-dialog/attribute-edit-dialog.component';

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss'],
})
export class AttributesComponent implements OnInit {
  attributes!: MatTableDataSource<Attribute>;
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
    private attributesService: AttributesService,
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
    this.attributesService
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
          this.attributes = new MatTableDataSource(result.data);
          this.isLoadingAction = false;
        },
        error: (error) => {
          console.log(error);
          this.isLoadingAction = false;
        },
      });
  }

  onDeleteAttribute(attribute: Attribute): void {
    const dialogRef = this.dialog.open<
      ConfirmDialogComponent,
      ConfirmDialogData,
      ConfirmDialogResult>(ConfirmDialogComponent, {
        data: {
          title: `Eliminar el atributo ${attribute.name}`,
          message: `¿Está seguro de que desea eliminar el atributo ${attribute.name}?`,
          confirmColor: 'warn',
          confirmIcon: 'warning',
          cancelColor: 'primary',
          cancelIcon: 'cancel',
        },
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmed) {
        this.deleteAttribute(attribute);
      }
    });
  }

  deleteAttribute(attribute: Attribute) {
    this.isLoadingAction = true;
    this.attributesService.deleteById(attribute.id).subscribe({
      next: _ => {
        this.loadData();
        this.snackBar.open(`Atributo "${attribute.name} eliminado con éxito."`);
      },
      error: (error) => {
        console.error(error);
        this.snackBar.open(`Atributo "${attribute.name} no se ha podido eliminar."`);
      },
      complete: () => this.isLoadingAction = false,
    });
  }

  onCreateAttribute(): void {
    const dialogRef = this.dialog.open<
      AttributeEditDialogComponent,
      BaseEditDialogData,
      BaseEditDialogResult<Attribute>
      >(AttributeEditDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.snackBar.open(`Atributo "${result.resource.name}" ha sido creado con éxito.`);
      } else if (result?.success == false) {
        this.snackBar.open(`Atributo "${result.resource.name}" no se ha podido crear.`);
      }
    });
  }

  onUpdateAttribute(id: number): void {
    const dialogRef = this.dialog.open<
      AttributeEditDialogComponent,
      BaseEditDialogData,
      BaseEditDialogResult<Attribute>
      >(AttributeEditDialogComponent, {
        data: { id },
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.snackBar.open(`Atributo "${result.resource.name}" ha sido actualizado con éxito.`);
      } else if (result?.success == false) {
        this.snackBar.open(`Atributo "${result.resource.name}" no se ha podido actualizar.`);
      }
    });
  }
}
