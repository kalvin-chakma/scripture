// src/components/SignUp.jsx
import { useState, useEffect } from 'react';
import useUserStore from '../store/useUserStore';

const SignUp = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const { signUp, error, clearError } = useUserStore();

  useEffect(() => {
    clearError();
  }, [form.username, form.password, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signUp(form);
    alert(result.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md space-y-4 w-96">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className="bg-blue-500 text-white py-2 px-4 w-full rounded hover:bg-blue-600">
          Sign Up
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default SignUp;
