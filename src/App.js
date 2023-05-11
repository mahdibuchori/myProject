import React, { useState, useEffect } from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Beranda } from './portofolio/Beranda';
import { MenuBar } from './component/menuBar/MenuBar';
import { API_AUTH } from './apis/apisData';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  }

  const isAuth = async () =>{
    try {
      const response = await API_AUTH.get(`/authLog`, {
          headers : {token: localStorage.token}
      });
      
      const parseRes = await response.json();
      if(parseRes.message === "Not Authorize"){
        localStorage.setItem("Link","/*")
      }
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } 
    catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    isAuth();
  },[]);
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path="/" element={isAuthenticated ? <MenuBar setAuth ={setAuth}/> :  <Beranda setAuth ={setAuth}/>} />
          <Route exact path="/main/*" element={!isAuthenticated ? <Beranda setAuth ={setAuth}/> :  <MenuBar setAuth ={setAuth}/>}/> 
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
