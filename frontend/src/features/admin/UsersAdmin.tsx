import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface User {
  _id: string;
  email: string;
  role: string;
}

interface CreateUser {
  email: string;
  password: string;
  role: string;
}

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string(),
});

export default function UsersAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/users')).data,
  });
  const createMutation = useMutation({
    mutationFn: (payload: CreateUser) => api.post('/users', payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      api.put(`/users/${id}`, { role }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ email: string; password: string; role: string }>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    await createMutation.mutateAsync(data);
    reset();
  });

  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <h1 className="text-xl mb-4">Users</h1>
      <form onSubmit={onSubmit} className="space-y-2 mb-6">
        <input
          className="border p-2 w-full"
          placeholder="Email"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
        <select className="border p-2 w-full" {...register('role')}>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <button className="bg-blue-500 text-white px-4 py-2" type="submit">
          Create
        </button>
      </form>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data?.map((u: User) => (
            <tr key={u._id} className="border-t">
              <td className="p-2">{u.email}</td>
              <td className="p-2">
                <select
                  className="border p-1"
                  value={u.role}
                  onChange={(e) =>
                    updateMutation.mutate({ id: u._id, role: e.target.value })
                  }
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td className="p-2 text-right">
                <button
                  className="text-red-600"
                  onClick={() => {
                    if (confirm('Delete user?')) deleteMutation.mutate(u._id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
