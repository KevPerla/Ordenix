import EnConstruccion from "@/components/EnConstruccion";

export default function ClientePerfilPage() {
  return (
    <EnConstruccion
      area="cliente"
      titulo="Mi perfil"
      descripcion="Desde aquí podrás editar tus datos y administrar tus direcciones de entrega."
      volverA="/cliente"
    />
  );
}
