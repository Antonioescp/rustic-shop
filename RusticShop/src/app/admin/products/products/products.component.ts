import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/shared/models/Product';
import {
  BaseEditDialogData,
  BaseEditDialogResult,
} from '../../../shared/components/base-edit-dialog.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
  ConfirmDialogResult,
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ProductEditDialogComponent } from '../product-edit-dialog/product-edit-dialog.component';
import {
  ProductEditSchemaDialogComponent,
  ProductEditSchemaDialogData,
  ProductEditSchemaDialogResult,
} from '../product-edit-schema-dialog/product-edit-schema-dialog.component';
import {
  RowActionsDef,
  TableActionDef,
  TableColumnDef,
  TableComponent,
} from 'src/app/shared/components/table/table.component';
import {
  ProductGalleryDialogComponent,
  ProductGalleryDialogData,
  ProductGalleryDialogResult,
} from '../product-gallery-dialog/product-gallery-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements AfterViewInit {
  @ViewChild(TableComponent) crud!: TableComponent<Product>;

  columns: TableColumnDef<Product>[] = [
    {
      def: 'id',
      header: 'ID',
      valueGetter: product => product.id.toString(),
      sortable: true,
    },
    {
      def: 'name',
      header: 'Nombre',
      valueGetter: product => product.name,
      sortable: true,
    },
    {
      def: 'shortDescription',
      header: 'Descripción corta',
      valueGetter: product => product.shortDescription ?? 'No aplicable',
    },
    {
      def: 'stock',
      header: 'Existencias',
      valueGetter: product => product.stock?.toString() ?? 'No aplicable',
    },
    {
      def: 'isPublished',
      header: 'Publicado',
      valueGetter: product => (product.isPublished ? 'Sí' : 'No'),
    },
  ];

  displayedColumns = [...this.columns.map(c => c.def), 'actions'];

  tableActions: TableActionDef[] = [
    {
      label: 'Agregar producto',
      color: 'primary',
      icon: 'add',
      execute: () => this.onCreateProduct(),
    },
  ];

  rowActions: RowActionsDef<Product>[] = [
    {
      tooltip: 'Editar',
      color: 'primary',
      icon: 'edit',
      execute: product => this.onUpdateProduct(product.id),
    },
    {
      tooltip: 'Editar esquema',
      color: 'accent',
      icon: 'schema',
      execute: product => this.onEditSchema(product.id),
    },
    {
      tooltip: 'Administrar imágenes',
      color: 'accent',
      icon: 'image',
      execute: product => this.onEditProductGallery(product.id),
    },
    {
      tooltip: 'Eliminar',
      color: 'warn',
      icon: 'delete_forever',
      execute: product => this.onDelete(product),
    },
  ];

  constructor(
    private productsService: ProductsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit(): void {
    this.fetchData({ pageIndex: 0, pageSize: 10, length: 0 });
  }

  fetchData(pageEvent: PageEvent) {
    this.productsService
      .getPaginated(this.crud.getPagination(pageEvent))
      .subscribe({
        next: result => {
          this.crud.updateWithResults(result);
        },
        error: error => {
          console.error(error);
        },
      });
  }

  onDelete(product: Product): void {
    const dialogRef = this.dialog.open<
      ConfirmDialogComponent,
      ConfirmDialogData,
      ConfirmDialogResult
    >(ConfirmDialogComponent, {
      data: {
        title: `Eliminar product ${product.name}`,
        message: `¿Está seguro de que desea elimnar ${product.name}? Todas sus variantes serán eliminadas.`,
        cancelColor: 'primary',
        confirmColor: 'warn',
        cancelIcon: 'cancel',
        confirmIcon: 'warning',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmed) {
        this.crud.loadData();
        this.deleteProduct(product);
      }
    });
  }

  deleteProduct(product: Product) {
    this.productsService.deleteById(product.id).subscribe({
      next: () => {
        this.crud.loadData();
        this.snackBar.open(`Producto "${product.name}" eliminado con éxito.`);
      },
      error: error => {
        console.error(error);
        this.snackBar.open(
          `El producto "${product.name}" no se ha podido eliminar.`
        );
      },
    });
  }

  onCreateProduct(): void {
    const dialogRef = this.dialog.open<
      ProductEditDialogComponent,
      BaseEditDialogData,
      BaseEditDialogResult<Product>
    >(ProductEditDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.crud.loadData();
        this.snackBar.open(
          `Producto "${result.resource.name}" creado con éxito.`
        );
      } else if (result?.success == false) {
        this.snackBar.open(
          `Producto "${result.resource.name}" no se ha podido crear.`
        );
      }
    });
  }

  onUpdateProduct(id: number): void {
    const dialogRef = this.dialog.open<
      ProductEditDialogComponent,
      BaseEditDialogData,
      BaseEditDialogResult<Product>
    >(ProductEditDialogComponent, {
      data: { id },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.crud.loadData();
        this.snackBar.open(
          `Producto "${result.resource.name}" actualizado con éxito.`
        );
      } else if (result?.success == false) {
        this.snackBar.open(
          `Producto "${result.resource.name}" no se ha podido actualizado.`
        );
      }
    });
  }

  onEditSchema(id: number): void {
    const dialogRef = this.dialog.open<
      ProductEditSchemaDialogComponent,
      ProductEditSchemaDialogData,
      ProductEditSchemaDialogResult
    >(ProductEditSchemaDialogComponent, {
      data: { id },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.snackBar.open('Actualizado');
      }
    });
  }

  onEditProductGallery(productId: number): void {
    const dialogRef = this.dialog.open<
      ProductGalleryDialogComponent,
      ProductGalleryDialogData,
      ProductGalleryDialogResult
    >(ProductGalleryDialogComponent, {
      data: { productId },
    });
  }
}
