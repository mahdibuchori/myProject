import React, { useState, useEffect } from 'react';
import './pengadaan.css';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import useAuthStore, { selectUser } from '../../../store/authLogin';

export const BtnPengadaan = (props) => {
  const navigate = useNavigate();
  const userData = useAuthStore(selectUser);
  const [cekData, setCekData] = useState('none');

  useEffect(() => {
    if(userData.user_divisi === "Develop"){
      setCekData('block');
      
    }
    else if (userData.user_divisi === "Purchasing"){
      if(String(props.data.status).toUpperCase() === "VERIFIKASI"){
        setCekData('block');
      }
      else{
        setCekData('none');
      }
      
    }
    else{
      setCekData('none')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const buttonClicked =async () =>{
    navigate(`/main/${userData.user_divisi}/Pengadaan/Update`,{state:{
      data : props.data
    }});
  }

  const buttonVerify =async () =>{
    let level = userData.user_level.toUpperCase();
    let divisi = userData.user_divisi.toUpperCase();
    let divi = props.data.user[0].divisi
    if(String(props.data.status).toUpperCase() === "PENGAJUAN"){
      if(divi.toUpperCase() === divisi){
        switch (divisi) {
        case "FG":
            if(level === "LEVEL2" || level === "LEVEL3"){
              navigate(`/main/${userData.user_divisi}/Pengadaan/Verifikasi`,{state:{
                data : props.data
              }});
            }
            else{
              Swal.fire('Info','Tidak memiliki akses','warning');
            }
        break;
        case "HR-GA":
          if(level === "LEVEL3"){
            navigate(`/main/${userData.user_divisi}/Pengadaan/Verifikasi`,{state:{
              data : props.data
            }});
          }
          else{
            Swal.fire('Info','Tidak memiliki akses','warning');
          }
        break;
        case "MAINTENANCE":
          if(level === "LEVEL2" || level === "LEVEL3"){
            navigate(`/main/${userData.user_divisi}/Pengadaan/Verifikasi`,{state:{
              data : props.data
            }});
          }
          else{
            Swal.fire('Info','Tidak memiliki akses','warning');
          }
        break;
        case "PPIC-WH":
          if(level === "LEVEL2" || level === "LEVEL3"){
            navigate(`/main/${userData.user_divisi}/Pengadaan/Verifikasi`,{state:{
              data : props.data
            }});
          }
          else{
            Swal.fire('Info','Tidak memiliki akses','warning');
          }
        break;
        case "PRODUKSI":
          if(level === "LEVEL2"){
            navigate(`/main/${userData.user_divisi}/Pengadaan/Verifikasi`,{state:{
              data : props.data
            }});
          }
          else{
            Swal.fire('Info','Tidak memiliki akses','warning');
          }
        break;
        case "PURCHASING":
          if(level === "LEVEL2" || level === "LEVEL3"){
            navigate(`/main/${userData.user_divisi}/Pengadaan/Verifikasi`,{state:{
              data : props.data
            }});
          }
          else{
            Swal.fire('Info','Tidak memiliki akses','warning');
          }
        break;
        case "QAQC":
          if(level === "LEVEL2"){
            navigate(`/main/${userData.user_divisi}/Pengadaan/Verifikasi`,{state:{
              data : props.data
            }});
          }
          else{
            Swal.fire('Info','Tidak memiliki akses','warning');
          }
        break;
        case "RND":
          if(level === "LEVEL2"){
            navigate(`/main/${userData.user_divisi}/Pengadaan/Verifikasi`,{state:{
              data : props.data
            }});
          }
          else{
            Swal.fire('Info','Tidak memiliki akses','warning');
          }
        break;
        case "SSD":
          if(level === "LEVEL3"){
            navigate(`/main/${userData.user_divisi}/Pengadaan/Verifikasi`,{state:{
              data : props.data
            }});
          }
          else{
            Swal.fire('Info','Tidak memiliki akses','warning');
          }
        break;
        case "DEVELOP":
          navigate(`/main/${userData.user_divisi}/Pengadaan/Verifikasi`,{state:{
            data : props.data
          }});
        break;
        default:
          Swal.fire('Info','Tidak memiliki akses','warning');
        }
      }
      else{
        Swal.fire('info','Tidak memiliki akses','warning')
      }

    }
    else if(String(props.data.status).toUpperCase() === "VERIFIKASI"){
      Swal.fire('info','Pengadaan barang sedang diproses oleh purchasing','info')
    }
    
    
  }

  const buttonOrder =async () =>{
    navigate(`/main/${userData.user_divisi}/Pengadaan/Create PO`,{state:{
      data : props.data
    }});
  }
  const renderVerify = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Verify Pengadaan
    </Tooltip>
  )

  const renderEdit = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        Cek Data
      </Tooltip>
  )

  const renderPO = (props) => (
      <Tooltip id="button-tooltip" {...props}>
       Create/Cek PO
      </Tooltip>
  )

  

  return (
    <>
        <span style={{display: 'flex'}}>
            <OverlayTrigger
                placement="bottom"
                delay={{ show: 150, hide: 250 }}
                overlay={renderEdit}
            >
                <button
                    style={{ height: 30, lineHeight: 0.5 }}
                    onClick={() => buttonClicked()}
                    className="buttonSet"
                >
                <i className="bi bi-clipboard"></i>
                </button>
            </OverlayTrigger>

            <OverlayTrigger
                placement="bottom"
                delay={{ show: 150, hide: 250 }}
                overlay={renderVerify}
            >
                <button
                    style={{ height: 30, lineHeight: 0.5}}
                    onClick={() => buttonVerify()}
                    className="buttonCancel"
                >
                <i className="bi bi-check-lg"></i>
                </button>
            </OverlayTrigger>

            <OverlayTrigger
                placement="bottom"
                delay={{ show: 150, hide: 250 }}
                overlay={renderPO}
            >
                <button
                    style={{ height: 30, lineHeight: 0.5, display: cekData }}
                    onClick={() => buttonOrder()}
                    className="buttonReset"
                >
                <i className="bi bi-pencil"></i>
                </button>
            </OverlayTrigger>
        </span>
    </>

  )
}
