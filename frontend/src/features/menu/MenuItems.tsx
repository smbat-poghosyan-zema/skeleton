import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { useParams } from 'react-router-dom';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: string;
}

export default function MenuItems() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['menu', id],
    queryFn: async () => (await api.get(`/restaurants/${id}/menu-items`)).data,
  });
  if (isLoading) return <div>Loading...</div>;
  if (!data?.length) return <div>No items</div>;
  const groups: Record<string, MenuItem[]> = {};
  data.forEach((item: MenuItem) => {
    groups[item.category] = groups[item.category] || [];
    groups[item.category].push(item);
  });
  return (
    <div>
      {Object.entries(groups).map(([cat, items]) => (
        <div key={cat} className="mb-4">
          <h2 className="text-lg">{cat}</h2>
          <ul className="pl-4 list-disc">
            {items.map((i) => (
              <li key={i._id}>
                {i.name} - ${i.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
