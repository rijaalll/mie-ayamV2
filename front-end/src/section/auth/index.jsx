"use client";
import { useState, useEffect } from "react";
import { useLogin } from "@/src/utils/authContext";
import { loginUser, registerUser } from "@/src/utils/api/auth/authHandle";

export default function AuthPage() {
    const { login, setLoginData, logout, name, username, level } = useLogin();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: ''
  });

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = () => {
    const savedUsername = localStorage.getItem('userUsername');
    const savedPassword = localStorage.getItem('userPassword');

    if (savedUsername && savedPassword) {
      handleAutoLogin(savedUsername, savedPassword);
    }
  };

  const handleAutoLogin = async (username, password) => {
    try {
      setLoading(true);
      const data = await loginUser({ username, password });

      setLoginData({
        login: true,
        id: data.user.id,
        username: data.user.username,
        name: data.user.name,
        level: data.user.level,
        password
      });
    } catch (error) {
      console.error('Auto login error:', error);
      localStorage.removeItem('userUsername');
      localStorage.removeItem('userPassword');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await loginUser({
        username: formData.username,
        password: formData.password
      });

      if (data.user.level === 'user') {
        localStorage.setItem('userUsername', data.user.username);
        localStorage.setItem('userPassword', formData.password);
      }

      setLoginData({
        login: true,
        id: data.user.id,
        username: data.user.username,
        name: data.user.name,
        level: data.user.level,
        password: formData.password
      });

      setSuccess('Login berhasil!');
    } catch (err) {
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await registerUser({
        name: formData.name,
        username: formData.username,
        password: formData.password
      });

      setSuccess('Registrasi berhasil! Silakan login.');
      setIsLogin(true);
      setFormData({ name: '', username: '', password: '' });
    } catch (err) {
      setError(err.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userUsername');
    localStorage.removeItem('userPassword');
    logout();
    setFormData({ name: '', username: '', password: '' });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({ name: '', username: '', password: '' });
  };

  if (login) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Selamat Datang!</h2>
            <p className="text-gray-600 mt-2">Anda berhasil login</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Nama</p>
              <p className="font-semibold text-gray-800">{name}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Username</p>
              <p className="font-semibold text-gray-800">{username}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Level</p>
              <p className="font-semibold text-gray-800 capitalize">{level || 'user'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{isLogin ? 'Login' : 'Register'}</h1>
          <p className="text-gray-600">{isLogin ? 'Masuk ke akun Anda' : 'Buat akun baru'}</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="Masukkan nama lengkap"
              />
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              placeholder="Masukkan password"
            />
          </div>

          <button
            type="button"
            onClick={isLogin ? handleLogin : handleRegister}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              isLogin ? 'Login' : 'Register'
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
            <button
              type="button"
              onClick={toggleMode}
              className="ml-2 text-indigo-600 hover:text-indigo-500 font-semibold transition duration-200"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
