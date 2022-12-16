export class Product {
  Producto!: string;
  Cod_Producto!: string;
  Categoria!: string;
  Cod_Categoria!: string;
  SubCategoria!: string;
  Cod_SubCategoria!: string;
  Cantidad!: string;
  Cod_Sucursal!: string;

  Product(
    Cantidad: string,
    Categoria: string,
    Cod_Categoria: string,
    Cod_Producto: string,
    Cod_SubCategoria: string,
    Cod_Sucursal: string,
    Producto: string,
    SubCategoria: string
  ) {
    this.Cantidad = Cantidad;
    this.Categoria = Categoria;
    this.Cod_Categoria = Cod_Categoria;
    this.Cod_Producto = Cod_Producto;
    this.Cod_SubCategoria = Cod_SubCategoria;
    this.Cod_Sucursal = Cod_Sucursal;
    this.Producto = Producto;
    this.SubCategoria = SubCategoria;
  }
}
