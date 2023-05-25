import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import useAuthStore, { selectUser } from '../../../store/authLogin';
import useBomStore, {selectFetchBom, selectFetchBomByID, selectBomIdReady} from '../../../store/listBom';
import { API_AUTH } from '../../../apis/apisData';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export const BtnBom = (props) => {
    const navigate = useNavigate();
    const userData = useAuthStore(selectUser);
    const onBom = useBomStore(selectFetchBomByID);
    const onBoms = useBomStore(selectFetchBom);
    const bomReady = useBomStore(selectBomIdReady);

    const buttonClicked =async () =>{
        try {
            await onBom(props.data.id_bom);
            if(!bomReady){
                Swal.fire('Harap Mengulangi Proses', '', 'info')
            }
            navigate(`/main/${userData.user_divisi}/BOM/Edit`)
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi Kesalahan'
              })
        }
    }

    const buttonDelete =async () =>{
        Swal.fire({
        title: `Apakah anda ingin menghapus data BOM dengan id ${props.data.id_bom}`,
        showDenyButton: true,
        confirmButtonText: 'Hapus',
        denyButtonText: `Batal`,
        }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            deleteData();
            // this.gridApi.getSelectedRows()
        } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
        }
        })
    }

    const deleteData = async () =>{
        try {
            await API_AUTH.delete(`/bom/${props.data.id_bom}`);
            await onBoms();
            Swal.fire('Saved!', navigate(0), 'success')
        } catch (error) {
            console.log(error)
            Swal.fire(`${error.msg}!`, '', `info`)
            // Swal.fire('Changes are not saved', '', 'info')
        }
        
    }

    const renderEdit = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Cek Data
        </Tooltip>
    )
    const renderHapus = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Hapus Data
        </Tooltip>
    )
  return (
    <span>
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
                style={{ height: 30, lineHeight: 0.5 }}
                onClick={() => buttonDelete()}
                className="buttonCancel"
            >
            <i className="bi bi-trash3-fill"></i>
            </button>
        </OverlayTrigger>
    </span>
  )
}
