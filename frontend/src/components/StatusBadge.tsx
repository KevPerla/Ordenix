interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <span className="rounded-full bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-400">
      {status}
    </span>
  );
}