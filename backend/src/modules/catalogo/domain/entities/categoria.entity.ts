export class Categoria {
  constructor(
    public readonly id: string,
    public nombre: string,
    public descripcion: string | null,
    public activo: boolean,
    public readonly createdAt: Date,
  ) {}

  renombrar(nombre: string): void {
    this.nombre = nombre;
  }

  describir(descripcion: string | null): void {
    this.descripcion = descripcion;
  }

  desactivar(): void {
    this.activo = false;
  }

  activar(): void {
    this.activo = true;
  }
}
