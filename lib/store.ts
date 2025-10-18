export type Item = { id: string; title: string; done: boolean };

let items: Item[] = [
  { id: '1', title: 'Aprender RSC', done: false },
  { id: '2', title: 'Configurar Tailwind', done: true },
];

export const db = {
  list: async () => items,
  get: async (id: string) => items.find(i => i.id === id),
  create: async (data: Omit<Item, 'id'>) => {
    const id = String(Date.now());
    const it = { id, ...data };
    items = [it, ...items];
    return it;
  },
  update: async (id: string, data: Partial<Omit<Item, 'id'>>) => {
    items = items.map(i => (i.id === id ? { ...i, ...data } : i));
    return items.find(i => i.id === id);
  },
  remove: async (id: string) => (items = items.filter(i => i.id !== id), true),
};
