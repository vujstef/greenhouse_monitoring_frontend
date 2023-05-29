import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useForm, Controller } from "react-hook-form";
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBInput } from 'mdb-react-ui-kit';
import greenhousePicture from '../images/plastenik.png';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from 'react-router-dom';
import { useLoginValidation } from '../validation/loginValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import myLogoIcon from '../images/logo.png';
import Status401 from '../status/Status401';
import { useGreenhouseDataContext } from '../store/greenhouseStore';
import { useAuthenticationContext } from '../store/authenticationContext';

const Login = () => {
    const navigate = useNavigate();
    const { control, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(useLoginValidation()) });
    const [showStatus401, setShowStatus401] = useState(false);
    const { setGreenhouseData } = useGreenhouseDataContext();
    const { checkRole } = useAuthenticationContext();

    useEffect(() => {
        if (errors.email?.message) {
            toast.error(errors.email.message)
        }
        if (errors.password?.message) {
            toast.error(errors.password.message)
        }
    }, [errors])

    const handleSubmitForm = async (formData) => {
        try {
            const response = await axiosInstance.post('/Greenhouse/login', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem("roleId", response.data.roleId);
            localStorage.setItem("id", response.data.id);
            if (response.data.token) {
                if (checkRole(localStorage.getItem("roleId")) == "user") {
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
            toast.success("Uspješno ste se prijavili.", { autoClose: 1500 })
            setTimeout(() => {
                navigate('/home');
            }, 2000);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setShowStatus401(true);
            } else if (error.response) {
                toast.error("Pogrešan email ili lozinka. Pokušajte ponovo.")
            }
        }
    }

    if (showStatus401) {
        return <Status401 status={401} />
    }

    return (
        <>
            <ToastContainer></ToastContainer>
            <MDBContainer fluid>
                <MDBRow>
                    <MDBCol sm="6">
                        <div className="d-flex flex-row ps-5 pt-5">
                            <img
                                src={myLogoIcon}
                                alt="Slika"
                            />
                            <span className="h1 fw-bold mb-0 mt-5">Dobro došli</span>
                        </div>

                        <div className="d-flex flex-column justify-content-center h-custom-2 w-75 pt-4">
                            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{ letterSpacing: '1px' }}>
                                Prijavite se
                            </h3>

                            <Controller control={control} name="email" render={({ field: { onChange, onBlur } }) => (
                                <MDBInput
                                    title={errors.email && 'Greska!'}
                                    wrapperClass="mb-4 mx-5 w-100"
                                    label="Email"
                                    type="email"
                                    size="lg"
                                    onChange={onChange}
                                    onBlur={onBlur}
                                />
                            )} />

                            <Controller control={control} name='password' render={({ field: { onChange, onBlur } }) => (
                                <MDBInput
                                    title={errors.email && 'Greska!'}
                                    wrapperClass="mb-4 mx-5 w-100"
                                    label="Lozinka"
                                    type="password"
                                    size="lg"
                                    onChange={onChange}
                                    onBlur={onBlur}
                                />
                            )} />

                            <MDBBtn className="mb-4 px-5 mx-5 w-100" color="info" size="lg" onClick={handleSubmit(handleSubmitForm)}>
                                Prijava
                            </MDBBtn>

                            <p className="small mb-5 pb-lg-3 ms-5">
                                <Link to="forgotPassword" className="text-muted">
                                    Zaboravljena lozinka?
                                </Link>
                            </p>

                            <div className="d-flex align-items-center ms-5">
                                <p className="me-2">Nemate nalog?</p>
                                <Link to="register">
                                    <p className="">Registrujte se</p>
                                </Link>
                            </div>
                        </div>
                    </MDBCol>

                    <MDBCol sm="6" className="d-none d-sm-block px-0">
                        <img
                            src={greenhousePicture}
                            alt="Slika"
                            className="w-100 h-100"
                        />
                    </MDBCol>

                </MDBRow>
            </MDBContainer>
        </>
    );
};

export default Login;