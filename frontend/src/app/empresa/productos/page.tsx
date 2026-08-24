import EnConstruccion from "@/components/EnConstruccion";

export default function EmpresaProductosPage() {
  return (
    <EnConstruccion
      area="empresa"
      titulo="Productos"
      descripcion="Gestionarás el catálogo completo con precios, existencias y disponibilidad."
      volverA="/empresa"
    />
  );
}
