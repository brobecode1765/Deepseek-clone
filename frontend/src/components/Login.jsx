import { Eye } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';

function Login() {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()

  const [,setAuthUser]=useAuth();

  const handleChange = (e) => {
    const value=e.target.value
    const name=e.target.name

    setFormData({
      ...formData,
      [name]:value
    })
  }

  const handleSignup =async () => {
    setLoading(true)
    setError("")
    try {
      const {data}=await axios.post("https://deepseek-clone-eight-beta/api/v1/user/login",{
        email:formData.email,
        password:formData.password,
      },{
        withCredentials:true
      })
      console.log(data)
      alert(data.message || "Signup Succeded")
      localStorage.setItem("user",JSON.stringify(data.user))
      localStorage.setItem("token", data.token)
      setAuthUser(data.token)
      navigate("/login")
    } catch (error) {
      const msg=error?.response?.data?.errors || "Signup Failed"
      setError(msg)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-black px-4'>
      <div className='bg-[#1e1e1e] text-white w-full max-w-md rounded-2xl p-6 shadow-lg'>
        {/* Heading */}
        <h1 className='text-white items-center justify-center text-center'>Signup</h1>


        {/* email */}
        <div className='mb-4 mt-2'>
          <input
            className='w-full bg-transparent border border-gray-600 rounded-md px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]'
            type="email"
            name='email'
            placeholder='email'
            value={formData.email}
            onChange={handleChange} />
        </div>

        {/* password */}
        <div className='mb-4 mt-2'>
          <input className='w-full bg-transparent border border-gray-600 rounded-md px-4 py-3 placeholder-gray-400 text-sm focus:ring-2 focus:ring-[#7a6ff0]'
            type="password"
            name='password'
            placeholder='password'
            value={formData.password}
            onChange={handleChange} />
          <span className='absolute right-3 top-3 text-gray-400'> <Eye size={18} />{""}</span>
        </div>

        {/* Error Message */}
        {error && <span className='text-red-600 text-sm mb-4'>{error}</span>}

        {/* Terms & Condtions */}
        <p className='text-xs text-gray-400 mt-4 mb-6'>By signing up or logging in, you constent to DeepSeek's <a className='underline' href="https://cdn.deepseek.com/policies/en-US/deepseek-terms-of-use.html">Terms of Use</a> and <a className='underline' href="https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html">Privacy Policy</a></p>

        {/* Login button */}
        <button onClick={handleSignup} disabled={loading} className='w-full bg-[#7a6ff6] hover:bg-[#6c61a6] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50'>{loading? "Logging...":"Login"}</button>

        {/* Links */}
        <div className='flex justify-between mt-4 text-sm'>
          <a className="text-[#7a66f6] hover:underline">Don't have an account</a>
          <Link className='text-[#7a66f6] hover:underline' to={"/signup"}>Signup</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
