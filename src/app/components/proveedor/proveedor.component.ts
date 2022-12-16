import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private http: HttpClient, private toastr: ToastrService) {}
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
  // Enviamos el Cod_Producto y su Cantidad al datalake;
  public postNewProduct(): Observable<any> {
    this.cantselected = String(this.Form.get('cantidad')?.value || '');
    var body = JSON.stringify({
      Cod_Producto: this.productselected.substring(0, 3),
      Cantidad: this.cantselected,
    });
    const httpOptions = {
      headers: new HttpHeaders({
        'x-ms-blob-type': 'BlockBlob',
      }),
    };
    console.log(body);
    var httpput = this.http.put(
      'GENERAR SAS DEL ARCHIVO input.json',
      body,
      httpOptions
    );
    httpput.subscribe((data) => console.log(data));
    var toast = {
      message: this.cantselected + ' Productos agregados',
      title: 'Por Sucursal',
    };
    this.toastr.success(toast.title, toast.message);
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
