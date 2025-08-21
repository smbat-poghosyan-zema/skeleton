import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';

interface Restaurant {
  _id: string;
  name: string;
  description: string;
}

interface CreateRestaurant {
  name: string;
  description: string;
}

const schema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export default function RestaurantsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => (await api.get('/restaurants')).data,
  });
  const createMutation = useMutation({
    mutationFn: (payload: CreateRestaurant) =>
      api.post('/restaurants', payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['restaurants'] }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateRestaurant }) =>
      api.put(`/restaurants/${id}`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['restaurants'] }),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/restaurants/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['restaurants'] }),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string; description: string }>({
    resolver: zodResolver(schema),
  });
  const onSubmit = handleSubmit(async (data) => {
    await createMutation.mutateAsync(data);
    reset();
  });
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <h1 className="text-xl mb-4">Restaurants</h1>
      <form onSubmit={onSubmit} className="space-y-2 mb-6">
        <input
          className="border p-2 w-full"
          placeholder="Name"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
        <input
          className="border p-2 w-full"
          placeholder="Description"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
        <button className="bg-blue-500 text-white px-4 py-2" type="submit">
          Create
        </button>
      </form>
      <div className="space-y-4">
        {data?.map((r: Restaurant) => (
          <div key={r._id} className="border p-2">
            <div className="font-bold">{r.name}</div>
            <div className="mb-2">{r.description}</div>
            <button
              className="text-sm text-blue-600 mr-2"
              onClick={() => {
                const name = prompt('Name', r.name);
                const description = prompt('Description', r.description);
                if (name && description)
                  updateMutation.mutate({
                    id: r._id,
                    payload: { name, description },
                  });
              }}
            >
              Edit
            </button>
            <Link
              className="text-sm text-green-600 mr-2"
              to={`/app/admin/restaurants/${r._id}/menu`}
            >
              Menu
            </Link>
            <button
              className="text-sm text-red-600"
              onClick={() => {
                if (confirm('Delete restaurant?')) deleteMutation.mutate(r._id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
