import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { Product } from '../../models/producto';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';

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
  comprasFiltered: Array<any>;
  pro: Product;
  prod: any;
  nume: number;
  Form = new FormGroup({
    cantidad: new FormControl(''),
  });

  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.productos = [];
    this.productosFiltrados = [];
    this.productos2 = [];
    this.dataSubCategoria = [];
    this.subCategoryFiltered = [];
    this.comprasFiltered = [];
    this.categoryFiltered = [];
    this.pro = new Product();
    this.nume = 0;
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
        'https://reop22datalake.blob.core.windows.net/jsoncontainer/' +
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

  //Realizar compra, va en cascacda, si pasa la validacion de cantidad ingresada a comprar sea menor a igual a la cantidad del elemento seleccionado.
  //llega a la compra, que modifica el json de Stock
  //Por ultimo llega a el put de la compra que envia el Stock al datalake
  public validarCompra() {
    if (
      parseInt(this.Form.get('cantidad')?.value || '') <=
      parseInt(this.pro.Cantidad)
    ) {
      this.nume =
        parseInt(this.pro.Cantidad) -
        parseInt(this.Form.get('cantidad')?.value || '');
      this.pro.Cantidad = String(this.nume);
      this.comprar();
    } else {
      var toast = {
        message: 'No hay suficiente Stock',
      };
      this.toastr.error(toast.message);
    }
  }
  public comprar() {
    let posicion = -1;
    var compra = {
      Producto: this.pro.Producto,
      Cod_Producto: this.pro.Cod_Producto,
      Categoria: this.pro.Categoria,
      Cod_Categoria: this.pro.Cod_Categoria,
      SubCategoria: this.pro.SubCategoria,
      Cod_SubCategoria: this.pro.Cod_SubCategoria,
      Cantidad: this.pro.Cantidad,
      Cod_Sucursal: this.pro.Cod_Sucursal,
    };
    for (let i = 0; i < this.productos2[0][0].length; i++) {
      if (
        this.productos2[0][0][i].Cod_Producto === this.pro.Cod_Producto &&
        this.productos2[0][0][i].Cod_Sucursal === this.pro.Cod_Sucursal
      ) {
        posicion = i;
        console.log(posicion);
      }
      if (posicion > 1) {
        this.productos2[0][0][posicion] = null;
        this.productos2[0][0][posicion] = compra;
      }
    }
    this.productos = [];
    this.productos.push(this.productos2[0][0]);
    console.log(this.productos);
    this.updateStock();
  }

  // Boton Mostrar Stock completo, recarga la pagina para mostrar el stock paginado
  public resetTable() {
    window.location.reload();
  }

  // Enviamos el Stock con la compra ya realizada, descontando la cantidad;
  public updateStock(): Observable<any> {
    var body = JSON.stringify(this.productos[0]);
    const httpOptions = {
      headers: new HttpHeaders({
        'x-ms-blob-type': 'BlockBlob',
      }),
    };
    var httpput = this.http.put(
      'GENERAR SAS DEL ARCHIVO Stock.json',
      body,
      httpOptions
    );
    httpput.subscribe((data) => console.log(data));
    var toast = {
      message: 'Compra Exitosa!',
    };
    this.toastr.success(toast.message);
    return httpput;
  }

  // Elegir producto desde la tabla
  productSelect(prod: Product) {
    var tprod = new Product();
    Object.assign(tprod, prod);
    this.pro = tprod;
    console.log(this.pro);
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
