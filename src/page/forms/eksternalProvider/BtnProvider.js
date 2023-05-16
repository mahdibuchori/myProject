import React from 'react';
import { useNavigate } from 'react-router-dom';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import useAuthStore, { selectUser } from '../../../store/authLogin';
export const BtnProvider = (props) => {
    const navigate = useNavigate();
    const userData = useAuthStore(selectUser);

    const buttonClicked =async () =>{
      navigate(`/main/${userData.user_divisi}/EksternalProvider/Update`,{state:{
        data : props.data
      }});
        console.log(props.data)
    }

  return (
    <>
    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Cek All Data</Tooltip>}>
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
    </>
  )
}
