export function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-xl font-semibold text-[#2B59C3] mt-1">{value}</p>
    </div>
  );
}
