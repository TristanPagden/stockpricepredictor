import React from 'react'

const Navbar = () => {
  return (
    <nav className='flex justify-end items-end fixed top-0 left-0 w-full bg-main'>
        <a>
            <h1 className='text-lighter text-5xl font-logo font-black pl-8 py-4'>SPP</h1>
        </a>
        <div className='flex ml-auto mr-12 my-auto'>
            <a href='/info 'className='text-lighter hover:bg-light font-links font-semibold mx-2 py-1 rounded px-2'>Info</a>
            <a href='/predict' className='text-lighter hover:bg-light font-links font-semibold mx-2 py-1 rounded px-2'>Predict</a>
        </div>
    </nav>
  )
}

export default Navbar