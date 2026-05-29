import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    await new Promise(r => setTimeout(r, 800))
    if (data.email === 'admin@ohio.vn' && data.password === 'admin123') {
      login({ id: 'admin1', name: 'Super Admin', email: data.email, phone: '', role: 'ADMIN', status: 'ACTIVE', created_at: '' }, 'mock-token')
      navigate('/dashboard')
    } else {
      setError('root', { message: 'Sai email hoặc mật khẩu' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#E8441A]">OHIO</h1>
          <p className="text-gray-500 mt-1">Admin Dashboard</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Đăng nhập</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input {...register('email')} type="email" placeholder="admin@ohio.vn"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8441A] focus:border-transparent" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input {...register('password')} type="password" placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8441A] focus:border-transparent" />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600">
                {errors.root.message}
              </div>
            )}
            <button type="submit" disabled={isSubmitting}
              className="w-full py-2.5 bg-[#E8441A] text-white rounded-lg font-medium text-sm hover:bg-[#d03a15] transition-colors disabled:opacity-60">
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
          <p className="text-xs text-gray-400 text-center mt-4">admin@ohio.vn / admin123</p>
        </div>
      </div>
    </div>
  )
}