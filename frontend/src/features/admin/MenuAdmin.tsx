import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'react-router-dom';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: string;
}

interface MenuItemPayload {
  name: string;
  price: number;
  category: string;
}

const schema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  category: z.string().min(1),
});

export default function MenuAdmin() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['menu', id],
    queryFn: async () => (await api.get(`/restaurants/${id}/menu-items`)).data,
  });
  const createMutation = useMutation({
    mutationFn: (payload: MenuItemPayload) =>
      api.post(`/restaurants/${id}/menu-items`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menu', id] }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ mid, payload }: { mid: string; payload: MenuItemPayload }) =>
      api.put(`/restaurants/${id}/menu-items/${mid}`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menu', id] }),
  });
  const deleteMutation = useMutation({
    mutationFn: (mid: string) =>
      api.delete(`/restaurants/${id}/menu-items/${mid}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menu', id] }),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string; price: number; category: string }>({
    resolver: zodResolver(schema),
  });
  const onSubmit = handleSubmit(async (data) => {
    await createMutation.mutateAsync(data);
    reset();
  });
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <h1 className="text-xl mb-4">Menu Items</h1>
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
          type="number"
          step="0.01"
          placeholder="Price"
          {...register('price', { valueAsNumber: true })}
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message}</p>
        )}
        <input
          className="border p-2 w-full"
          placeholder="Category"
          {...register('category')}
        />
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
        <button className="bg-blue-500 text-white px-4 py-2" type="submit">
          Create
        </button>
      </form>
      <div className="space-y-4">
        {data?.map((m: MenuItem) => (
          <div key={m._id} className="border p-2">
            <div>
              {m.name} - ${m.price.toFixed(2)} ({m.category})
            </div>
            <button
              className="text-sm text-blue-600 mr-2"
              onClick={() => {
                const name = prompt('Name', m.name);
                const price = Number(prompt('Price', String(m.price)));
                const category = prompt('Category', m.category);
                if (name && category && !isNaN(price))
                  updateMutation.mutate({
                    mid: m._id,
                    payload: { name, price, category },
                  });
              }}
            >
              Edit
            </button>
            <button
              className="text-sm text-red-600"
              onClick={() => {
                if (confirm('Delete item?')) deleteMutation.mutate(m._id);
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
