import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore, { selectUser } from '../../store/authLogin';
import './topBar.css'

export const TopBar = ({setAuth}) => {
  const userData = useAuthStore(selectUser);
  let navigate = useNavigate();
  const logout = e =>{
    e.preventDefault();
    localStorage.removeItem("token","user_name","user_status","user_level","user_divisi");
    localStorage.clear();
    navigate("/");
    setAuth(false);
  };
  return (
    <div className='topbar'>
      <div className='topName'>
        Hi, {userData.user_name}
      </div>
      <div className='topOut'>
        <button className='btnOut'  onClick={e => logout(e)}><i className="bi bi-box-arrow-in-right"></i>&nbsp;Logout</button>
        
      </div>
    </div>
  )
}
