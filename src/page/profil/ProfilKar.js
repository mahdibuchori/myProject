import React, { useState, useEffect } from 'react';
import './profilKar.css';
import { Row, Col } from 'react-bootstrap';
import useAuthStore, { selectAuthReady, selectUser } from '../../store/authLogin';

export const ProfilKar = () => {
    const [profil, setProfil] = useState([]);
  const [photo, setPhoto] = useState('https://bootdey.com/img/Content/avatar/avatar7.png')
  const [cuti, setCuti] = useState('0')
  const [cutiBesar, setcutiBesar] = useState('0');
  const authReady = useAuthStore(selectAuthReady);
  const userData = useAuthStore(selectUser);
  
  useEffect(() => {
    const fetchProfil = async () => {
      try {
          if (authReady) {
            setProfil(userData)
            setPhoto(userData.tProfil.user_picUrl)
            setcutiBesar(userData.tProfil.user_cutBes)
            setCuti(userData.tProfil.user_cutTah)
          }
      } catch (error) {
          console.log(error);
      }
    }

    const handler = setTimeout(() => {
        fetchProfil()
        }, 300);

        return () => {
        clearTimeout(handler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  return (
    <div className='profilKar'>
        <div className='prof-ats'>
            <button><i class="bi bi-pencil"></i>&nbsp;Input Cuti</button>
        </div>
        
        <div className="row gutters-sm">
            <div className="col-md-4 mb-3">
            <div className="card">
                <div className="card-body border-start border-0 border-3 border-warning">
                <div className="d-flex flex-column align-items-center text-center">
                    <img src={photo} alt="Admin" className="rounded-circle" style={{width :150, height:150 }} />
                    <div className="mt-3">
                    <h4>{profil.user_name}</h4>
                    <p className="text-secondary">{profil.user_id}</p>
                    <p className="text-secondary">{profil.user_plan}</p>
                    </div>
                </div>
                </div>
            </div>
            </div>

            <div className="col-md-8">
            <Row>
                <Col sm>
                <div className="shawd mb-3">
                    <div className="col">
                    <div className="radius-10 border-top border-0 border-3 border-success">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                        <div>
                            <p className="mb-0 text-secondary">Divisi</p>
                            <h4 className="my-1 text-primary">{profil.user_divisi}</h4>
                        </div>
                        </div>
                    </div>
                    </div>
                    </div>
                </div>
                </Col>

                <Col sm>
                <div className="shawd mb-3">
                    <div className="col">
                    <div className="radius-10 border-top border-0 border-3 border-success">
                        <div className="card-body">
                        <div className="d-flex align-items-center">
                            <div>
                            <p className="mb-0 text-secondary">Status</p>
                            <h4 className="my-1 text-primary">{profil.user_status}</h4>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </Col>

            </Row>


            <Row>
                <Col sm>
                <div className="shawd mb-3">
                    <div className="col">
                    <div className="radius-10 border-start border-0 border-3 border-danger">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                        <div>
                            <p className="mb-0 text-secondary">Total Absensi</p>
                            <h4 className="my-1 text-primary">4805</h4>
                        </div>
                        </div>
                    </div>
                    </div>
                    </div>
                </div>
                </Col>

                <Col sm>
                <div className="shawd mb-3">
                    <div className="col">
                    <div className="radius-10 border-start border-0 border-3 border-warning">
                        <div className="card-body">
                        <div className="d-flex align-items-center">
                            <div>
                            <p className="mb-0 text-secondary">Sisa Cuti Tahunan</p>
                            <h4 className="my-1 text-primary">{cuti}</h4>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </Col>

                <Col sm>
                <div className="shawd mb-3">
                    <div className="col">
                    <div className="radius-10 border-start border-0 border-3 border-info">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                        <div>
                            <p className="mb-0 text-secondary">Sisa Cuti Besar</p>
                            <h4 className="my-1 text-primary">{cutiBesar}</h4>
                        </div>
                        </div>
                    </div>
                    </div>
                    </div>
                </div>
                </Col>

            </Row>
            </div>
        </div>

        <div className="row gutters-sm">
            History Cuti
        </div>
    </div>
  )
}
