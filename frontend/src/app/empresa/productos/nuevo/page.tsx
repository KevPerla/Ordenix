import EnConstruccion from "@/components/EnConstruccion";

export default function EmpresaProductosNuevoPage() {
  return (
    <EnConstruccion
      area="empresa"
      titulo="Nuevo producto"
      descripcion="Darás de alta un producto con su categoría, su precio y su imagen."
      volverA="/empresa"
    />
  );
}
