import React, { useEffect } from 'react'

function Settings() {
  
  useEffect(() => {
    document.title = 'KT | Settings '
  },[])

  return (
    <div className='h-screen w-screen text-white text-3xl'>
        <h2 className='text-center'>Pending</h2>
    </div>
  )
}

export default Settings