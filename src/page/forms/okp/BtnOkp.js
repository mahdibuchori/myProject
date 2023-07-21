import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import useAuthStore, { selectUser } from '../../../store/authLogin';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export const BtnOkp = (props) => {
  const navigate = useNavigate();
  const userData = useAuthStore(selectUser);

  const buttonClicked = () =>{
    if(userData.user_divisi === "Develop"){
      if(props.data.no === "Total"){
        Swal.fire("Tidak Dapat Melakukan Aksi","","info")
      }
      else{
        toUpdate(`/main/${userData.user_divisi}/OKP/Update`);
      }
    }
    else if(userData.user_divisi === "PPIC-WH" && userData.user_level === "Level2"){
      if(props.data.no === "Total"){
        Swal.fire("Tidak Dapat Melakukan Aksi","","info")
      }
      else{
        toUpdate(`/main/${userData.user_divisi}/OKP/Update`);
      }
    }
    else{
      Swal.fire('Info','Anda tidak memiliki akses','warning')
    }
  }

  const buttonDelete = () =>{
    if(userData.user_divisi === "Develop"){
      if(props.data.no === "Total"){
        Swal.fire("Tidak Dapat Melakukan Aksi","","info")
      }
      else{
        toUpdate(`/main/${userData.user_divisi}/OKP/Delete`);
      }
    }
    else if(userData.user_divisi === "PPIC-WH" && userData.user_level === "Level2"){
      if(props.data.no === "Total"){
        Swal.fire("Tidak Dapat Melakukan Aksi","","info")
      }
      else{
        toUpdate(`/main/${userData.user_divisi}/OKP/Delete`);
      }
    }
    else{
      Swal.fire('Info','Anda tidak memiliki akses','warning')
    }
  }
  
  const toUpdate = (e) =>{
    navigate(e,{state:{
      nomer : props.data.no,
      noteLength : "",
      okp : props.data.okp,
      selectTgl : props.data.tangOKP,
      produksi : props.data.tangProd,
      revisiOK : props.data.revisiOkp,
      tglRevisi : props.data.tangRev, 
      setData: "updateOKP",
      data : props.data
    }});
  }
  


  const renderHapus = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        Hapus Data
      </Tooltip>
  )

  const renderEdit = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        Update Data
      </Tooltip>
  )
  return (
    <>
    <span>
        <OverlayTrigger
            placement="bottom"
            delay={{ show: 150, hide: 250 }}
            overlay={renderEdit}
        >
            <button style={{ height: 30, lineHeight: 0.5 }} onClick={()=>buttonClicked()} className="buttonSet">
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
                onClick={() => buttonDelete()}
                className="buttonCancel"
            >
            <i className="bi bi-trash3-fill"></i>
            </button>
        </OverlayTrigger>
    </span>
    </>
  )
}
