import React from 'react'

function Login() {
  return (
    <div className='bg-zinc-900 w-full h-screen text-white flex overflow-x-hidden'>
        <div className="ml-125 mt-50 text-black bg-white h-50 w-80">
            <h3>Login</h3>
            <form action="/login" method='post'>
                <input type="text" className='w-60 h-10 block ml-2 mt-3' placeholder='Username' name='username'/>
                <input type="text" className='w-60 h-10 block mt-3 ml-2' placeholder='Password' name='password'/>
                <input type="submit" className='bg-green-400 mt-3 w-20 ml-2'/>
            </form>
        </div>
      
    </div>
  )
}

export default Login
