import React, { useEffect, useState } from 'react';
import Navigation from '../user/Navigation';
import Footer from '../authentication/Footer';
import image from '../images/slika.png';
import {
    MDBIcon, MDBBtn, MDBTable, MDBTableBody, MDBTableHead, MDBContainer, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter, MDBModalDialog, MDBModalContent, MDBTooltip
} from 'mdb-react-ui-kit';
import { useGreenhouseDataContext } from '../store/greenhouseStore';
import { useAuthenticationContext } from '../store/authenticationContext';
import axiosInstance from '../api/axiosInstance';
import Status401 from '../status/Status401';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import user from '../images/user.png'

const AllUser = () => {
    const { greenhouseData, setGreenhouseData } = useGreenhouseDataContext();
    const { checkRole } = useAuthenticationContext();
    const [showStatus401, setShowStatus401] = useState(false);
    const navigate = useNavigate();
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setShowStatus401(true);
        } else {
            navigate('/home/admin/getAllUser');
        }
    }, []);

    const getUsers = async () => {
        if (checkRole(localStorage.getItem('roleId')) === 'admin') {
            const responseData = await axiosInstance.get('Greenhouse/admin/users', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setGreenhouseData(responseData.data.users);
        } else {
            setShowStatus401(true);
        }
    };

    const handleDeleteUser = async (id) => {
        setShowConfirmationModal((prevShowConfirmationModal) => !prevShowConfirmationModal);
        setUserToDelete(id);
    };

    const confirmDeleteUser = async (event) => {
        event.preventDefault();
        try {
            const response = await axiosInstance.delete(`Greenhouse/admin/deleteUser/${userToDelete}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setGreenhouseData(greenhouseData.filter((x) => x.id !== userToDelete));
            toast.success('Korisnik je uspješno obrisan.', { autoClose: 1500 });
            setShowConfirmationModal(false);
            setUserToDelete(null);
        } catch (error) {
            toast.error('Došlo je do greške. Pokušajte ponovo.');
            setShowConfirmationModal(false);
            setUserToDelete(null);
        }
    };

    const cancelDeleteUser = () => {
        setShowConfirmationModal(false);
        setUserToDelete(null);
    };

    useEffect(() => {
        getUsers();
    }, []);

    if (showStatus401) {
        return <Status401 status={401} />;
    }

    const handleEditUser = (id) => {
        navigate(`/home/admin/updateUser/${id}`);
    }

    const handleAddGreenhouse = (id) => {
        navigate(`/home/admin/addGreenhouse/${id}`);
    }

    return (
        <>
            <ToastContainer></ToastContainer>
            <Navigation></Navigation>
            <MDBContainer fluid className="d-flex align-items-center justify-content-center bg-image" style={{ backgroundImage: `url(${image})` }}>
                <div className="mask gradient-custom-3"></div>
                <MDBTable align='middle' responsive style={{ backgroundColor: '#8fd3f480', maxWidth: '100%' }}>
                    <MDBTableHead style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'black' }}>
                        <tr>
                            <th scope='col'>Korisnici</th>
                            <th scope='col'></th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody style={{ color: 'black' }}>
                        {greenhouseData?.map((x) => (
                            <tr key={x.id}>
                                <td>
                                    <div className='d-flex align-items-center'>
                                        <img
                                            src={user}
                                            alt=''
                                            style={{ width: '45px', height: '45px' }}
                                            className='rounded-circle'
                                        />
                                        <div className='ms-3'>
                                            <p className='fw-bold mb-1'>{x.first_name} {x.last_name}</p>
                                            <p className=' mb-0'>{x.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex">
                                        <MDBTooltip wrapperProps={{ color: 'transparent' }} title='Dodijeli plastenik'>
                                            <MDBBtn className="me-2 smaller-btn" size="sm" color="success" onClick={() => handleAddGreenhouse(x.id)}>
                                                <MDBIcon fas icon="plus-circle" className="fa-lg" />
                                            </MDBBtn>
                                        </MDBTooltip>
                                        <MDBTooltip wrapperProps={{ color: 'transparent' }} title='Ažuriraj korisnika'>
                                            <MDBBtn className="me-2 smaller-btn" size="sm" color="warning" onClick={() => handleEditUser(x.id)}>
                                                <MDBIcon far icon="edit" className="fa-lg" />
                                            </MDBBtn>
                                        </MDBTooltip>
                                        <MDBTooltip wrapperProps={{ color: 'transparent' }} title='Obriši korisnika'>
                                            <MDBBtn className="me-2 smaller-btn" size="sm" color="danger" onClick={() => handleDeleteUser(x.id)}>
                                                <MDBIcon icon="trash-alt" className="fa-lg" />
                                            </MDBBtn>
                                        </MDBTooltip>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
            </MDBContainer>

            <MDBModal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)} tabIndex='-1'>
                <MDBModalDialog onClick={() => {
                    setShowConfirmationModal(false);
                    setUserToDelete(null);
                }}>
                    <MDBModalContent>
                        <MDBModalHeader>Potvrda brisanja korisnika
                            <MDBBtn className='btn-close' color='none' onClick={handleDeleteUser}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <p>Da li ste sigurni da želite da obrišete korisnika?</p>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="danger" onClick={confirmDeleteUser}>
                                <MDBIcon icon="trash" className="me-2" />
                                Obriši
                            </MDBBtn>
                            <MDBBtn color="secondary" onClick={cancelDeleteUser}>
                                <MDBIcon icon="times" className="me-2" />
                                Otkaži
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>

            <Footer></Footer>
        </>
    );
};

export default AllUser;