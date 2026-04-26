export function ModulePlaceholder({ title, notes }: { title: string; notes: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="text-sm leading-6 text-slate-600 mt-2">{notes}</p>
    </div>
  );
}
