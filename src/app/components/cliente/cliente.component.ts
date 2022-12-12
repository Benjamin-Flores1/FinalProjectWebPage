import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();
  dataCategoria: any;
  dataSubCategoria: Array<any>;
  subCategoryFiltered: Array<any>;
  selected: string = ' ';
  selected2: string = '0';
  productos: Array<any>;
  productosFiltrados: Array<any>;
  productos2: Array<any>;
  categoryFiltered: Array<any>;

  constructor(private http: HttpClient) {
    this.productos = [];
    this.productosFiltrados = [];
    this.productos2 = [];
    this.dataSubCategoria = [];
    this.subCategoryFiltered = [];
    this.categoryFiltered = [];
  }
  // Lista desplegable de Categoria
  // Hacemos un get y guardamos los valores en una variable tipo any que mostraremos en el select de html
  public categoryDropdown() {
    this.http
      .get(
        'https://grupo2desdepsdatalake.blob.core.windows.net/jsoncontainer/Categoria.json'
      )
      .subscribe((data) => {
        this.dataCategoria = data;
      });
  }
  // Lista desplegable de SubCategoria
  // Hacemos un get y guardamos los valores en un Array de tipo any
  // Filtramos el array con un for loop
  // Los resultados van a un array que es el que vamos a mostrar en funcion de la primer lista desplegable
  public subCategoryDropdown() {
    this.http
      .get(
        'https://grupo2desdepsdatalake.blob.core.windows.net/jsoncontainer/SubCategoria.json'
      )
      .subscribe((data) => {
        this.dataSubCategoria.push(data);
      });
  }
  public subCategoryFilter() {
    this.subCategoryFiltered = [];
    for (let i = 0; i < this.dataSubCategoria[0].length; i++) {
      if (this.dataSubCategoria[0][i].Categoria === this.selected) {
        this.subCategoryFiltered.push(this.dataSubCategoria[0][i].SubCategoria);
      }
    }
  }
  // Tabla Stock
  public getStock(tableName: string) {
    this.http
      .get(
        'https://grupo2desdepsdatalake.blob.core.windows.net/jsoncontainer/' +
          tableName
      )
      .subscribe((data) => {
        this.productos.push(data);
        console.log(this.productos);
        this.productos2.push(this.productos);
        this.dtTrigger.next(this.productos);
      });
  }
  // Filtrar tabla Stock por Categoria
  public categoryFilter() {
    this.categoryFiltered = [];
    this.productosFiltrados = [];
    for (let i = 0; i < this.productos2[0][0].length; i++) {
      if (this.productos2[0][0][i].Categoria === this.selected) {
        this.categoryFiltered.push(this.productos2[0][0][i]);
      }
    }
    this.productosFiltrados.push(this.categoryFiltered);
  }
  // Filtrar tabla Stock por SubCategoria
  public subCategoryFilterTable() {
    this.categoryFiltered = [];
    this.productosFiltrados = [];
    for (let i = 0; i < this.productos2[0][0].length; i++) {
      if (
        this.productos2[0][0][i].Categoria === this.selected &&
        this.productos2[0][0][i].SubCategoria === this.selected2
      ) {
        this.categoryFiltered.push(this.productos2[0][0][i]);
      }
      this.productosFiltrados.push(this.categoryFiltered);
    }
  }
  // Boton Mostrar Stock completo, recarga la pagina para mostrar el stock paginado
  public resetTable() {
    window.location.reload();
  }
  // Todo lo que esta dentro de OnInit se corre al recargar o iniciar la pagina
  ngOnInit() {
    this.getStock('Stock.json');
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json',
      },
    };
    this.categoryDropdown();
    this.subCategoryDropdown();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
