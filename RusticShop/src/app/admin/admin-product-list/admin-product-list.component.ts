import { Component } from '@angular/core';

interface Languages {
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

@Component({
  selector: 'app-admin-product-list',
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.scss']
})
export class AdminProductListComponent {
  tableData: Languages[] = [
    { name: 'English', difficulty: 'easy' },
    { name: 'Spanish', difficulty: 'hard' },
    { name: 'Swedenish', difficulty: 'hard' }
  ];
  tableHeaders = ['name', 'difficulty'];
}
