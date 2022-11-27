import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css'],
})
export class ProveedorComponent implements OnDestroy, OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();
  data: any;
  constructor(private http: HttpClient) {}

  public seleccionarTable(tableName: HTMLSelectElement) {
    // Hay que limpiar el data capaz, para que no se buguee el datatable this.data = ' ';
    this.http
      .get(
        'https://grupo2desdepsdatalake.blob.core.windows.net/prueba/' +
          tableName.value
      )
      .subscribe((data) => {
        this.data = data;
        console.log(this.data);
        this.dtTrigger.next(data);
      });
  }
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json',
      },
    };
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
