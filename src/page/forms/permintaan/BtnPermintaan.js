import React, { Fragment, useState, useEffect } from 'react';
import './permintaan.css';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import { API_AUTH } from '../../../apis/apisData';

export const BtnPermintaan = (props) => {  const navigate = useNavigate();
    const userData = useAuthStore(selectUser);
    const [waktu, setWaktu] = useState("");
  
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
      const today = new Date();
      let hour = today.getHours();
      let minute = today.getMinutes();
      let hh = String(hour).padStart(2, '0');
      let mm = String(minute).padStart(2, '0');
      const time = hh + ':' + mm ;
      setWaktu(time);
    }, []);

    const buttonClicked = async () =>{
      if(props.data.plan === userData.user_plan){
        if(props.data.status_item === "" && userData.user_divisi === "Produksi"){
          navigate(`/main/${userData.user_divisi}/Permintaan/Update`,{state:{
            data : props.data
          }});
        }
        else{
          navigate(`/main/${userData.user_divisi}/Permintaan/View`,{state:{
            data : props.data
          }});
        }
      }
      else{
        Swal.fire('Info','Data plan tidak sama','warning');
      }
    }
  
    const buttonVerify = () =>{
      if(userData.user_divisi === props.data.divisi && userData.user_plan === props.data.plan){
        if(props.data.status_item === "Pengajuan"){
            if(userData.user_level === "Level1" || userData.user_level === "Level2" || userData.user_level === "Level3" || userData.user_level === "Level4" || userData.user_level === "Level5" ){
              Swal.fire({
                title: 'Apakah anda ingin memverifikasi permintaan barang?',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Ya, Verifikasi',
                denyButtonText: `Revisi Data`,
                icon: 'question',
              }).then((result) => {
                if (result.isConfirmed) {
                    verifyPermintaan('Progress','');
                } else if (result.isDenied) {
                    Swal.fire({
                        text: "Masukan keterangan revisi",
                        icon: 'warning',
                        input: 'textarea',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Simpan',
                        cancelButtonText: 'Batal',
                    }).then((results) => {
                        if (results.isConfirmed) {
                            if(results.value.length === ""){
                                Swal.fire('Harap input keterangan revisi','','warning')
                            }
                            else{
                                verifyPermintaan('Revisi',results.value);
                            }
                        }
                    })
                }
              })
            }
        }
        else if(props.data.status_item === "Revisi"){
          Swal.fire('Info','Maaf sedang dalam proses perbaikan data','warning');
        }
        else{
          Swal.fire('Info','Tidak dapat melakukan proses','info');
        }
      }
      else{
        Swal.fire('Info','Maaf anda tidak dapat melakukan proses verifikasi','warning');
      }
    }
  
    const verifyPermintaan = async(e,file) =>{
      try {
          const next = await API_AUTH.put(`/verifypermintaan`, {
              "id" : props.data.id_permintaan,
              "okp" : props.data.id_okp,
              "item" : props.data.nama_item,
              "tPermintaan" : props.data.tgl_okp,
              "divisi" : userData.user_divisi,
              "pengajuan" : e,
              "keterangan" : file,
              "plan" : userData.user_plan,
              "user" : userData.user_name,
              "now" : waktu
          });
          setIsLoading(false);
          Swal.fire(`${next.data.message}`, navigate(0), 'success');
      } catch (error) {
          console.log(error.message)
          Swal.fire('Info', 'Terjadi Kesalahan!', 'error')
          setIsLoading(false);
      }
    }
    return (
      <Fragment>
        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Cek Data</Tooltip>}>
            <span>
            <button
                style={{ height: 30, lineHeight: 0.5 }}
                onClick={() => buttonClicked()}
                className="buttonSet"
            >
            <i class="bi bi-clipboard"></i>
            </button>
            </span>
        </OverlayTrigger>
            
        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Verifikasi Data</Tooltip>}>
            <span>
            <button
                style={{ height: 30, lineHeight: 0.5 }}
                onClick={() => buttonVerify()}
                className="buttonCancel"
            >
            <i class="bi bi-check-lg"></i>
            </button>
            </span>
        </OverlayTrigger>
  
        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Form Proses</Tooltip>}>
            <span>
            <button
                style={{ height: 30, lineHeight: 0.5 }}
                onClick={() => buttonClicked()}
                className="buttonReset"
            >
            <i className="bi bi-pencil"></i>
            </button>
            </span>
        </OverlayTrigger>
  
        {isLoading ? <LoadingPage/> : ""}
      </Fragment>
    )
}
