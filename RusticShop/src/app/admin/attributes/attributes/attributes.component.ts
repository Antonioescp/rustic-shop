import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AttributesService } from 'src/app/services/attributes.service';
import Attribute from 'src/app/shared/models/Attribute';
import {
  BaseEditDialogData,
  BaseEditDialogResult,
} from '../../../shared/components/base-edit-dialog.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
  ConfirmDialogResult,
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AttributeEditDialogComponent } from '../attribute-edit-dialog/attribute-edit-dialog.component';
import { PageEvent } from '@angular/material/paginator';
import {
  RowActionsDef,
  TableActionDef,
  TableColumnDef,
  TableComponent,
} from 'src/app/shared/components/table/table.component';

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss'],
})
export class AttributesComponent implements AfterViewInit {
  @ViewChild(TableComponent) table!: TableComponent<Attribute>;

  columns: TableColumnDef<Attribute>[] = [
    {
      def: 'id',
      header: 'ID',
      valueGetter: attribute => attribute.id.toString(),
      sortable: true,
    },
    {
      def: 'name',
      header: 'Nombre',
      valueGetter: attribute => attribute.name,
      sortable: true,
    },
  ];

  displayedColumns = [...this.columns.map(c => c.def), 'actions'];

  tableActions: TableActionDef[] = [
    {
      label: 'Agregar atributo',
      icon: 'add',
      execute: () => this.onCreateAttribute(),
      color: 'primary',
    },
  ];

  rowActions: RowActionsDef<Attribute>[] = [
    {
      icon: 'edit',
      execute: attribute => this.onUpdateAttribute(attribute.id),
      tooltip: 'Editar',
      color: 'primary',
    },
    {
      icon: 'delete_forever',
      execute: attribute => this.onDeleteAttribute(attribute),
      tooltip: 'Eliminar',
      color: 'warn',
    },
  ];

  constructor(
    private attributesService: AttributesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit(): void {
    this.table.loadData();
  }

  fetchData(pageEvent: PageEvent) {
    this.attributesService
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

  onDeleteAttribute(attribute: Attribute): void {
    const dialogRef = this.dialog.open<
      ConfirmDialogComponent,
      ConfirmDialogData,
      ConfirmDialogResult
    >(ConfirmDialogComponent, {
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
    this.attributesService.deleteById(attribute.id).subscribe({
      next: () => {
        this.table.loadData();
        this.snackBar.open(`Atributo "${attribute.name} eliminado con éxito."`);
      },
      error: error => {
        console.error(error);
        this.snackBar.open(
          `Atributo "${attribute.name} no se ha podido eliminar."`
        );
      },
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
        this.table.loadData();
        this.snackBar.open(
          `Atributo "${result.resource.name}" ha sido creado con éxito.`
        );
      } else if (result?.success == false) {
        this.snackBar.open(
          `Atributo "${result.resource.name}" no se ha podido crear.`
        );
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
        this.table.loadData();
        this.snackBar.open(
          `Atributo "${result.resource.name}" ha sido actualizado con éxito.`
        );
      } else if (result?.success == false) {
        this.snackBar.open(
          `Atributo "${result.resource.name}" no se ha podido actualizar.`
        );
      }
    });
  }
}
