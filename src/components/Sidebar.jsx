import React from 'react'
// import {useStateContext} from '../contexts/ContextProvider';

function Sidebar
() {
    // const { setMode, currentMode } = useStateContext();

    // function toggleTheme(){
    //   setMode('Light')
    //   if(currentMode === 'Light'){
    //     setMode('Dark')
    //   }else{
    //     setMode('Light')
    //   }
    // }
  return (
    <div className='sidebar'>
        <ul className='text-white uppercase flex items-center flex-col h-full w-[5rem] primary-box'>
          <li className='link'><a href='dashboard' className='active'><i className="fas fa-home"></i></a></li>
          <li className='link'><a href='chart'><i className="fa-solid fa-chart-simple"></i></a></li>
          <li className='link'><a href='dataTable'><i className="fa-solid fa-table"></i></a></li>
          <li className='link'><a href='settings'><i className="fa-solid fa-gear"></i></a></li>
        </ul>
    </div>
  )
}

export default Sidebar
