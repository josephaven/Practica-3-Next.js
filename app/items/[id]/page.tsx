import { db } from '@/lib/store';

export default async function ItemDetail(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;             
  const item = await db.get(id);

  if (!item) return <div className="text-red-600">No encontrado</div>;

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Detalle</h1>
      <div className="rounded border p-4 bg-white">
        <p><b>ID:</b> {item.id}</p>
        <p><b>Título:</b> {item.title}</p>
        <p><b>Estado:</b> {item.done ? 'Hecho' : 'Pendiente'}</p>
      </div>
    </div>
  );
}
