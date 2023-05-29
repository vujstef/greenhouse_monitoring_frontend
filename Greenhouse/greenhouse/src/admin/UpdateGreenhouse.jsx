import React from 'react'
import Navigation from '../user/Navigation'
import Footer from '../authentication/Footer'
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput, } from 'mdb-react-ui-kit';
import image from '../images/slika.png';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosInstance from '../api/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { useCreateGreenhouseValidation } from '../validation/createGreenhouseValidation';
import { useAuthenticationContext } from '../store/authenticationContext';
import Status401 from '../status/Status401';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Status403 from '../status/Status403';

const UpdateGreenhouse = () => {
    const { control, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(useCreateGreenhouseValidation()) });
    const { checkRole } = useAuthenticationContext();
    const navigate = useNavigate();
    const [showStatus401, setShowStatus401] = useState(false);
    const { id } = useParams();
    const [showStatus403, setShowStatus403] = useState(false);

    useEffect(() => {
        if (errors.name?.message) {
            toast.error(errors.name.message)
        }
        if (errors.description?.message) {
            toast.error(errors.description.message)
        }
    }, [errors])

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setShowStatus401(true);
        } else {
            navigate(`/home/admin/updateGreenhouse/${id}`);
        }
    }, []);

    const handleUpdateGreenhouse = async (formData) => {
        try {
            if (checkRole(localStorage.getItem('roleId')) === 'admin') {
                const responseData = await axiosInstance.put(`Greenhouse/admin/updateGreenhouse/${id}`, formData, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                toast.success("Plastenik je uspješno ažuriran.", { autoClose: 1500 })
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

    if (showStatus401) {
        return <Status401 status={401} />;
    }

    if (showStatus403) {
        return <Status403 status={403} />;
    }

    if (checkRole(localStorage.getItem('roleId')) !== 'admin') {
        return <Status401 status={401} />;
    }

    return (
        <>
            <Navigation></Navigation>
            <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image' style={{ backgroundImage: `url(${image})` }}>
                <div className='mask gradient-custom-3'></div>
                <ToastContainer />
                <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
                    <MDBCardBody className='px-5'>
                        <h2 className="text-uppercase text-center mb-5">Ažuriraj plastenik</h2>
                        <Controller control={control} name="name" render={({ field: { onChange, onBlur } }) => (
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Naziv plastenika'
                                size='lg'
                                type='text'
                                onChange={onChange}
                                onBlur={onBlur}
                            />
                        )} />

                        <Controller control={control} name="description" render={({ field: { onChange, onBlur } }) => (
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Opis'
                                size='lg'
                                type='text'
                                onChange={onChange}
                                onBlur={onBlur}
                            />
                        )} />

                        <MDBBtn className='mt-4 mb-4 w-100 gradient-custom-4' size='lg' onClick={handleSubmit(handleUpdateGreenhouse)}>Ažuriraj</MDBBtn>
                        <Link to="/home" className="d-block text-center mt-3">Vrati se nazad</Link>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
            <Footer></Footer>
        </>
    )
}

export default UpdateGreenhouse