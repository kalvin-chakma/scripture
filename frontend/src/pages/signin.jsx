import { useState, useEffect } from 'react';
import useUserStore from '../store/useUserStore';

const SignIn = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const { signIn, error, clearError } = useUserStore();

  useEffect(() => {
    clearError(); // Clear error when component mounts or username/password changes
  }, [form.username, form.password, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn(form);
    alert(result.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md space-y-4 w-96">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>
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
        <button className="bg-green-500 text-white py-2 px-4 w-full rounded hover:bg-green-600">
          Sign In
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default SignIn;
