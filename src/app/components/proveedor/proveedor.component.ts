import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css'],
})
export class ProveedorComponent implements OnDestroy, OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();
  products: any;
  productselected: string = ' ';
  cantselected: string = ' ';
  Form = new FormGroup({
    cantidad: new FormControl(''),
  });

  constructor(private http: HttpClient) {}
  // Traemos los productos para mostrar en la lista desplegable;
  public productList() {
    this.http
      .get(
        'https://grupo2desdepsdatalake.blob.core.windows.net/jsoncontainer/Producto.json'
      )
      .subscribe((data) => {
        this.products = data;
        console.log(this.products);
        for (let i = 0; i < this.products.length; i++) {
          const dataArr = new Set(this.products[i].Producto);
        }
        this.dtTrigger.next(this.products);
      });
  }
  // Enviamos el nuevo Producto al datalake;
  public postNewProduct(): Observable<any> {
    this.cantselected = String(this.Form.get('cantidad')?.value || '');
    var body = JSON.stringify({
      Producto: this.productselected,
      Cantidad: this.cantselected,
    });
    const httpOptions = {
      headers: new HttpHeaders({
        'x-ms-blob-type': 'BlockBlob',
      }),
    };
    console.log(body);
    var httpput = this.http.put(
      'https://datalakepracticev2.blob.core.windows.net/output/input.json?sp=rw&st=2022-12-13T13:42:43Z&se=2022-12-13T21:42:43Z&spr=https&sv=2021-06-08&sr=b&sig=zDR3xRZm6ofE68s59Dvl3tmyJCd4llLW3%2FqJk3%2FFf%2Bg%3D',
      body,
      httpOptions
    );
    httpput.subscribe((data) => console.log(data));
    return httpput;
  }

  ngOnInit(): void {
    this.productList();
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
