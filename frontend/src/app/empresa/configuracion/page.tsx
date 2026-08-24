import EnConstruccion from "@/components/EnConstruccion";

export default function EmpresaConfiguracionPage() {
  return (
    <EnConstruccion
      area="empresa"
      titulo="Configuración"
      descripcion="Ajustarás los datos del negocio, sus horarios y sus zonas de cobertura."
      volverA="/empresa"
    />
  );
}
