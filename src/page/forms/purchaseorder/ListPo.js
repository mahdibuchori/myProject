import React, {useEffect, useState} from 'react';
import './orderpurchase.css';
import { useNavigate } from 'react-router-dom';
import { Badge, Breadcrumb, Button, Card, Col, Dropdown, DropdownButton, Form, ListGroup, Row, Stack } from 'react-bootstrap';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import usePoStore, {selectPo, selectFetchPo, selectPoReady, selectFalsePo} from '../../../store/listPo'; 

    

export const ListPo = () => {
    const navigate = useNavigate();

    const userData = useAuthStore(selectUser);
    const newPo = usePoStore(selectPo);
    const fetchPo = usePoStore(selectFetchPo);
    const poReady = usePoStore(selectPoReady);
    const poFalse = usePoStore(selectFalsePo);
    const [bulan, setBulan] = useState();
    const [jmlKosong, setJmlKosong] = useState(0);
    const [jmlPengajuan, setJmlPengajuan] = useState(0);
    const [jmlRevisi, setJmlRevisi] = useState(0);
    const [jmlVerify, setJmlVerify] = useState(0);
    const [jmlAproval, setJmlAproval] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [listDataPo, setListDataPo] = useState([]);
    const [searchText, setSearchText] = useState("");
    const arrDiv = ['Belum Diajukan', 'Pengajuan', 'Revisi', 'Verifikasi', 'Approved'];
    
    useEffect(() => {
        // setIsLoading(true);
        if (!poReady) return;
        onGridReady()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [poReady]);

    useEffect(() => { 
        setIsLoading(true);
        poFalse();
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        let bb = String(month).padStart(2, '0');
        setBulan(`${year}-${bb}`);
        fetchPo(`${year}-${bb}`);
        setListDataPo([]);
        setJmlKosong(0);
        setJmlPengajuan(0);
        setJmlRevisi(0);
        setJmlVerify(0);
        setJmlAproval(0)
        
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onGridReady = () =>{
        // setDataReady(true)
        let modifiedArr = newPo.map(function(element){
            let status = ""
            if(element.status === ""){
                status = "Belum Diajukan"
            }
            else{
                status = element.status
            }
            return { po: element.id_po, tglpo: element.tgl_po, tglkirim: element.tgl_kirim, status: status, provider: element.dataPO[0].provider, dataPO: element.dataPO.length };
        });
        setListDataPo(modifiedArr)
        const jumKosong = newPo.filter(x => x.status.toUpperCase() === "");  
        const jumPengajuan = newPo.filter(x => x.status.toUpperCase() === "PENGAJUAN");  
        const jumRevisi = newPo.filter(x => x.status.toUpperCase() === "REVISI");       
        const jumVerify = newPo.filter(x => x.status.toUpperCase() === "VERIFIKASI");    
        const jumSelesai = newPo.filter(x => x.status.toUpperCase() === "APPROVED");
        
        setJmlKosong(jumKosong.length);
        setJmlPengajuan(jumPengajuan.length);
        setJmlRevisi(jumRevisi.length);
        setJmlVerify(jumVerify.length);
        setJmlAproval(jumSelesai.length)
        setIsLoading(false);
    }

    const onSetDate =async (event) => {
        setIsLoading(true)
        poFalse();
        setBulan(event.target.value);
        await fetchPo(event.target.value);
        
    }

    const handleChange = (e) => {
        setSearchText(e);
        filterData(e);
    }

    const filterData = (value) => {
        const lowercasedValue = value.toLowerCase().trim();
        if (lowercasedValue === "") onGridReady();
        else {
            let test = listDataPo.filter(o => Object.keys(o).some(k => String(o[k]).toLowerCase().includes(lowercasedValue)));
            setListDataPo(test)
        }
    }

    const handleChanges = (e) =>{
        const lowercasedValue = e.toLowerCase().trim();
        let modifiedArr = newPo.map(function(element){
            let status = ""
            if(element.status === ""){
                status = "Belum Diajukan"
            }
            else{
                status = element.status
            }
            return { po: element.id_po, tglpo: element.tgl_po, tglkirim: element.tgl_kirim, status: status, provider: element.dataPO[0].provider, dataPO: element.dataPO.length };
        });

        let test = modifiedArr.filter(o => Object.keys(o).some(k => String(o[k]).toLowerCase().includes(lowercasedValue)));
        setListDataPo(test)

    }

    const handleSubmit = (e) =>{
        const data = newPo.filter(x => x.id_po.toUpperCase() === e.toUpperCase()); 
        navigate(`/main/${userData.user_divisi}/Purchasing/Data`,{state:{
            data : data
          }});
    }
    const backhome = (e) =>{
        navigate(e);
    }
  return (
    <>
    <div className='orderpurchase'>
        <Stack direction="horizontal" gap={3} style={{padding: "0px 10px 0px 10px"}}>
            <div className="bg-light">
                <Breadcrumb className="bg-light m-2">
                    <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                    <Breadcrumb.Item active>ListPO</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="ms-auto">
                <form className='search'>
                    <input
                        type="text"
                        id="filter-text-box"
                        className='search__input'
                        placeholder="Search..."
                        value={searchText}
                        onChange={e => handleChange(e.target.value)}
                        // onInput={onFilterTextBoxChanged}
                    />
                    <button type='button' className='search__btn'>
                        <i className="bi bi-search"></i>
                    </button>
                </form>
            </div>
            <div className="vr" />
            <div className="bg-light">
                <Form.Control
                    type="month"
                    className='text-center border border-primary text-primary'
                    value={bulan}
                    min="2020-08"
                    onChange={(e) =>onSetDate(e)}
                />
            </div>
        </Stack>

        <div className="row mb-1 mt-1" style={{padding: "0px 10px 0px 10px"}}>
            <div className="col-md-3">
                <Card className='mb-1'>
                    <div className="radius-10 border-start border-0 border-3 border-warning">
                        <Card.Body style={{height: "50px", padding: '8px'}}>
                            <Stack direction="horizontal" gap={3}>
                                <div>
                                    <h6 onClick={(e) => handleChange("")} className="nmTeks">Total PO ({newPo.length})</h6>
                                </div>
                                <div className="bg-light ms-auto">
                                    <DropdownButton id="dropdown-basic-button" variant="outline-warning" size='sm'>
                                        {arrDiv.map((x, i) => {
                                            // 'Belum Diajukan', 'Pengajuan', 'Revisi', 'Verifikasi', 'Aproval'
                                            let index = arrDiv[i].toString();
                                            let index1 = 0;
                                            let index2 = '';
                                            switch (index) {
                                                case "Belum Diajukan":
                                                    index1 = jmlKosong;
                                                break;
                                                case "Verifikasi":
                                                    index1 = jmlVerify;
                                                break;
                                                case "Pengajuan":
                                                    index1 = jmlPengajuan;
                                                break;
                                                case "Revisi":
                                                    index1 = jmlRevisi;
                                                break;
                                                case "Approved":
                                                    index1 = jmlAproval;
                                                break;
                                                default:
                                                    index1 = 0;
                                              }
                                            
                                            
                                            index2 = `${index} (${index1})`
                                            
                                            return(
                                                <Dropdown.Item onClick={(e)=> handleChanges(index)}>{index2}</Dropdown.Item>
                                            )
                                            
                                        })}
                                    </DropdownButton>
                                </div>
                            </Stack>
                        </Card.Body>
                    </div>
                </Card>
            </div>
        </div>

        <div className='pengadaan-item-create'>
            <Row xs={1} md={4} className="g-4">
                {listDataPo.map((card, i) => {
                    let tglPo = card.tglpo.split("-");
                    let tglKrm = card.tglkirim.split("-");
                    const poTgl = `${tglPo[2]}-${tglPo[1]}-${tglPo[0]}`;
                    const krmTgl = `${tglKrm[2]}-${tglKrm[1]}-${tglKrm[0]}`;
                    let warna = "text-center bg-danger text-white";
                    let cct = "#800000";
                    let bgc = "#d07979a7";
                    let bete = "btn btn-danger";
                    switch (card.status) {
                        case "Approved":
                            warna = "text-center bg-primary text-white";
                            cct = "#120cce";
                            bgc = "#120cce60";
                            bete = "btn btn-primary btn-sm";
                          break;
                        case "Verifikasi":
                            warna = "text-center bg-success text-white";
                            cct = "#008011";
                            bgc = "#38cc4c73";
                            bete = "btn btn-success btn-sm";
                          break;
                          case "Pengajuan":
                              warna = "text-center bg-warning text-white";
                              cct = "#918413";
                              bgc = "#e7d32260";
                              bete = "btn btn-warning btn-sm";
                            break;
                        default:
                            warna = "text-center bg-danger text-white";
                            cct = "#800000";
                            bgc = "#d07979a7";
                            bete = "btn btn-danger btn-sm";
                    }
                    return(
                        <Col>
                            <Card>
                                <Card.Header className={warna}>{card.po}</Card.Header>
                                <ListGroup as="ol">
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">Tanggal PO</div>
                                            {poTgl}
                                        </div>
                                        <Badge bg="primary" pill>
                                            {card.dataPO}
                                        </Badge>
                                    </ListGroup.Item>
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">Tanggal Kirim</div>
                                            {krmTgl}
                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <h6 className=" text-truncate">
                                            {card.provider}
                                        </h6>
                                    </ListGroup.Item>
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                            <div style={{color: cct, backgroundColor: bgc, borderRadius: '8px', padding: '5px', lineHeight: 2, marginTop: '5px',textAlign: 'center'}}>{card.status}</div>
                                        </div>
                                    </ListGroup.Item>
                                </ListGroup>
                                
                                <div className="d-grid gap-2 d-md-flex justify-content-md-end p-1">
                                    <Button type="submit" className={bete} onClick={()=>handleSubmit(card.po)}>
                                        CEK PO <i className="bi bi-arrow-right"></i>
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    )
                })}
            </Row>
        </div>

    </div>

    
    {isLoading ? <LoadingPage /> : ""}
    </>
  )
}
