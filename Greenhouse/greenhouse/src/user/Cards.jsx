import React, { useEffect, useState } from 'react';
import {
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardImage,
    MDBBtn,
    MDBRipple,
    MDBContainer,
    MDBCardText,
    MDBModal,
    MDBModalHeader,
    MDBModalBody,
    MDBModalFooter,
    MDBModalDialog,
    MDBModalContent,
    MDBIcon,
    MDBTooltip
} from 'mdb-react-ui-kit';
import myLogoIcon from '../images/plastenik.png';
import image from '../images/slika.png';
import { useGreenhouseDataContext } from '../store/greenhouseStore';
import axiosInstance from '../api/axiosInstance';
import { useAuthenticationContext } from '../store/authenticationContext';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Status401 from '../status/Status401';
import measure from '../images/measurement.png';
import command from '../images/command.png';
import thingspeak from '../images/thingspeak.png'
import settings from '../images/settings.png'
import control from '../images/control.png'

const Cards = () => {
    const { greenhouseData, setGreenhouseData } = useGreenhouseDataContext();
    const { checkRole } = useAuthenticationContext();
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [greenhouseToDelete, setGreenhouseToDelete] = useState(null);
    const navigate = useNavigate();
    const [showStatus401, setShowStatus401] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setShowStatus401(true);
        } else {
            navigate('/home');
        }
    }, []);

    const getGreenhouses = async () => {
        if (checkRole(localStorage.getItem("roleId")) === 'user') {
            const responseData = await axiosInstance.get('/Greenhouse/greenhouses', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            setGreenhouseData(responseData.data.greenhouses);
        } else {
            const responseData = await axiosInstance.get('/Greenhouse/admin/createdGreenhouses', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            setGreenhouseData(responseData.data.greenhouses);
        }
    }

    useEffect(() => {
        getGreenhouses();
    }, [])

    const confirmDeleteGreenhouse = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.delete(`Greenhouse/admin/deleteGreenhouse/${greenhouseToDelete}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setGreenhouseData(greenhouseData.filter((x) => x.id !== greenhouseToDelete));
            toast.success('Plastenik je uspješno obrisan.', { autoClose: 1500 });
            setShowConfirmationModal(false);
            setGreenhouseToDelete(null);
        } catch (error) {
            toast.error('Došlo je do greške. Pokušajte ponovo.');
            setShowConfirmationModal(false);
            setGreenhouseToDelete(null);
        }
    }

    if (showStatus401) {
        return <Status401 status={401} />;
    }

    const handleDeleteGreenhouse = async (id) => {
        setShowConfirmationModal((prevShowConfirmationModal) => !prevShowConfirmationModal);
        setGreenhouseToDelete(id);
    };

    const cancelDeleteGreenhouse = () => {
        setShowConfirmationModal(false);
        setGreenhouseToDelete(null);
    };

    const handleEditGreenhouse = (id) => {
        navigate(`/home/admin/updateGreenhouse/${id}`);
    }

    const handleAssignMeasurementAndStatus = (id) => {
        navigate(`/home/admin/assignMeasurementAndStatuses/${id}`);
    }

    const handleAssignConfigurationAndManagementCommand = (id) => {
        navigate(`/home/admin/assignConfigurationAndManagementCommand/${id}`);
    }

    const handleAssignThingSpeak = (id) => {
        navigate(`/home/admin/assignThingspeakData/${id}`);
    }

    const handleDisplayMeasurementAndStatus = (id) => {
        navigate(`/home/getDisplayedMeasurementStatuses/${id}`);
    }

    const handleManageGreenhouseConfiguration = (id) => {
        navigate(`/home/manageGreenhouseConfiguration/${id}`);
    }

    const handleManageGreenhouseManagement = (id) => {
        navigate(`/home/manageGreenhouseManagement/${id}`);
    }

    const isAdmin = localStorage.getItem('roleId') === '1';

    return (
        <>
            <ToastContainer></ToastContainer>
            <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image' style={{ backgroundImage: `url(${image})` }}>
                <div className='mask gradient-custom-3'></div>
                <MDBRow className='row-cols-1 row-cols-md-2 row-cols-lg-3 g-4' style={{ paddingBottom: '40px', paddingTop: '40px' }}>
                    {greenhouseData?.map((x) => (
                        <MDBCol key={x.id}>
                            <MDBCard fluid='true'>
                                <MDBRipple rippleColor='light' rippleTag='div' className='bg-image hover-overlay'>
                                    <MDBCardImage src={myLogoIcon} fluid alt='...' style={{ width: 'auto', height: 'auto' }} />
                                    <a>
                                        <div className='mask' style={{ backgroundColor: 'rgba(143, 211, 244, 0.5)' }}></div>
                                    </a>
                                </MDBRipple>
                                <MDBCardBody>
                                    <MDBCardTitle className="d-flex justify-content-between align-items-center">
                                        <div>{x.name}</div>
                                        {isAdmin && (
                                            <div className="d-flex">
                                                <MDBTooltip wrapperProps={{ color: 'transparent' }} title='Ažuriraj plastenik'>
                                                    <MDBBtn className="mt-4 mb-4 mr-4" size="sg" color="warning" onClick={() => handleEditGreenhouse(x.id)}>
                                                        <MDBIcon far icon="edit" className="fa-lg" />
                                                    </MDBBtn>
                                                </MDBTooltip>
                                                <MDBTooltip wrapperProps={{ color: 'transparent' }} title='Obriši plastenik'>
                                                    <MDBBtn className="mt-4 mb-4" size="sg" color="danger" onClick={() => handleDeleteGreenhouse(x.id)}>
                                                        <MDBIcon icon="trash-alt" className="fa-lg" />
                                                    </MDBBtn>
                                                </MDBTooltip>
                                            </div>
                                        )}
                                    </MDBCardTitle>

                                    <MDBCardText>
                                        <p>Opis: {x.description}</p>
                                    </MDBCardText>
                                    {isAdmin && (
                                        <>
                                            <MDBRow fluid='true' className='row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-between' style={{ margin: '12px' }}>
                                                <MDBCol size='4'>
                                                    <MDBTooltip wrapperProps={{ color: 'transparent' }} title='Dodijeli mjerenja i statuse plastenika' >
                                                        <MDBBtn className='mt-4 mb-4 w-100' size='lg' color='success' onClick={() => handleAssignMeasurementAndStatus(x.id)} fluid='true'>
                                                            <img src={measure} style={{ height: '25px', width: '25px' }} />
                                                        </MDBBtn>
                                                    </MDBTooltip>
                                                </MDBCol>
                                                <MDBCol size='4'>
                                                    <MDBTooltip wrapperProps={{ color: 'transparent' }} title='Dodijeli konfiguracione i upravljačke komande'>
                                                        <MDBBtn className='mt-4 mb-4 w-100' size='lg' color='success' onClick={() => handleAssignConfigurationAndManagementCommand(x.id)} fluid='true'>
                                                            <img src={command} style={{ height: '25px', width: '25px' }} />
                                                        </MDBBtn>
                                                    </MDBTooltip>
                                                </MDBCol>
                                                <MDBCol size='4'>
                                                    <MDBTooltip wrapperProps={{ color: 'transparent' }} title='Dodijeli Thingspeak parametre'>
                                                        <MDBBtn className='mt-4 mb-4 w-100' size='lg' color='success' onClick={() => handleAssignThingSpeak(x.id)} fluid='true'>
                                                            <img src={thingspeak} style={{ height: '25px', width: '25px' }} />
                                                        </MDBBtn>
                                                    </MDBTooltip>
                                                </MDBCol>
                                            </MDBRow>
                                        </>

                                    )}
                                    <>
                                        <MDBRow fluid='true' className='row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-between' style={{ margin: '12px' }}>
                                            <MDBCol size='4'>
                                                <MDBTooltip wrapperProps={{ color: 'transparent' }} title='Mjerenja i statusi plastenika' >
                                                    <MDBBtn className='mt-4 mb-4 w-100' size='lg' color='secondary' onClick={() => handleDisplayMeasurementAndStatus(x.id)} fluid='true'>
                                                        <img src={measure} style={{ height: '25px', width: '25px' }} />
                                                    </MDBBtn>
                                                </MDBTooltip>
                                            </MDBCol>
                                            <MDBCol size='4'>
                                                <MDBTooltip wrapperProps={{ color: 'transparent' }} title='Konfiguriši plastenik'>
                                                    <MDBBtn className='mt-4 mb-4 w-100' size='lg' color='secondary' onClick={() => handleManageGreenhouseConfiguration(x.id)} fluid='true'>
                                                        <img src={settings} style={{ height: '25px', width: '25px' }} />
                                                    </MDBBtn>
                                                </MDBTooltip>
                                            </MDBCol>
                                            <MDBCol size='4'>
                                                <MDBTooltip wrapperProps={{ color: 'transparent' }} title='Upravljanje plastenikom'>
                                                    <MDBBtn className='mt-4 mb-4 w-100' size='lg' color='secondary' fluid='true' onClick={() => handleManageGreenhouseManagement(x.id)}>
                                                        <img src={control} style={{ height: '25px', width: '25px' }} />
                                                    </MDBBtn>
                                                </MDBTooltip>
                                            </MDBCol>
                                        </MDBRow>
                                    </>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    ))}
                </MDBRow>
            </MDBContainer>

            <MDBModal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)} tabIndex='-1'>
                <MDBModalDialog onClick={() => {
                    setShowConfirmationModal(false);
                    setGreenhouseToDelete(null);
                }}>
                    <MDBModalContent>
                        <MDBModalHeader>Potvrda brisanja plastenika
                            <MDBBtn className='btn-close' color='none' onClick={handleDeleteGreenhouse}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <p>Da li ste sigurni da želite da obrišete plastenik?</p>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="danger" onClick={confirmDeleteGreenhouse}>
                                <MDBIcon icon="trash" className="me-2" />
                                Obriši
                            </MDBBtn>
                            <MDBBtn color="secondary" onClick={cancelDeleteGreenhouse}>
                                <MDBIcon icon="times" className="me-2" />
                                Otkaži
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </>
    );
};

export default Cards;