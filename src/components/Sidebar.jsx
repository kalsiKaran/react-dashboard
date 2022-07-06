import React from 'react';
import { NavLink } from 'react-router-dom';
import { links } from '../data/data';
import {useStateContext} from '../contexts/ContextProvider';

function Sidebar () {

  // function for toggle between themes 
    const { activeMenu, setActiveMenu } = useStateContext();

    // function toggleTheme(){
    //   setMode('Light')
    //   if(currentMode === 'Light'){
    //     setMode('Dark')
    //   }else{
    //     setMode('Light')
    //   }
    // }
  return (
    <>
    <div className='sidebar hidden md:flex'>

      <ul className="text-white uppercase flex items-center flex-col h-full w-[5rem] primary-box">
          {links.map((link)=>{
            return <li className='link' key={link.name}>
              <NavLink to={`/${link.name}`} className={({ isActive }) => (isActive ? 'active' : '')}>
                <i className={`${link.icon}`}></i>
              </NavLink>
            </li>
          })}
        </ul>
      </div>

        {/* for mobile view */}
        <div className={`sidebar flex md:hidden origin-top-right transition-transform duration-300 ${activeMenu ? 'scale-100' : 'scale-0'}`}>
        <ul className="text-white uppercase flex md:hidden items-center flex-col h-full w-[5rem] primary-box">
          {links.map((link)=>{
            return <li className='link' key={link.name}>
              <NavLink to={`/${link.name}`} onClick={() => setActiveMenu(!activeMenu)} className={({ isActive }) => (isActive ? 'active' : '')}>
                <i className={`mr-2 ${link.icon}`}></i> <span>{link.title}</span>
              </NavLink>
            </li>
          })}
        </ul>
    </div>
    </>
  )
}

export default Sidebar
