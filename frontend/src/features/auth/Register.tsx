import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../api/client';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await api.post('/auth/register', data);
      toast.success('Registered, please log in');
      navigate('/login');
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        toast.error(e.response?.data?.message || 'Registration failed');
      } else {
        toast.error('Registration failed');
      }
    }
  });

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl mb-4">Register</h1>
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
          Register
        </button>
      </form>
    </div>
  );
}
