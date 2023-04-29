import React, { useState,useEffect } from 'react';
import './portofolio.css';
// import { LoadingPage } from '../LoadingPage/LoadingPage';
import {Navbar,Container,Nav, Modal} from 'react-bootstrap';

import icon from '../assets/img/logoDagsap.png';
import { Home } from './Home';
import { Visi } from './Visi';
import { Misi } from './Misi';
import { Brand } from './Brand';
import { Contact } from './Contact';
import { Footer } from './Footer';

const ID_REGEX = /^[a-zA-Z0-9]{3,16}$/

export const Beranda = ({setAuth}) => {
    const [show, setShow] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [scrolled, seSrcolled] = useState(false);
    const [activeLink, setActiveLink] = useState('home');

    const [idkar,setidkar] = useState('');
    const [pwd, setPwd] = useState('');
    const [validId, setValidId] = useState(false);

    const [idReg, setIdReg] = useState('');
    const [validIdReg, setValidIdReg] = useState(false);

    const [pwdReg, setPwdReg] = useState('');

    const [matchPwd, setMatchPwd] = useState('');

    // const onAuth = useAuthStore(selectOnAuth);
    // const authReady = useAuthStore(selectAuthReady);
    // const fetchMaterial = useMaterialStore(selectFetchMaterial);
    // const materialReady = useMaterialStore(selectMaterialReady);
    // const fetchProvider = useProviderStore(selectFetchProvider);
    // const providerReady = useProviderStore(selectProviderReady);
    
    const onUpdateActiveLink = (e) =>{
        setActiveLink(e);
    }

    const btnSignin = (e) =>{
        e.preventDefault();
        setidkar('');
        setPwd('');
        setIdReg('');
        setPwdReg('');
        document.querySelector('.is-form').classList.remove('active');
        document.querySelector('.box-log').classList.remove('active');
    
    }
    
    const btnSignUp = (e) =>{
        e.preventDefault();
        setidkar('');
        setPwd('');
        setIdReg('');
        setPwdReg('');
        setMatchPwd('');
        document.querySelector('.is-form').classList.add('active');
        document.querySelector('.box-log').classList.add('active');
    }

    /* const onSubmitForm = async (e) =>{
        e.preventDefault()
        const v1 = ID_REGEX.test(idkar);
        const v2 = pwd;
        if(!v1 || !v2){
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Entry',
                showClass: {
                  popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOutUp'
                }
              })
            return;
        }
        try {
            setIsLoading(true);

            const response = await axios.post('http://localhost:8081/dpanel/authLog',{
                "idKar" : idkar,
                "pwd" : pwd
            });

            const parseRes = response.data;
            await onAuth(`${parseRes.token}`)
            localStorage.clear();

            if(parseRes.token){
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);

                if (authReady) {
                    setAuth(true);
                }
                
                localStorage.setItem("token", parseRes.token); 
            }
            else{
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
                setAuth(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: parseRes.message
                })
            }
        } 
        catch (error) {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Password dan id karyawan salah"
            });
        }
    } */

    const myFunction = (e) => {
        var x = document.getElementById("myInput");
        if(e.target.checked){
            x.type = "text";
        }
        else{
            x.type = "password";
        }
        
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
    }

    const lookPass = (e) => {
        var x = document.getElementById("passAw");
        var y = document.getElementById("passAny");
        if(e.target.checked){
            x.type = "text";
            y.type = "text";
        }
        else{
            x.type = "password";
            y.type = "password";
        }
    }

   /*  useEffect(() =>{
         fetchMaterial();
         // eslint-disable-next-line react-hooks/exhaustive-deps
      },[]);

    useEffect(() => {
        if (!materialReady) return;
    }, [materialReady]);

    useEffect(() =>{
        fetchProvider();
        // eslint-disable-next-line react-hooks/exhaustive-deps
     },[]);

   useEffect(() => {
       if (!providerReady) return;
   }, [providerReady]); */

    useEffect(()=>{
        const onScroll = () =>{
            if(window.scrollY > 50){
              seSrcolled(true);
            }
            else{
                seSrcolled(false);
            }
      }

      window.addEventListener("scroll", onScroll);

      return() => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const result = ID_REGEX.test(idkar);
        setValidId(result)
    }, [idkar]);
    
    useEffect(() =>{
    },[idkar,pwd]);

    useEffect(() => {
    const result = ID_REGEX.test(idReg);
    setValidIdReg(result)
    }, [idReg]);

    useEffect(() =>{
    },[idReg,pwdReg,matchPwd]);


    
  return (
    <>
    <Navbar expand="lg" className={scrolled ? "scrolled": ""}>
      <Container>
        <Navbar.Brand href="#home">
            <img
              src={icon}
              width="35"
              height="35"
              alt="Logo Dagsap"
            />
            &nbsp;
            <span className='logText'>PT. Dagsap Endura Eatore</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={()=> onUpdateActiveLink('home')}>Home</Nav.Link>
            <Nav.Link href="#visi" className={activeLink === 'visi' ? 'active navbar-link' : 'navbar-link'} onClick={()=> onUpdateActiveLink('visi')}>Visi</Nav.Link>
            <Nav.Link href="#misi" className={activeLink === 'misi' ? 'active navbar-link' : 'navbar-link'} onClick={()=> onUpdateActiveLink('misi')}>Misi</Nav.Link>
            <Nav.Link href="#barnd" className={activeLink === 'barnd' ? 'active navbar-link' : 'navbar-link'} onClick={()=> onUpdateActiveLink('barnd')}>Brand</Nav.Link>
            <Nav.Link href="#contact" className={activeLink === 'contact' ? 'active navbar-link' : 'navbar-link'} onClick={()=> onUpdateActiveLink('contact')}>Contact</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link>
                <span className='logins' onClick={handleShow}>
                <i className="bi bi-box-arrow-in-right"></i>
                &nbsp;
                Login
                </span>
            </Nav.Link>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <Modal show={show} onHide={handleClose} animation={false}>
        <div className="box-log">
            <div className="cont-box">
                <div className="aw-box">
                    <div className="bosx signin">
                        <h1>Login Account</h1>
                        <button  className="bSignin" onClick={(e)=>btnSignin(e)}>Sign in</button>
                    </div>
                    <div className="bosx signup">
                        <h1>Forgot Password</h1>
                        <button className="bSignUp" onClick={(e)=>btnSignUp(e)}>Change Password</button>
                    </div>
                </div>
                <div className="is-form">
                        <span onClick={handleClose} className="close-button"><i className="bi bi-x-circle-fill"></i></span>
                        <div className="form FormSignin">
                            <form onSubmit={"onSubmitForm"}>
                                <h3>Sign In</h3>
                                <input 
                                    type="text" 
                                    placeholder="id karyaawan"
                                    name="idkar"
                                    onChange={(e) => setidkar(e.target.value)}
                                    value={idkar}
                                />
                                <label htmlFor='idkaryawan'>
                                    <span className={validId ? "valid" : "hide"}>
                                        
                                    </span>
                                    <span className={validId || !idkar ? "hide" : "invalid"}>
                                        Harap Cek Ulang Id Karyawan Pastikan Tanpa Spasi *
                                    </span>
                                </label>
                                <br />
                                <input
                                    type="password"
                                    placeholder="password"
                                    name="password"
                                    id="myInput"
                                    onChange={(e) => setPwd(e.target.value)}
                                    value={pwd}
                                />

                                <br />
                                <div className="coba"  style={{display:"flex", fontSize: "0.6em"}}>
                                    <input type="checkbox" style={{display:"flex",left: 0, width: "15px"}} onChange={(e) =>myFunction(e)} />
                                    <label htmlFor="vehicle3" style={{color: '#000000', marginLeft: '5px'}}>Show Password</label>
                                </div>
                                <br />
                                <button className='btn btn-success btn-block' disabled={!setValidId || !pwd ? true : false}>
                                Login
                                </button>
                            </form>
                            
                        </div>

                        <div className="form FormSignup">
                            <form onSubmit={handleSubmit}>
                                <h3>Change Password</h3>
                                <input 
                                    type="text"
                                    placeholder="ID Karyawan"
                                    name="username"
                                    onChange={(e) => setIdReg(e.target.value)}
                                    value={idReg}
                                />
                                <label htmlFor='lblkaryawan'>
                                    <span className={validIdReg ? "valid" : "hide"}>
                                        
                                    </span>
                                    <span className={validIdReg || !idReg ? "hide" : "invalid"}>
                                        Harap Cek Ulang Id Karyawan Pastikan Tanpa Spasi *
                                    </span>
                                </label>

                                <br />
                                <input type="password"
                                    placeholder="password"
                                    id="passAw"
                                    name="password"
                                    onChange={(e) => setPwdReg(e.target.value)}
                                    value={pwdReg}
                                />

                                <br />
                                <input 
                                    type="password"
                                    placeholder="Confirm Password"
                                    id="passAny"
                                    name="newpassword"
                                    onChange={(e) => setMatchPwd(e.target.value)}
                                    value={matchPwd}
                                />
                                

                                <br />
                                <div className="coba" style={{display:"flex", fontSize: "0.6em"}}>
                                    <input type="checkbox" style={{left: "0",display: "flex",width: "15px"}} onChange={(e) => lookPass(e)}/>
                                    <label htmlFor="vehicle3" style={{color: "#000000",marginLeft: "5px"}}>Show Password</label>
                                </div>

                                <br />
                                <button className='btn btn-success btn-block' disabled={!idReg || !pwdReg || !matchPwd ? true : false}>
                                    Simpan
                                </button>
                            </form>
                        </div>

                </div>
            </div>
        </div>
    </Modal>

    <div>
        <Home/>
        <Visi/>
        <Misi/>
        <Brand/>
        <Contact/>
        <Footer/>
    </div>

    {/* isLoading ? <LoadingPage/> : "" */}

    </>
  )
}
