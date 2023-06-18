import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProviderService } from 'src/app/services/provider.service';
import {
  TableComponent,
  TableColumnDef,
  TableActionDef,
  RowActionsDef,
} from 'src/app/shared/components/table/table.component';
import { Provider } from 'src/app/shared/models/Provider';
import { ProviderEditDialogComponent } from './provider-edit-dialog/provider-edit-dialog.component';
import {
  BaseEditDialogData,
  BaseEditDialogResult,
} from 'src/app/shared/components/base-edit-dialog.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
  ConfirmDialogResult,
} from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-providers-table',
  templateUrl: './providers-table.component.html',
  styleUrls: ['./providers-table.component.scss'],
})
export class ProvidersTableComponent implements AfterViewInit {
  @ViewChild(TableComponent) crud!: TableComponent<Provider>;

  columns: TableColumnDef<Provider>[] = [
    {
      def: 'id',
      header: 'ID',
      sortable: true,
      valueGetter: provider => provider.id.toString(),
    },
    {
      def: 'name',
      header: 'Nombre',
      sortable: true,
      valueGetter: provider => provider.name,
    },
    {
      def: 'phoneNumber',
      header: 'Teléfono',
      sortable: true,
      valueGetter: provider => provider.phoneNumber ?? 'No aplicable',
    },
    {
      def: 'email',
      header: 'Correo electrónico',
      sortable: true,
      valueGetter: provider => provider.email ?? 'No aplicable',
    },
  ];

  tableActions: TableActionDef[] = [
    {
      label: 'Agregar proveedor',
      icon: 'add',
      color: 'primary',
      execute: () => this.createResource(),
    },
  ];

  rowActions: RowActionsDef<Provider>[] = [
    {
      tooltip: 'Editar',
      icon: 'edit',
      execute: provider => this.editResource(provider),
      color: 'primary',
      disabled: false,
    },
    {
      tooltip: 'Eliminar',
      icon: 'delete_forever',
      execute: provider => this.deleteResource(provider),
      color: 'warn',
      disabled: false,
    },
  ];

  displayedColumns = [...this.columns.map(column => column.def), 'actions'];

  constructor(
    public providerService: ProviderService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit(): void {
    this.fetchData({ pageIndex: 0, pageSize: 10, length: 0 });
  }

  fetchData(pageEvent: PageEvent): void {
    this.providerService
      .getPaginated(this.crud.getPagination(pageEvent))
      .subscribe(data => {
        this.crud.updateWithResults(data);
      });
  }

  createResource(): void {
    const dialogRef = this.dialog.open<
      ProviderEditDialogComponent,
      BaseEditDialogData<number>,
      BaseEditDialogResult<Provider>
    >(ProviderEditDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.crud.loadData();
        this.snackBar.open('Proveedor creado', 'Cerrar', {
          duration: 2000,
        });
      }
    });
  }

  editResource(provider: Provider): void {
    const dialogRef = this.dialog.open<
      ProviderEditDialogComponent,
      BaseEditDialogData<number>,
      BaseEditDialogResult<Provider>
    >(ProviderEditDialogComponent, {
      data: { id: provider.id },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.crud.loadData();
        this.snackBar.open('Proveedor editado', 'Cerrar', {
          duration: 2000,
        });
      }
    });
  }

  deleteResource(provider: Provider): void {
    const dialogRef = this.dialog.open<
      ConfirmDialogComponent,
      ConfirmDialogData,
      ConfirmDialogResult
    >(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar proveedor',
        message: `¿Está seguro que desea eliminar el proveedor ${provider.name}?`,
        cancelIcon: 'cancel',
        confirmIcon: 'warning',
        confirmColor: 'warn',
        cancelColor: 'primary',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmed) {
        this.providerService.deleteById(provider.id).subscribe(() => {
          this.crud.loadData();
          this.snackBar.open('Proveedor eliminado', 'Cerrar', {
            duration: 2000,
          });
        });
      }
    });
  }
}