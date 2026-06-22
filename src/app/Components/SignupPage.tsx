'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCreateAccount } from '@/app/services/QuizServive';
import { getFriendlyErrorMessage } from '@/app/services/errorHandler';

export default function SignupPage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateAccount();

  const [form, setForm] = useState({
    name: '',
    email: '',
    plan: 'basic',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');

    if (user) {
      router.push('/quiz');
    }
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    mutate(form, {
      onSuccess: (data) => {
        localStorage.setItem('user', JSON.stringify(data ?? form));
        if (data?.api_key) {
          localStorage.setItem('api_key', data.api_key);
        }
        router.push('/quiz');
      },
      onError: (err: any) => {
        setError(getFriendlyErrorMessage(err));
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Signup</h2>

          {error && (
            <div className="w-full mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full mb-4 p-3 border rounded-lg"
          />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full mb-4 p-3 border rounded-lg"
          />

          <select
            name="plan"
            value={form.plan}
            onChange={handleChange}
            className="w-full mb-6 p-3 border rounded-lg"
          >
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
          >
            {isPending ? 'Creating Account...' : 'Continue'}
          </button>
        </form>
      </main>

      <footer className="w-full border-t border-gray-200 bg-white/80 py-4">
        <div className="flex justify-center">
          <Image
            src="/csl%20logo.jpg"
            alt="Compucom Software Limited logo"
            width={1936}
            height={976}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>
      </footer>
    </div>
  );
}
