import { Component } from '@angular/core';

interface SideNavLink {
  label: string;
  path: string;
  icon: string;
}

interface SideNavExpandableItem {
  label: string;
  children: SideNavLink[];
}

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent {
  links: SideNavExpandableItem[] = [
    {
      label: 'Productos',
      children: [
        { label: 'Ver Productos', path: 'productos', icon: 'inventory_2' },
        { label: 'Categorías', path: 'categorias', icon: 'category' },
        { label: 'Características', path: 'caracteristicas', icon: 'schema' },
        { label: 'Descuentos', path: 'descuentos', icon: 'percent' },
      ]
    },
    {
      label: 'Transacciones',
      children: [
        { label: 'Compras', path: '', icon: '' },
        { label: 'Ventas', path: '', icon: '' },
        { label: 'Reembolsos', path: '', icon: '' },
      ]
    },
  ];
}
