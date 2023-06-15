import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

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
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent {
  constructor(private authService: AuthService) {}

  links: SideNavExpandableItem[] = this.authService.isAdmin
    ? [
        {
          label: 'Productos',
          children: [
            { label: 'Productos Base', path: 'productos', icon: 'inventory_2' },
            { label: 'Variantes', path: 'variantes', icon: 'polyline' },
            { label: 'Marcas', path: 'marcas', icon: 'grade' },
            { label: 'Categorías', path: 'categorias', icon: 'category' },
            {
              label: 'Características',
              path: 'caracteristicas',
              icon: 'schema',
            },
            { label: 'Descuentos', path: 'descuentos', icon: 'percent' },
          ],
        },
        {
          label: 'Transacciones',
          children: [
            { label: 'Compras', path: '', icon: '' },
            { label: 'Ventas', path: '', icon: '' },
            { label: 'Reembolsos', path: '', icon: '' },
          ],
        },
      ]
    : [
        {
          label: 'Productos',
          children: [
            { label: 'Variantes', path: 'variantes', icon: 'polyline' },
          ],
        },
      ];
}
