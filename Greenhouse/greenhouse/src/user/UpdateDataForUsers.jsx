import React from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput, } from 'mdb-react-ui-kit';
import image from '../images/slika.png';
import Footer from '../authentication/Footer';
import Navigation from '../user/Navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosInstance from '../api/axiosInstance';
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { useUpdateValidation } from '../validation/updateUserValidation';
import { useParams } from 'react-router-dom';
import { useGreenhouseDataContext } from '../store/greenhouseStore';
import Status403 from '../status/Status403';
import Status401 from '../status/Status401';

const UpdateDataForUsers = () => {
    const { control, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(useUpdateValidation()) });
    const { greenhouseData, setGreenhouseData } = useGreenhouseDataContext();
    const [showStatus403, setShowStatus403] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [showStatus401, setShowStatus401] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setShowStatus401(true);
        } else {
            navigate(`/home/updateUserData/${id}`);
        }
    }, []);

    useEffect(() => {
        if (errors.email?.message) {
            toast.error(errors.email.message)
        }
        if (errors.password?.message) {
            toast.error(errors.password.message)
        }
        if (errors.password_confirmation?.message) {
            toast.error(errors.password_confirmation.message)
        }
        if (errors.first_name?.message) {
            toast.error(errors.first_name.message)
        }
        if (errors.last_name?.message) {
            toast.error(errors.last_name.message)
        }
    }, [errors])

    const handleUpdateUser = async (formData) => {
        try {
            const response = await axiosInstance.put(`Greenhouse/updateUser/${id}`, formData, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const updatedUser = response.data.user;
            setGreenhouseData(greenhouseData.map(x => x.id === updatedUser?.id ? updatedUser : x));
            toast.success("Uspješno ste ažurirali podatke.", { autoClose: 1500 })
            setTimeout(() => {
                navigate('/home');
            }, 2000)
        } catch (error) {
            console.error(error);
            if (error.response.status === 403) {
                setShowStatus403(true);
            } else {
                toast.error("Došlo je do greške prilikom ažuriranja.", { autoClose: 1500 })
            }
        }
    }

    if (showStatus401) {
        return <Status401 status={401} />;
    }

    if (showStatus403) {
        return <Status403 status={403} />;
    }

    return (
        <>
            <Navigation></Navigation>
            <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image' style={{ backgroundImage: `url(${image})` }}>
                <div className='mask gradient-custom-3'></div>
                <ToastContainer />
                <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
                    <MDBCardBody className='px-5'>
                        <h2 className="text-uppercase text-center mb-5">Ažuriraj podatke</h2>
                        <Controller control={control} name="first_name" render={({ field: { onChange, onBlur } }) => (
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Ime'
                                size='lg'
                                type='text'
                                onChange={onChange}
                                onBlur={onBlur}
                            />
                        )} />

                        <Controller control={control} name="last_name" render={({ field: { onChange, onBlur } }) => (
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Prezime'
                                size='lg'
                                type='text'
                                onChange={onChange}
                                onBlur={onBlur}
                            />
                        )} />

                        <Controller control={control} name="email" render={({ field: { onChange, onBlur } }) => (
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Email'
                                size='lg'
                                type='email'
                                onChange={onChange}
                                onBlur={onBlur}
                            />
                        )} />

                        <Controller control={control} name="password" render={({ field: { onChange, onBlur } }) => (
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Lozinka'
                                size='lg'
                                type='password'
                                onChange={onChange}
                                onBlur={onBlur}
                            />
                        )} />

                        <Controller control={control} name="password_confirmation" render={({ field: { onChange, onBlur } }) => (
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Potvrda lozinke'
                                size='lg'
                                type='password'
                                onChange={onChange}
                                onBlur={onBlur}
                            />
                        )} />

                        <MDBBtn className='mt-4 mb-4 w-100 gradient-custom-4' size='lg' onClick={handleSubmit(handleUpdateUser)}>Ažuriraj</MDBBtn>
                        <Link to="/home" className="d-block text-center mt-3">Vrati se nazad</Link>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
            <Footer></Footer>
        </>
    )
}

export default UpdateDataForUsers