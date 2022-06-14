import React from 'react';
import { NavLink } from 'react-router-dom';
import { links } from '../data/data';
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
          {links.map((link)=>{
            return <li className='link' key={link.name}>
              <NavLink to={`/${link.name}`} className={({ isActive }) => (isActive ? 'active' : '')}>
                <i className={`${link.icon}`}></i>
              </NavLink>
            </li>
          })}
        </ul>
    </div>
  )
}

export default Sidebar
