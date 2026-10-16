import type { ReactNode } from "react";

interface CampoProps {
  etiqueta: string;
  htmlFor: string;
  error?: string;
  ayuda?: string;
  children: ReactNode;
}

export default function Campo({
  etiqueta,
  htmlFor,
  error,
  ayuda,
  children,
}: CampoProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-[12.5px] font-semibold text-ink-700"
      >
        {etiqueta}
      </label>

      <div className="mt-1.5">{children}</div>

      {error ? (
        <p role="alert" className="mt-1.5 text-[12px] font-medium text-red-600">
          {error}
        </p>
      ) : (
        ayuda && <p className="mt-1.5 text-[12px] text-ink-500">{ayuda}</p>
      )}
    </div>
  );
}

export const CLASES_CONTROL =
  "h-11 w-full rounded-[var(--radius-control)] border border-line bg-ink-50 px-3.5 text-[14px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-300 focus:bg-surface focus:ring-4 focus:ring-brand-100 disabled:opacity-60";
