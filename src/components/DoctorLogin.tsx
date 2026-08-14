import React, { useState } from 'react'
import { Stethoscope, User, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../services/authService'
import { UserType } from './AuthModal'

const DoctorLogin: React.FC = () => {
  const [email, setEmail] = useState('doctor@zerowait.com')
  const [password, setPassword] = useState('doctor123')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

  const createDemoDoctor = async () => {
    try {
      // Create demo doctor account for testing
      const demoDoctorData = {
        userType: 'doctor' as UserType,
        email: 'doctor@zerowait.com',
        firstName: 'Amit',
        lastName: 'Verma',
        licenseNumber: 'MD-12345',
        specialization: 'Cardiology',
        hospital: 'Apollo Hospitals',
        department: 'Cardiology'
      }

      const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCbubGrkxoLO4gBOvn-eClA8QEvqCyOf3k', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'doctor@zerowait.com',
          password: 'doctor123',
          returnSecureToken: true
        })
      })

      if (response.ok) {
        const user = await response.json()
        console.log('Demo doctor created:', user)
        return true
      }
      return false
    } catch (error) {
      console.error('Error creating demo doctor:', error)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Try to login with Firebase first
      const result = await loginUser(email, password)
      
      if (result.success && result.user) {
        login(result.user)
      } else {
        // If login fails, try to create demo account
        console.log('Login failed, attempting to create demo account...')
        const created = await createDemoDoctor()
        if (created) {
          // Try login again after creating account
          const retryResult = await loginUser(email, password)
          if (retryResult.success && retryResult.user) {
            login(retryResult.user)
          } else {
            setError('Demo account creation failed. Please try again.')
          }
        } else {
          setError(result.error || 'Login failed. Please try again.')
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || 'An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Stethoscope size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Doctor Portal</h1>
            <p className="text-gray-600">Sign in to access patient records</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@zerowait.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-blue-600">Email: doctor@zerowait.com</p>
            <p className="text-xs text-blue-600">Password: doctor123</p>
            <p className="text-xs text-blue-600 mt-2">First time? The system will create the demo account automatically.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorLogin
