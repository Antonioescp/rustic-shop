import { Component } from '@angular/core';

interface SideNavLink {
  label: string;
  path: string;
  iconName: string;
}

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent {
  links: SideNavLink[] = [
    { label: 'Productos', path: 'productos', iconName: 'inventory_2' },
    { label: 'Categorias', path: 'categorias', iconName: 'category' },
    { label: 'Descuentos', path: 'descuentos', iconName: 'percent' },
    { label: 'Transacciones', path: 'transacciones', iconName: 'receipt_long' },
  ];
}
