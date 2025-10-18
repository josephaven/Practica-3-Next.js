import { ItemProvider } from '@/components/ItemContext';

export default function ItemsLayout({ children }: { children: React.ReactNode }) {
  return <ItemProvider>{children}</ItemProvider>;
}
