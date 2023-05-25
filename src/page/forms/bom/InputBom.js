import React, { useState, useEffect } from 'react';
import './bom.css';
import Swal from "sweetalert2";
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { API_AUTH } from '../../../apis/apisData';
import { Breadcrumb, Button, Card, Col, Container, Form, } from 'react-bootstrap';


import {LoadingPage} from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import { FileTipe, FileSatuan } from '../../../datafile/FileSelect';
import useBomStore, { selectFetchBom } from '../../../store/listBom';
import useMaterialStore, { selectMaterial, selectFetchMaterial, selectMaterialReady } from '../../../store/listBarang';

export const InputBom = () => {
    const navigate = useNavigate();
    const userData = useAuthStore(selectUser);
    const onBom = useBomStore(selectFetchBom);
    const newMaterial = useMaterialStore(selectMaterial);
    const fetchMaterial = useMaterialStore(selectFetchMaterial);
    const materialReady = useMaterialStore(selectMaterialReady);
  
    
    const [isLoading, setIsLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    // const [dataReady, setDataReady] = useState(false);
  
    const [idBom, setIdBom] = useState('');
    const [noBom, setNoBom] = useState('BOM-');
    const [idItem,setIdItem] = useState('');
    const [namaItem,setNamaItem] = useState('');
    const[varian,setVarian] = useState('');
    const[revisi,setRevisi] = useState('');
  
    const [namaMaterial,setNamaMaterial] = useState([]);
    const [inputList, setInputList] = useState([{ tipe: '', material: '', qty: '', satuan: '' }]);
  
    useEffect(() => {
      fetchMaterial();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    useEffect(() => {
      if (!materialReady) return;
    }, [materialReady]);
  
    let modifiedArr = newMaterial.map(function(element){
      return { value: element.item, label: element.item, tipe_barng: element.tipe_barng, unit: element.unit };
    });
  
    useEffect(() => {
      const createUniq = () => {
        const xsd = Math.random().toString(36).slice(-4);
        setIdBom("IDB"+xsd.toUpperCase());
      }
      createUniq();
    }, []);
  
    const handleSubmit =async (event) => {
      event.preventDefault();
      
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      else{
        setValidated(true);
        inputList.forEach((e,index) =>{
          let data = modifiedArr.filter(x => x.tipe_barng === e.tipe && x.value === e.material);
          if(data.length === 0){
            return Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `Kesalahan dalam data material ke-${index+1}`,
              })
          }
        })
        try {
          setIsLoading(true);
          await API_AUTH.post(`/bom`, {
            id_bom : idBom,
            no_bom : noBom,
            id_item : idItem,
            deskripsi_item : namaItem,
            varian : varian,
            revisi : revisi,
            list_material : inputList
          });
          
          await onBom();
          setIsLoading(false);
          Swal.fire('Proses penyimpanan berhasil!', '', 'success')
          navigate(`/main/${userData.user_divisi}/BOM`)
        } catch (error) {
            setIsLoading(false);
            Swal.fire('Terjadi kesalahan saat proses input data!', '', 'error')
        }
      }
      
    }
  
    const handleInputChange = (e, index) => {
      const { name, value } = e.target;
      const list = [...inputList];
      list[index][name] = value.toUpperCase();
      setInputList(list);
    };
  
    const handleSelectChange = (e, index, y) => {
      const list = [...inputList];
      list[index][y] = e.value;
      if(y === "tipe"){
        const newFileNab = modifiedArr.filter(x => x.tipe_barng === e.value);
        setNamaMaterial(newFileNab)
      }
      setInputList(list);
    };
  
    const handleRemoveClick = (index) => {
      const list = [...inputList];
      list.splice(index, 1);
      setInputList(list);
    };
  
    const handleAddClick = () => {
      setInputList([...inputList, { tipe: '', material: '', qty: '', satuan: '' }]);
    };
  
    const backhome =async (e) =>{
      await onBom();
      navigate(e)
    }
  
    return (
      <>
        <div className='bom'>
            <div className='bom-item-top'>
            <div>
                <Breadcrumb>
                <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                <Breadcrumb.Item onClick={() => backhome(`/main/${userData.user_divisi}/BOM`)}>BOM</Breadcrumb.Item>
                <Breadcrumb.Item active>Create</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            </div>
    
            <Container>
            <Form validated={validated} onSubmit={handleSubmit}>
                {/*<!-- Title --> */}
                <div className="d-flex justify-content-between align-items-lg-center py-3 flex-column flex-lg-row">
                    <h2 className="h5 mb-1 mb-lg-0">Create New Data</h2>
                </div>
                {/*<!-- Main content --> */}
                <div className="row">
                    <div className='col-lg-12'>
                    <Card className='mb-1'>
                        <Card.Body>
                        <div className="row">
                            <div className='col-lg-4'>
                            <Form.Group as={Col} controlId="validationCustom01">
                                <Form.Label>ID-BOM</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    value={idBom}
                                    disabled
                                />
                            </Form.Group>
                            </div>
    
                            <div className='col-lg-4'>
                            <Form.Group as={Col} controlId="validationCustom02">
                                <Form.Label>No BOM</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    value={noBom.toUpperCase()}
                                    onChange={ (e) => setNoBom(e.target.value) }
                                />
                                <Form.Control.Feedback type="invalid">No BOM Tidak Boleh Kosong</Form.Control.Feedback>
                            </Form.Group>
                            </div>
    
                            <div className='col-lg-4'>
                            <Form.Group as={Col} controlId="validationCustom02">
                                <Form.Label>Id Item</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    value={idItem.toUpperCase()}
                                    onChange={ (e) => setIdItem(e.target.value) }
                                />
                                <Form.Control.Feedback type="invalid">id item tidak boleh kosong</Form.Control.Feedback>
                            </Form.Group>
                            </div>
                        </div>
    
                        <div className="row mt-2" >
                            <div className='col-lg-4'>
                            <Form.Group as={Col} controlId="validationCustom01">
                                <Form.Label>Deskripsi Item</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    value={namaItem.toUpperCase()}
                                    onChange={ (e) => setNamaItem(e.target.value) }
                                />
                                <Form.Control.Feedback type="invalid">deskripsi item tidak boleh kosong</Form.Control.Feedback>
                            </Form.Group>
                            </div>
    
                            <div className='col-lg-4'>
                            <Form.Group as={Col} controlId="validationCustom01">
                                <Form.Label>Varian</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    value={varian.toUpperCase()}
                                    onChange={ (e) => setVarian(e.target.value) }
                                />
                                <Form.Control.Feedback type="invalid">harap input varian</Form.Control.Feedback>
                            </Form.Group>
                            </div>
    
                            <div className='col-lg-4'>
                            <Form.Group as={Col} controlId="validationCustom01">
                                <Form.Label>Revisi</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    value={revisi.toUpperCase()}
                                    onChange={ (e) => setRevisi(e.target.value) }
                                />
                                <Form.Control.Feedback type="invalid">revisi data tidak boleh kosong</Form.Control.Feedback>
                            </Form.Group>
                            </div>
                            
                            
                        </div>
    
                        <h4 className='mt-2'>Data Material</h4>
                        {inputList.map((x, i) => {
                            return(
                            <div className="row mt-2">
                                <h6>Data Ke-{i+1}</h6>
    
                                <div className='col-lg-3'>
                                <Form.Group as={Col} controlId="validationCustom01">
                                    <Form.Label>Tipe Material</Form.Label>
                                    <Select
                                        required
                                        name="tipe"
                                        options={FileTipe}
                                        onChange={(e) => {
                                        // setTibar(e)
                                        // setDataReady(true)
                                        handleSelectChange(e, i, "tipe")
                                        }}
                                        isSearchable = {true}
                                    />
                                </Form.Group>
                                </div>
                                
                                <div className='col-lg-3'>
                                <Form.Group as={Col} controlId="validationCustom02">
                                    <Form.Label>Material</Form.Label>
                                    <Select
                                        title={"material"}
                                        name={"material"}
                                        options = {namaMaterial}
                                        onChange={(e) => {
                                        handleSelectChange(e, i, "material")
                                        }}
                                        isSearchable = {true}
                                    />
                                </Form.Group>
                                </div>
                                
                                <div className='col-lg-2'>
                                <Form.Group as={Col} controlId="validationCustom01">
                                    <Form.Label>Qty</Form.Label>
                                    <Form.Control
                                    required
                                    name="qty"
                                    type="number"
                                    placeholder="qty"
                                    value={x.qty}
                                    onChange={(e) => handleInputChange(e, i)}
                                    />
                                </Form.Group>
                                </div>
    
                                <div className='col-lg-2'>
                                <Form.Group as={Col} controlId="validationCustom02">
                                    <Form.Label>Sataun</Form.Label>
                                    <Select
                                        title={"satuan"}
                                        name={"satuan"}
                                        options={FileSatuan}
                                        onChange={(e) => handleSelectChange(e, i, "satuan")}
                                    />
                                </Form.Group>
                                </div>
                                <div className='col-lg-2'>
                                <Form.Group as={Col} controlId="validationCustom02">
                                    <Form.Label>Action</Form.Label>
                                    <div style={{display: "flex"}}>
                                    {inputList.length !== 1 && (
                                        <Button variant="primary" onClick={() => handleRemoveClick(i)} style={{height: "35px"}}>
                                        <i className="bi bi-trash"></i>&nbsp;Hapus
                                        </Button>
                                    )}
                                    {inputList.length - 1 === i && (
                                        <Button variant="success" onClick={() => handleAddClick(i)} style={{height: "35px", marginLeft: "10px"}}><i className="bi bi-plus-square"></i>&nbsp;Add</Button>
                                    )}
                                    </div>
                                </Form.Group>
                                </div>
                                
                            </div>
                            )
                        })}
                        
    
                        <div className="row">
                            <div className="col-lg-6">
                            <div className="d-flex py-3 flex-column flex-lg-row">
                                <Button type="submit">Submit form</Button>
                            </div>
                            </div>
                            <div className="col-lg-6"></div>
                        </div> 
                            
                        </Card.Body>
                        
                    </Card>
                    </div>
                </div>
            </Form>
            </Container>
        </div>
    
        {isLoading ? <LoadingPage/> : ""}
      </>
    )
}
