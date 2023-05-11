import React, { Fragment, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './menuBar.css';

import {TopBar} from '../topBar/TopBar';
import {SideBar} from '../sideBar/SideBar';
import {BottomBar} from '../bottomBar/BottomBar';
import { ProfilKar } from '../../page/profil/ProfilKar';
import { MenuAll } from '../../menuDivisi/MenuAll';

export const MenuBar = ({setAuth}) => {
    
  return (
    <Fragment>
        <TopBar setAuth={setAuth}/>
        <div>
            <div className='containersbox'>
                <SideBar/>
                <Routes>
                    <Route path={'/*'} index element ={<ProfilKar />} />
                    <Route path={"/Develop"} element={<MenuAll />} />
                </Routes>
            </div>
        </div>
        <BottomBar/>
    </Fragment>
  )
}
