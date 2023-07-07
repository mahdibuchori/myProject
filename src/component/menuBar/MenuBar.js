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
import { InputStok } from '../../page/forms/datastok/InputStok';
import { EksternalProvider } from '../../page/forms/eksternalProvider/EksternalProvider';
import { InputProvider } from '../../page/forms/eksternalProvider/InputProvider';
import { UpdateProvider } from '../../page/forms/eksternalProvider/UpdateProvider';
import { ListStok } from '../../page/forms/datastok/ListStok';
import { Pengadaan } from '../../page/forms/pengadaan/Pengadaan';
import { CreatePengadaan } from '../../page/forms/pengadaan/CreatePengadaan';
import { UpdatePengadaan } from '../../page/forms/pengadaan/UpdatePengadaan';
import { SubmitPengadaan } from '../../page/forms/pengadaan/SubmitPengadaan';
import { VerifyPengadaan } from '../../page/forms/pengadaan/VerifyPengadaan';
import { CreatePo } from '../../page/forms/purchaseorder/CreatePo';
import { DataPo } from '../../page/forms/purchaseorder/DataPo';
import { PreviewPoPdf } from '../../page/forms/purchaseorder/PreviewPoPdf';
import { ListPo } from '../../page/forms/purchaseorder/ListPo';
import { DataSparepart } from '../../page/forms/sparepart/DataSparepart';
import { PengajuanPart } from '../../page/forms/sparepart/PengajuanPart';
import { UpdateOrder } from '../../page/forms/sparepart/UpdateOrder';
import { OrderPart } from '../../page/forms/sparepart/OrderPart';
import { AddPart } from '../../page/forms/sparepart/AddPart';
import { DataBom } from '../../page/forms/bom/DataBom';
import { InputBom } from '../../page/forms/bom/InputBom';
import { EditBom } from '../../page/forms/bom/EditBom';
import { FormPermintaan } from '../../page/forms/permintaan/FormPermintaan';
import { InputPermintaan } from '../../page/forms/permintaan/InputPermintaan';
import { UpdatePermmintaan } from '../../page/forms/permintaan/UpdatePermmintaan';
import { ViewPermintaan } from '../../page/forms/permintaan/ViewPermintaan';
import { CreateFormproses } from '../../page/forms/fromProses/CreateFormproses';
import { Tallysheet } from '../../page/forms/tallysheet/Tallysheet';
import { CreateTallysheet } from '../../page/forms/tallysheet/CreateTallysheet';
import { EditTallysheet } from '../../page/forms/tallysheet/EditTallysheet';
import { PdfTallysheet } from '../../page/forms/tallysheet/PdfTallysheet';

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
                    <Route path={`/${divisi}/Pengadaan`} element={<Pengadaan />} />
                    <Route path={`/${divisi}/Pengadaan/Create`} element={<CreatePengadaan />} />
                    <Route path={`/${divisi}/Pengadaan/Update`} element={<UpdatePengadaan />} />
                    <Route path={`/${divisi}/Pengadaan/Create PO`} element={<SubmitPengadaan />} />
                    <Route path={`/${divisi}/Pengadaan/Verifikasi`} element={<VerifyPengadaan />} />
                    <Route path={`/${divisi}/Pengadaan/NewCreate`} element={<CreatePo />} />
                     {/* DATA STOK */}
                    <Route exact path={"/"+divisi+"/STOKGUDANG"} element={<DataStok/>} />
                    <Route exact path={"/"+divisi+"/STOKGUDANG/create"} element={<InputStok />} />
                    <Route exact path={"/"+divisi+"/STOKGUDANG/List"} element={<ListStok />} />

                    {/*Eksternal Provider */}
                    <Route exact path={"/"+divisi+"/EksternalProvider"} element={<EksternalProvider />} />
                    <Route exact path={"/"+divisi+"/EksternalProvider/Create"} element={<InputProvider />} />
                    <Route exact path={"/"+divisi+"/EksternalProvider/Update"} element={<UpdateProvider />} />

                    {/* Purchasing */}
                    <Route exact path={"/"+divisi+"/Purchasing"} element={<ListPo />} />
                    <Route exact path={"/"+divisi+"/Purchasing/Data"} element={<DataPo />} />
                    <Route exact path={"/"+divisi+"/Purchasing/PreviewPO"} element={<PreviewPoPdf />} />

                    {/* Sparepart */}
                    <Route exact path={"/"+divisi+"/Sparepart"} element={<DataSparepart />} />
                    <Route exact path={"/"+divisi+"/Sparepart/CreatePart"} element={<AddPart />} />
                    <Route exact path={"/"+divisi+"/Sparepart/OrderPart"} element={<OrderPart />} />
                    <Route exact path={"/"+divisi+"/Sparepart/UpdateOrderPart"} element={<UpdateOrder />} />
                    <Route exact path={"/"+divisi+"/Sparepart/CretePengadaan"} element={<PengajuanPart />} /> 
                    {/* */}

                    {/*BOM */}
                    <Route exact path={"/"+divisi+"/BOM"} element={<DataBom />} />
                    <Route exact path={"/"+divisi+"/BOM/Create"} element={<InputBom />} />
                    <Route exact path={"/"+divisi+"/BOM/Edit"} element={<EditBom />} />

                    {/* Permintaan */}
                    <Route exact path={"/"+divisi+"/Permintaan"} element={<FormPermintaan />} />
                    <Route exact path={"/"+divisi+"/Permintaan/Create"} element={<InputPermintaan />} />
                    <Route exact path={"/"+divisi+"/Permintaan/Update"} element={<UpdatePermmintaan />} />
                    <Route exact path={"/"+divisi+"/Permintaan/View"} element={<ViewPermintaan />} />
                    {/*  */}

                    {/* Form Proses */}
                    <Route exact path={"/"+divisi+"/FormProses/Create"} element={<CreateFormproses />} />
                    {/* 
                    
                    <Route exact path={"/"+divisi+"/FormProses/Update"} element={<UpdateFormproses />} /> */}

                    {/* Tallysheet */}
                    <Route exact path={"/"+divisi+"/Tallysheet"} element={<Tallysheet />} />
                    <Route exact path={"/"+divisi+"/Tallysheet/Create"} element={<CreateTallysheet />} />
                    <Route exact path={"/"+divisi+"/Tallysheet/Preview"} element={<EditTallysheet />} />
                    <Route exact path={"/"+divisi+"/Tallysheet/PDF"} element={<PdfTallysheet />} />
                </Routes>
            </div>
        </div>
        <BottomBar/>
    </Fragment>
  )
}
