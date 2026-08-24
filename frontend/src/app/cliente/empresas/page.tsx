import EnConstruccion from "@/components/EnConstruccion";

export default function ClienteEmpresasPage() {
  return (
    <EnConstruccion
      area="cliente"
      titulo="Comercios"
      descripcion="Listaremos los comercios disponibles cerca de tu dirección registrada."
      volverA="/cliente"
    />
  );
}
