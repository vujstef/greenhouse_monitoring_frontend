import React from 'react'
import Navigation from '../user/Navigation'
import Footer from '../authentication/Footer'
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBRow, MDBCol, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter, MDBModalDialog, MDBModalContent, MDBIcon } from 'mdb-react-ui-kit';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosInstance from '../api/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import image from '../images/slika.png';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Status401 from '../status/Status401';
import Status403 from '../status/Status403';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { useThingspeakValidation } from '../validation/thingspeakValidation';
import { useAuthenticationContext } from '../store/authenticationContext';
import { useGreenhouseDataContext } from '../store/greenhouseStore';

const AssignThingspeak = () => {
    const navigate = useNavigate();
    const [showStatus401, setShowStatus401] = useState(false);
    const { id } = useParams();
    const [showStatus403, setShowStatus403] = useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(useThingspeakValidation()) });
    const { greenhouseData, setGreenhouseData } = useGreenhouseDataContext();
    const { checkRole } = useAuthenticationContext();
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [thingspeakDataToDelete, setthingspeakDataToDelete] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setShowStatus401(true);
        } else {
            handleReadThingspeak();
            navigate(`/home/admin/assignThingspeakData/${id}`);
        }
    }, []);

    useEffect(() => {
        if (errors.channel_id?.message) {
            toast.error(errors.channel_id.message)
        }
        if (errors.read_key?.message) {
            toast.error(errors.read_key.message)
        }
        if (errors.write_key?.message) {
            toast.error(errors.write_key.message)
        }
    }, [errors])

    const handleAssignThingspeak = async (formData) => {
        try {
            if (checkRole(localStorage.getItem('roleId')) === 'admin') {
                const responseData = await axiosInstance.post(`Greenhouse/admin/assignThingspeak/${id}`, formData, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                toast.success("Thingspeak podaci su uspješno dodijeljeni plasteniku.", { autoClose: 1500 })
                setTimeout(() => {
                    navigate('/home');
                }, 2000)
            } else {
                setShowStatus401(true);
                setShowStatus403(true);
            }
        } catch (error) {
            if (error.response) {
                setShowStatus401(true);
                setShowStatus403(true);
            }
            else {
                toast.error("Došlo je do greške. Pokušajte ponovo. ")
            }
        }
    }

    const handleUpdateThingspeak = async (formData) => {
        try {
            if (checkRole(localStorage.getItem('roleId')) === 'admin') {
                const responseData = await axiosInstance.put(`Greenhouse/admin/updateThingspeak/${id}`, formData, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                toast.success("Thingspeak podaci su uspješno ažurirani.", { autoClose: 1500 })
                setTimeout(() => {
                    navigate('/home');
                }, 2000)
            } else {
                setShowStatus401(true);
                setShowStatus403(true);
            }
        } catch (error) {
            if (error.response) {
                setShowStatus401(true);
                setShowStatus403(true);
            }
            else {
                toast.error("Došlo je do greške. Pokušajte ponovo. ")
            }
        }
    }

    const handleReadThingspeak = async () => {
        try {
            if (checkRole(localStorage.getItem('roleId')) === 'admin') {
                const responseData = await axiosInstance.get(`Greenhouse/admin/readThingspeak/${id}`, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setGreenhouseData(responseData.data.data);
            } else {
                setShowStatus401(true);
                setShowStatus403(true);
            }
        } catch (error) {
            if (error.response) {
                setShowStatus401(true);
                setShowStatus403(true);
            }
            else {
                toast.error("Došlo je do greške. Pokušajte ponovo. ")
            }
        }
    }

    const handleDeleteThingspeakData = async (id) => {
        setShowConfirmationModal((prevShowConfirmationModal) => !prevShowConfirmationModal);
        setthingspeakDataToDelete(id);
    };

    const cancelDeleteThingspeakData = () => {
        setShowConfirmationModal(false);
        setthingspeakDataToDelete(null);
    };

    const confirmDeleteThingspeakData = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.delete(`Greenhouse/admin/deleteThingspeak/${thingspeakDataToDelete}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setGreenhouseData(greenhouseData.filter((x) => x.id !== thingspeakDataToDelete));
            toast.success('Thingspeak podaci su uspješno obrisani.', { autoClose: 1500 });
            setShowConfirmationModal(false);
            setthingspeakDataToDelete(null);
        } catch (error) {
            toast.error('Došlo je do greške. Pokušajte ponovo.');
            setShowConfirmationModal(false);
            setthingspeakDataToDelete(null);
        }
    }

    if (showStatus401) {
        return <Status401 status={401} />;
    }

    if (showStatus403) {
        return <Status403 status={403} />;
    }

    if (checkRole(localStorage.getItem('roleId')) !== 'admin') {
        return <Status401 status={401} />;
    }

    const handleNavigate = () => {
        navigate('/home');
    }

    return (
        <>
            <ToastContainer></ToastContainer>
            <Navigation></Navigation>
            <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image' style={{ backgroundImage: `url(${image})` }}>
                <div className='mask gradient-custom-3'></div>
                <MDBBtn className="position-absolute top-0 end-0 mt-3 me-3" onClick={handleNavigate} color='secondary'>Vrati se na početnu</MDBBtn>
                <MDBRow className='g-4' style={{ paddingBottom: '40px', paddingTop: '40px' }}>
                    {greenhouseData?.map((x) => (
                        <MDBCol className='text-center' key={x.id}>
                            <MDBCard className='m-5' fluid='true'>
                                <MDBCardBody className='px-5'>
                                    <h2 className="text-uppercase text-center mb-5">Učitani Thingspeak parametri</h2>
                                    <p>ID kanala: {x.channel_id}</p>
                                    <p>Ključ za čitanje: {x.read_key}</p>
                                    <p>Ključ za upisivanje: {x.write_key}</p>
                                    <MDBBtn className='mt-4 mb-4 w-100' color='danger' size='lg' onClick={() => (handleDeleteThingspeakData(x.id))}>Obriši Thingspeak parametre</MDBBtn>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    ))}
                    <MDBCol className='text-center'>
                        <MDBCard className='m-5' fluid='true'>
                            <MDBCardBody className='px-5'>
                                <h2 className="text-uppercase text-center mb-5">Dodaj Thingspeak parametre</h2>
                                <Controller control={control} name="channel_id" render={({ field: { onChange, onBlur } }) => (
                                    <MDBInput
                                        wrapperClass='mb-4'
                                        label='ID kanala'
                                        size='lg'
                                        type='text'
                                        onChange={onChange}
                                        onBlur={onBlur}
                                    />
                                )} />

                                <Controller control={control} name="read_key" render={({ field: { onChange, onBlur } }) => (
                                    <MDBInput
                                        wrapperClass='mb-4'
                                        label='Ključ za čitanje'
                                        size='lg'
                                        type='text'
                                        onChange={onChange}
                                        onBlur={onBlur}
                                    />
                                )} />

                                <Controller control={control} name="write_key" render={({ field: { onChange, onBlur } }) => (
                                    <MDBInput
                                        wrapperClass='mb-4'
                                        label='Ključ za upisivanje'
                                        size='lg'
                                        type='text'
                                        onChange={onChange}
                                        onBlur={onBlur}
                                    />
                                )} />

                                <MDBBtn className='mt-4 mb-4 w-100 gradient-custom-4' size='lg' onClick={handleSubmit(handleAssignThingspeak)}>Dodaj</MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>

                    <MDBCol className='text-center'>
                        <MDBCard className='m-5' fluid='true'>
                            <MDBCardBody className='px-5'>
                                <h2 className="text-uppercase text-center mb-5">Ažuriraj Thingspeak parametre</h2>
                                <Controller control={control} name="channel_id" render={({ field: { onChange, onBlur } }) => (
                                    <MDBInput
                                        wrapperClass='mb-4'
                                        label='ID kanala'
                                        size='lg'
                                        type='text'
                                        onChange={onChange}
                                        onBlur={onBlur}
                                    />
                                )} />

                                <Controller control={control} name="read_key" render={({ field: { onChange, onBlur } }) => (
                                    <MDBInput
                                        wrapperClass='mb-4'
                                        label='Ključ za čitanje'
                                        size='lg'
                                        type='text'
                                        onChange={onChange}
                                        onBlur={onBlur}
                                    />
                                )} />

                                <Controller control={control} name="write_key" render={({ field: { onChange, onBlur } }) => (
                                    <MDBInput
                                        wrapperClass='mb-4'
                                        label='Ključ za upisivanje'
                                        size='lg'
                                        type='text'
                                        onChange={onChange}
                                        onBlur={onBlur}
                                    />
                                )} />

                                <MDBBtn className='mt-4 mb-4 w-100 gradient-custom-4' size='lg' onClick={handleSubmit(handleUpdateThingspeak)}>Ažuriraj</MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow >
            </MDBContainer >
            <Footer></Footer>

            <MDBModal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)} tabIndex='-1'>
                <MDBModalDialog onClick={() => {
                    setShowConfirmationModal(false);
                    setthingspeakDataToDelete(null);
                }}>
                    <MDBModalContent>
                        <MDBModalHeader>Potvrda brisanja plastenika
                            <MDBBtn className='btn-close' color='none' onClick={handleDeleteThingspeakData}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <p>Da li ste sigurni da želite da obrišete plastenik?</p>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="danger" onClick={confirmDeleteThingspeakData}>
                                <MDBIcon icon="trash" className="me-2" />
                                Obriši
                            </MDBBtn>
                            <MDBBtn color="secondary" onClick={cancelDeleteThingspeakData}>
                                <MDBIcon icon="times" className="me-2" />
                                Otkaži
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </>
    )
}

export default AssignThingspeak