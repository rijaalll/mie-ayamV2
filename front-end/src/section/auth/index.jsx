"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/utils/authContext"
import { loginUser } from "@/src/utils/api/auth/authHandle"
import Image from "next/image"

export default function AuthPage() {
  const router = useRouter()
  const { user, login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  useEffect(() => {
    if (user.isLoggedIn) {
      const redirectPath = getRedirectPath(user.level)
      router.push(redirectPath)
    }
  }, [user.isLoggedIn, user.level, router])

  const getRedirectPath = (level) => {
    switch (level) {
      case "admin":
        return "/page/admin"
      case "kasir":
        return "/page/kasir"
      default:
        return "/order"
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
    setSuccess("")
  }

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      setError("Username dan password harus diisi")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const data = await loginUser({
        username: formData.username,
        password: formData.password,
      })

      login({
        id: data.user.id,
        username: data.user.username,
        name: data.user.name,
        level: data.user.level,
        password: formData.password,
      })

      setSuccess("Login berhasil! Mengalihkan...")
      const redirectPath = getRedirectPath(data.user.level)
      router.push(redirectPath)
    } catch (err) {
      setError(err.message || "Login gagal")
    } finally {
      setLoading(false)
    }
  }

  if (user.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Mengalihkan ke dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-6">
            <Image
              src="/images/web-logo.png"
              alt="Logo"
              width={200}
              height={80}
              className="mx-auto h-16 w-auto object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Login</h1>
          <p className="text-gray-600">Masuk ke akun Anda</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {success}
            </div>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none"
              placeholder="Masukkan password"
            />
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Masuk...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Login
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Sistem Manajemen Restoran</p>
          <p className="mt-1">© 2024 - Semua hak dilindungi</p>
        </div>
      </div>
    </div>
  )
}
