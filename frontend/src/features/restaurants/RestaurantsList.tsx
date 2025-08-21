import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { Link } from 'react-router-dom';

interface Restaurant {
  _id: string;
  name: string;
}

export default function RestaurantsList() {
  const { data, isLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => (await api.get('/restaurants')).data,
  });

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="space-y-2">
      {data?.map((r: Restaurant) => (
        <div key={r._id} className="border p-2">
          <Link className="underline" to={`/app/restaurants/${r._id}`}>
            {r.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
