import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../api/client';
import axios from 'axios';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await api.post('/auth/login', data);
      login(res.data.access_token);
      navigate('/app/restaurants');
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        toast.error(e.response?.data?.message || 'Login failed');
      } else {
        toast.error('Login failed');
      }
    }
  });

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <input
            className="border p-2 w-full"
            placeholder="Email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div>
          <input
            className="border p-2 w-full"
            type="password"
            placeholder="Password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <button className="bg-blue-500 text-white px-4 py-2" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
