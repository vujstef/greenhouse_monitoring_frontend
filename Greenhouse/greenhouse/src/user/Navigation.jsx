import React from 'react';
import { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from 'mdb-react-ui-kit';
import myLogoIcon from '../images/icon_greenhouse.png';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGreenhouseDataContext } from '../store/greenhouseStore';
import Status401 from '../status/Status401';

const Navigation = () => {
  const [showBasic, setShowBasic] = useState(false);
  const navigate = useNavigate();
  const { setGreenhouseData } = useGreenhouseDataContext();
  const [showStatus401, setShowStatus401] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post('/Greenhouse/logout', null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: 'application/json'
        }
      });
      localStorage.removeItem('token');
      localStorage.removeItem('roleId');
      localStorage.removeItem('id');
      setGreenhouseData(null);
      toast.success("Uspješno ste se odjavili.", { autoClose: 1500 })
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      toast.error("Nesupješna odjava.");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowStatus401(true);
    } else {
      navigate('/home');
    }
  }, []);

  const isAdmin = localStorage.getItem('roleId') === '1';

  const id = localStorage.getItem('id')

  const handleEditUser = () => {
    navigate(`/home/updateUserData/${id}`);
  }

  if (showStatus401) {
    return <Status401 status={401} />;
  }

  return (
    <>
      <MDBNavbar expand='lg' light bgColor='light'>
        <MDBContainer fluid>
          <MDBNavbarLink href='/home' className='navbar-brand'>
            <img
              src={myLogoIcon}
              alt="Slika"
            />
          </MDBNavbarLink>

          <MDBNavbarToggler
            aria-controls='navbarSupportedContent'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setShowBasic(!showBasic)}
          >
            <MDBIcon icon='bars' fas />
          </MDBNavbarToggler>

          <MDBCollapse navbar show={showBasic}>
            <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
              <MDBNavbarItem>
                <MDBNavbarLink active aria-current='page' href='/home'>
                  Početna stranica
                </MDBNavbarLink>
              </MDBNavbarItem>

              <MDBNavbarItem>
                <MDBNavbarLink aria-current='page' onClick={handleEditUser}>
                  Ažuriraj profil
                </MDBNavbarLink>
              </MDBNavbarItem>

              {isAdmin && (
                <MDBNavbarItem>
                  <MDBDropdown>
                    <MDBDropdownToggle tag='a' className='nav-link' role='button'>
                      Administracija
                    </MDBDropdownToggle>
                    <MDBDropdownMenu>
                      <MDBDropdownItem>
                        <MDBNavbarLink href='/home/admin/getAllUser'>Prikaži sve korisnike</MDBNavbarLink>
                      </MDBDropdownItem>
                    </MDBDropdownMenu>
                  </MDBDropdown>
                </MDBNavbarItem>
              )}
            </MDBNavbarNav>

            <ToastContainer></ToastContainer>

            <MDBNavbarNav className='justify-content-end'>
              <MDBNavbarItem>
                <MDBBtn color='danger' onClick={handleLogout}>Odjava</MDBBtn>
              </MDBNavbarItem>
            </MDBNavbarNav>

          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar >
    </>
  )
}

export default Navigation