import React from 'react'
import {BrowserRouter, Link, useNavigate} from 'react-router-dom'
import ChatHistory from './ChatHistory'
import 'tailwindcss'
import 'cors'
import { useState } from 'react'
import { useEffect } from 'react'
export default function Start() {
    
      const navigate = useNavigate();
      const [username, setUsername] = useState('');

      useEffect(()=>{
      const savedUser = localStorage.getItem('username');
      if(savedUser){
        setUsername(savedUser);
      }
     }, []);

    const handleLogin = ()=>{
      navigate('/login');
    };

    const handleRegister = ()=>{
       navigate('/register');
    };

    const handleLogout = async ()=>{
     await fetch('http://localhost:5000/logout', {
      method: 'GET',
      credentials: 'include'

     });
     localStorage.removeItem('username');
     setUsername('');
     navigate('/login');
    };
    
  return (
    <div className='bg-zinc-900 w-full h-screen text-white flex overflow-x-hidden'>
      <div>
        <ChatHistory className='inline' />
      </div>

      <div>
        <div className='ml-200 pt-10 flex'>
          {username ? (
            <>
              <span className='text-lg mx-4'>Hello, {username}</span>
              <button
                onClick={handleLogout}
                className='border-2 rounded-2xl px-4 mx-4'
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className='border-2 rounded-2xl px-4 mx-4'
              >
                Login
              </button>
              <button
                onClick={handleRegister}
                className='border-2 rounded-2xl px-4 whitespace-nowrap'
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        <div>
          <form
            action='http://localhost:5000/query'
            method='post'
          >
            <input
              type='text'
              className='h-20 w-150 mt-20 ml-20 border-2 rounded-2xl'
              placeholder='Enter Your Query'
              name='Query'
            />
            <input
              type='submit'
              name='Search'
              className='bg-blue-600 w-20 h-15 ml-10'
            />
          </form>
        </div>
      </div>
    </div>
  );
}
