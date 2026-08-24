import EnConstruccion from "@/components/EnConstruccion";

export default function EmpresaUsuariosPage() {
  return (
    <EnConstruccion
      area="empresa"
      titulo="Usuarios"
      descripcion="Administrarás las cuentas del sistema y el rol asignado a cada persona."
      volverA="/empresa"
    />
  );
}
