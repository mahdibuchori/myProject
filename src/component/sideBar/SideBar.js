import React, { useState,useEffect } from 'react';
import './sideBar.css';
import { useMediaQuery } from 'usehooks-ts';
import { Link } from 'react-router-dom';
import useAuthStore, { selectAuthReady, selectUser } from '../../store/authLogin';

export const SideBar = () => {
  const dataMenu = localStorage.itemPOP;
  const [activeLink, setActiveLink] = useState('');
  const [divisi, setDivisi] = useState('');
  const matches = useMediaQuery('(max-width: 991px)');

  const authReady = useAuthStore(selectAuthReady);
  const userData = useAuthStore(selectUser);

  useEffect(() => {
    if(authReady){
      setDivisi(userData.user_divisi)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
    const cekMenu = () =>{
        if(matches === false){
            onUpdateActiveLink(dataMenu)
        }
        else{
            onUpdateActiveLink(dataMenu)
        }
        
    }

    cekMenu()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[matches]);

  const onUpdateActiveLink = (e) =>{
    setActiveLink(e);
    localStorage.removeItem("itemPOP");
    localStorage.setItem("itemPOP",e);
  }

  return (
    <div className='sidebar'>
      <ul>
        <Link to={"/main"} className='link'>
          <li className={activeLink === 'profil' ||activeLink === undefined ? 'active list' : 'list'} onClick={()=> onUpdateActiveLink('profil')}>
            <span className='coverAll'>
              <span className='icon'><i class="bi bi-person"></i></span>
              <span className='title'>Profil</span>
            </span>
          </li>
        </Link>

        <Link to={"/"} className='link'>
          <li className={activeLink === 'dashboard' ? 'active list' : 'list'} onClick={()=> onUpdateActiveLink('dashboard')}>
            <span className='coverAll'>
              <span className='icon'><i class="bi bi-menu-button-wide-fill"></i></span>
              <span className='title'>Dashboard</span>
            </span>
          </li>
        </Link>

        <Link to={"/"} className='link'>
            <li className={activeLink === 'news' ? 'active list' : 'list'} onClick={()=> onUpdateActiveLink('news')}>
              <span className='coverAll'>
                <span className='icon'><i class="bi bi-newspaper"></i></span>
                <span className='title'>Bulletin</span>
              </span>
            </li>
        </Link>

        <Link to={"/main/"+divisi} className='link'>
            <li className={activeLink === 'form' ? 'active list' : 'list'} onClick={()=> onUpdateActiveLink('form')}>
              <span className='coverAll'>
                <span className='icon'><i class="bi bi-file-earmark-fill"></i></span>
                <span className='title'>Form</span>
              </span>
            </li>
        </Link>
      </ul>
    </div>
  )
}
