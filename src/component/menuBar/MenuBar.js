import React, { Fragment, useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './menuBar.css';

import {TopBar} from '../topBar/TopBar';
import {SideBar} from '../sideBar/SideBar';
import {BottomBar} from '../bottomBar/BottomBar';
import { ProfilKar } from '../../page/profil/ProfilKar';
import { MenuAll } from '../../menuDivisi/MenuAll';
import { MenuBod } from '../../menuDivisi/MenuBod';
import { MenuPpic } from '../../menuDivisi/MenuPpic';
import { MenuProduksi } from '../../menuDivisi/MenuProduksi';
import { MenuPurchasing } from '../../menuDivisi/MenuPurchasing';
import { MenuMaintenance } from '../../menuDivisi/MenuMaintenance';

import useAuthStore, { selectUser } from '../../store/authLogin';
import { CetakPengadaan } from '../../page/forms/pengadaan/CetakPengadaan';
import { DataStok } from '../../page/forms/datastok/DataStok';
export const MenuBar = ({setAuth}) => {

  const userData = useAuthStore(selectUser);
  const [divisi, setDivisi] = useState('');

  
  useEffect(() => {
    console.log(divisi)
    const itemPOP = localStorage.itemPOP;
    setDivisi(userData.user_divisi);
    if(itemPOP === ""|| itemPOP === undefined){
      localStorage.setItem("itemPOP","profil");
    }
    else{
      localStorage.setItem("itemPOP",itemPOP);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
    
  return (
    <Fragment>
        <TopBar setAuth={setAuth}/>
        <div>
            <div className='containersbox'>
                <SideBar/>
                <Routes>
                    <Route path={'/*'} index element ={<ProfilKar />} />
                    <Route path={"/Develop"} element={<MenuAll />} />
                    <Route path={'/*'} index element ={<ProfilKar />} />
                    <Route path={"/Develop"} element={<MenuAll />} />
                    <Route path={"/Produksi"} element={<MenuProduksi />} />
                    <Route path={"/Purchasing"} element={<MenuPurchasing />} />
                    <Route path={"/PPIC-WH"} element={<MenuPpic />} />
                    <Route path={"/Maintenance"} element={<MenuMaintenance />} />
                    <Route path={"/BOD-BOC"} element={<MenuBod />} />

                    {/*Pengadaan */}
                    <Route path={`/${divisi}/Pengadaan/Preview`} element={<CetakPengadaan />} />
                    {/* <Route path={`/${divisi}/Pengadaan`} element={<Pengadaan />} />
                    <Route path={`/${divisi}/Pengadaan/Create`} element={<CreatePengadaan />} />
                    <Route path={`/${divisi}/Pengadaan/Update`} element={<UpdatePengadaan />} />
                    <Route path={`/${divisi}/Pengadaan/Verifikasi`} element={<VerifyPengadaan />} />
                    <Route path={`/${divisi}/Pengadaan/Create PO`} element={<SubmitPengadaan />} />
                    <Route path={`/${divisi}/Pengadaan/NewCreate`} element={<CreatePo />} />
                     */}

                     {/* DATA STOK */}
                  <Route exact path={"/"+divisi+"/STOKGUDANG"} element={<DataStok/>} />

                </Routes>
            </div>
        </div>
        <BottomBar/>
    </Fragment>
  )
}
