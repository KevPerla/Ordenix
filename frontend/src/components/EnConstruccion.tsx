import Link from "next/link";
import PanelShell from "@/components/PanelShell";

type Area = "cliente" | "empresa" | "repartidor";

interface EnConstruccionProps {
  area: Area;
  titulo: string;
  descripcion: string;
  volverA: string;
}

export default function EnConstruccion({
  area,
  titulo,
  descripcion,
  volverA,
}: EnConstruccionProps) {
  return (
    <PanelShell area={area} titulo={titulo}>
          <section className="mx-auto flex max-w-2xl flex-col items-center rounded-[28px] border border-dashed border-[#CFE3D3] bg-white/70 px-6 py-14 text-center shadow-sm">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#DCFCE7] bg-[#F0FDF4] text-[#15803D]">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 2.8 4.8 5.6v6c0 4.3 3 8.2 7.2 9.6 4.2-1.4 7.2-5.3 7.2-9.6v-6Z" />
                <path d="M12 9v4" />
                <circle cx="12" cy="16" r="0.9" fill="currentColor" stroke="none" />
              </svg>
            </span>

            <h2 className="mt-6 text-[26px] font-bold tracking-[-0.025em] text-[#172019]">
              {titulo} llega en el siguiente avance
            </h2>

            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#6B7A6F]">
              {descripcion}
            </p>

            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#DCFCE7] bg-[#F0FDF4] px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.08em] text-[#15803D]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
              En construcción
            </span>

            <Link
              href={volverA}
              className="mt-8 inline-flex h-12 items-center justify-center rounded-2xl bg-[#16A34A] px-6 text-[15px] font-semibold text-white shadow-lg shadow-green-900/15 transition-all duration-200 hover:bg-[#15803D] active:scale-[0.97]"
            >
              Volver al inicio
            </Link>
          </section>
    </PanelShell>
  );
}
