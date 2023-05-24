import React, { useState ,useEffect } from 'react';
import './dataSparepart.css';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import useAuthStore, { selectUser } from '../../../store/authLogin';

export const BtnSparepart = (props) => {
    const navigate = useNavigate();
    const userData = useAuthStore(selectUser);
    const [cekData, setCekData] = useState('');
    const [cekPengajuan, setcekPengajuan] = useState('');

    useEffect(() => {
        if(userData.user_divisi === "Develop"){
            setCekData('block')
            setcekPengajuan('block')
        }
        else if(userData.user_divisi === "PPIC-WH"){
            setCekData('block')
            setcekPengajuan('none')
        }
        else if(userData.user_divisi === "Maintenance"){
            setCekData('none')
            setcekPengajuan('block')
        }
        else{
            setCekData('none')
            setcekPengajuan('none')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const buttonClicked =async (e) =>{
        if(props.data.status_item === "PENGAJUAN"){
            navigate(e,{state:{
                data : props.data
                }});
        }
        else{
            Swal.fire('Info','Tidak memiliki akses','warning');
        }
    }

    const buttonOrder = (e) => {
        if(props.data.status_item === "STOCK LIMIT"){
            navigate(`/main/${userData.user_divisi}/Sparepart/OrderPart`,{state:{
            statusItem: "Pengajuan",
            data : props.data
            }});
        }
        else if(props.data.status_item === "PENGAJUAN"){
            navigate(`/main/${userData.user_divisi}/Sparepart/UpdateOrderPart`,{state:{
                statusItem: "Update Pengajuan",
                data : props.data
                }});
        }
        else{
            Swal.fire('Info','Tidak dapat melakukan proses selanjutnya','warning');
        }
        
    }

    const buttonPart = (e) => {
        if(props.data.status_item === "PENGAJUAN"){
            navigate(e,{state:{
                statusItem: "Update Pengajuan",
                data : props.data
                }});
        }
        else{
            Swal.fire('Info','Tidak dapat melakukan proses selanjutnya','warning');
        }
    }

    const renderHapus = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Verify Pengajuan
        </Tooltip>
    )

    const renderEdit = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Cek Data
        </Tooltip>
    )

    const resetPass = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Order Part
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
                overlay={renderHapus}
            >
                <button
                    style={{ height: 30, lineHeight: 0.5, display: cekPengajuan}}
                    onClick={() => buttonPart(`/main/${userData.user_divisi}/Sparepart/CretePengadaan`)}
                    className="buttonCancel"
                >
                <i className="bi bi-check-lg"></i>
                </button>
            </OverlayTrigger>

            <OverlayTrigger
                placement="bottom"
                delay={{ show: 150, hide: 250 }}
                overlay={resetPass}
            >
                <button
                    style={{ height: 30, lineHeight: 0.5, display: cekData }}
                    onClick={buttonOrder}
                    className="buttonReset"
                >
                <i className="bi bi-pencil"></i>
                </button>
            </OverlayTrigger>
        </span>
    </>
  )
}
