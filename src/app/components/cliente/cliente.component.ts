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
  data: any;
  productos: Array<any>;
  constructor(private http: HttpClient) {
    this.productos = [];
  }

  // Hay que modificar esto, para hacer el filtro del array
  public seleccionarTable(tableName: string) {
    this.http
      .get(
        'https://grupo2desdepsdatalake.blob.core.windows.net/prueba/' +
          tableName
      )
      .subscribe((data) => {
        this.data = data;
        console.log(this.data);
        this.dtTrigger.next(data);
      });
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json',
      },
    };
    this.seleccionarTable('producto.json');
    // this.http
    //   .get(
    //     'https://grupo2desdepsdatalake.blob.core.windows.net/prueba/categoria.json'
    //   )
    //   .subscribe((data) => {
    //     this.data = data;
    //     console.log(data);
    //   });

    // Vamos a usara futuro
    //     this.http
    //       .get(
    //         'https://grupo2desdepsdatalake.blob.core.windows.net/prueba/categoria.json'
    //       )
    //       .subscribe((data) => {
    //         this.productos.push(data);
    //         console.log(this.productos);
    //       });
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
