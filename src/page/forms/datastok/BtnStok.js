import React from 'react';
// import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import useAuthStore, { selectUser } from '../../../store/authLogin';

export const BtnStok = (props) => {
    const navigate = useNavigate();
    const userData = useAuthStore(selectUser);

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
        Order Barang
        </Tooltip>
    )

    const handleList = () =>{
        navigate(`/main/${userData.user_divisi}/STOKGUDANG/List`,{state:{
            data : props.data
          }});
            console.log(props.data)
    }

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
                    className="buttonSet"
                    onClick={()=>handleList()}
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
                    style={{ height: 30, lineHeight: 0.5 }}
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
                    style={{ height: 30, lineHeight: 0.5 }}
                    className="buttonReset"
                >
                <i className="bi bi-pencil"></i>
                </button>
            </OverlayTrigger>
        </span>
    </>
  )
}
