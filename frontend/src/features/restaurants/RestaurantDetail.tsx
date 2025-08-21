import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { Link, useParams } from 'react-router-dom';

export default function RestaurantDetail() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => (await api.get(`/restaurants/${id}`)).data,
  });
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;
  return (
    <div>
      <h1 className="text-xl mb-2">{data.name}</h1>
      <p className="mb-4">{data.description}</p>
      <Link className="underline" to={`/app/restaurants/${id}/menu`}>
        View Menu
      </Link>
    </div>
  );
}
