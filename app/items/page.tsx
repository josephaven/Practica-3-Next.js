import ItemForm from '@/components/ItemForm';       
import ClientList from '@/components/ClientList';   

export default function Page() {
  return (
    <section className="grid gap-6">
      <h1 className="text-2xl font-semibold">Items</h1>
      <ItemForm />
      <ClientList />
    </section>
  );
}
