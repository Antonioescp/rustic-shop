import { Component } from '@angular/core';
import { ProviderService } from 'src/app/services/provider.service';
import { TableColumnDef } from 'src/app/shared/components/table/table.component';
import { Provider } from 'src/app/shared/models/Provider';

@Component({
  selector: 'app-providers-table',
  templateUrl: './providers-table.component.html',
  styleUrls: ['./providers-table.component.scss'],
})
export class ProvidersTableComponent {
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

  displayedColumns = [...this.columns.map(column => column.def), 'actions'];

  constructor(public providerService: ProviderService) {}
}
