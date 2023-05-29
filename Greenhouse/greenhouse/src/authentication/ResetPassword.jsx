import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useResetPasswordValidation } from '../validation/resetPasswordValidation';
import picture from '../images/unlock.png';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBCardImage, MDBInput } from 'mdb-react-ui-kit';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Status422 from '../status/Status422';
import Status400 from '../status/Status400';

const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const { control, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(useResetPasswordValidation()) });
    const [showStatus422, setShowStatus422] = useState(false);
    const [showStatus400, setShowStatus400] = useState(false);

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
    }, [errors])

    const handleSubmitForm = async (formData) => {
        try {
            const response = await axiosInstance.post(`/Greenhouse/resetPassword/${token}`, formData);
            toast.success("Uspješno ste se promijenili šifru.", { autoClose: 2500 })
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setShowStatus422(true);
            }
            else if (error.response.status === 400) {
                setShowStatus400(true);
            }
            else {
                toast.error("Došlo je do greške. Pokušajte ponovo.")
            }
        }
    }

    if (showStatus422) {
        return <Status422 status={422} />
    }

    if (showStatus400) {
        return <Status400 status={400} />
    }

    return (
        <>
            <ToastContainer></ToastContainer>
            <MDBContainer fluid className='d-flex align-items-center justify-content-center'>
                <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
                    <MDBCardBody className='px-5 text-center'>
                        <h2 className="text-uppercase text-center mb-5">Restartuj lozinku</h2>
                        <MDBCardImage className='mb-4 text-center img-fluid' src={picture} alt='Katanac' />
                        <form onSubmit={handleSubmit(handleSubmitForm)} method='post'>
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

                            <MDBBtn className='mt-4 mb-4 w-100 gradient-custom-4' size='lg' type="submit">Restartuj lozinku</MDBBtn>
                            <Link to="/" className="d-block text-center mt-3">Vrati se na početnu stranicu</Link>
                        </form>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
            <Footer></Footer>
        </>
    )
}

export default ResetPassword