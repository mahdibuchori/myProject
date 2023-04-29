import React, { useState, useEffect } from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Beranda } from './portofolio/Beranda';

function App() {
  return (
    <div className="App">
      <Beranda />
    </div>
  );
}

export default App;
