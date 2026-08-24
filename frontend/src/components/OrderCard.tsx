interface OrderCardProps {
  id: string;
  restaurant: string;
  total: number;
  status: string;
}

export default function OrderCard({
  id,
  restaurant,
  total,
  status,
}: OrderCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Pedido
          </p>

          <h3 className="font-bold">
            {id}
          </h3>
        </div>

        <span className="rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-400">
          {status}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Empresa
          </p>

          <p>{restaurant}</p>
        </div>

        <p className="font-bold">
          ${total.toFixed(2)}
        </p>
      </div>
    </div>
  );
}