import React from 'react'

function Navbar() {
  return (
    <div className='navbar flex justify-between items-center w-full py-3'>
        <h1 className='text-xl font-bold'>Good Afternoon! Jane</h1>
        <i className="fa-solid fa-circle-user text-xl mr-10 md:mr-0"></i>
    </div>
  )
}

export default Navbar