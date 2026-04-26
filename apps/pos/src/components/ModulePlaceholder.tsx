export function ModulePlaceholder({ title, notes }: { title: string; notes: string }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm text-gray-600 mt-2">{notes}</p>
    </div>
  );
}
