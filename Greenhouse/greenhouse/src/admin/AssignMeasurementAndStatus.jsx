import React, { useEffect } from 'react'
import Navigation from '../user/Navigation';
import Footer from '../authentication/Footer'
import { MDBContainer, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBCheckbox } from 'mdb-react-ui-kit'
import image from '../images/slika.png';
import { useParams } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosInstance from '../api/axiosInstance';
import { useForm, Controller } from "react-hook-form";
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useMeasurementAndStatusValidation } from '../validation/measurementAndStatusValidation';
import { useAuthenticationContext } from '../store/authenticationContext';
import Status401 from '../status/Status401';
import Status403 from '../status/Status403'

const AssignMeasurementAndStatus = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { control, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(useMeasurementAndStatusValidation()) });
    const { checkRole } = useAuthenticationContext();
    const [showStatus401, setShowStatus401] = useState(false);
    const [showStatus403, setShowStatus403] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setShowStatus401(true);
        } else {
            navigate(`/home/admin/assignMeasurementAndStatuses/${id}`);
        }
    }, []);

    const handleAssignMeasurementAndStatus = async (formData) => {
        try {
            if (checkRole(localStorage.getItem('roleId')) === 'admin') {
                const response = await axiosInstance.put(`Greenhouse/admin/assignParameters/${id}`, formData, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                toast.success("Parametri su uspješno ažurirani.", { autoClose: 1500 })
                setTimeout(() => {
                    navigate('/home');
                }, 2000)
            } else {
                setShowStatus401(true);
                setShowStatus403(true);
            }
        } catch (error) {
            if (error.response.status === 403) {
                setShowStatus403(true);
            }
            else {
                toast.error("Došlo je do greške prilikom ažuriranja korisnika.", { autoClose: 1500 })
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

    const handleBack = () => {
        navigate('/home');
    }

    return (
        <>
            <ToastContainer></ToastContainer>
            <Navigation></Navigation>
            <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image' style={{ backgroundImage: `url(${image})` }}>
                <div className='mask gradient-custom-3'></div>
                <MDBTable align='middle' responsive style={{ backgroundColor: '#8fd3f480' }}>
                    <MDBTableHead style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'black' }}>
                        <tr>
                            <th scope='col'>Dodjeljivanje mjerenja i statusa</th>
                            <th></th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody style={{ color: 'black' }}>
                        <tr>
                            <th scope='col'>
                                Temperatura vazduha
                            </th>
                            <td>
                                <Controller control={control} name="air_temperature" render={({ field: { onChange, onBlur } }) => (
                                    <MDBCheckbox
                                        onChange={onChange}
                                        onBlur={onBlur}>
                                    </MDBCheckbox>
                                )} />
                            </td>
                        </tr>
                        <tr>
                            <th scope='col'>
                                Relativna vlažnost vazduha
                            </th>
                            <td>
                                <Controller control={control} name="relative_air_humidity" render={({ field: { onChange, onBlur } }) => (
                                    <MDBCheckbox
                                        onChange={onChange}
                                        onBlur={onBlur}>
                                    </MDBCheckbox>
                                )} />
                            </td>
                        </tr>
                        <tr>
                            <th scope='col'>
                                Temperatura zemlje
                            </th>
                            <td>
                                <Controller control={control} name="soil_temperature" render={({ field: { onChange, onBlur } }) => (
                                    <MDBCheckbox
                                        onChange={onChange}
                                        onBlur={onBlur}>
                                    </MDBCheckbox>
                                )} />
                            </td>
                        </tr>
                        <tr>
                            <th scope='col'>
                                Relativna vlažnost zemlje
                            </th>
                            <td>
                                <Controller control={control} name="relative_humidity_of_the_soil" render={({ field: { onChange, onBlur } }) => (
                                    <MDBCheckbox
                                        onChange={onChange}
                                        onBlur={onBlur}>
                                    </MDBCheckbox>
                                )} />
                            </td>
                        </tr>
                        <tr>
                            <th scope='col'>
                                Intenzitet osvjetljenja
                            </th>
                            <td>
                                <Controller control={control} name="lighting_intensity" render={({ field: { onChange, onBlur } }) => (
                                    <MDBCheckbox
                                        onChange={onChange}
                                        onBlur={onBlur}>
                                    </MDBCheckbox>
                                )} />
                            </td>
                        </tr>
                        <tr>
                            <th scope='col'>
                                Vanjska temperatura vazduha
                            </th>
                            <td>
                                <Controller control={control} name="outside_air_temperature" render={({ field: { onChange, onBlur } }) => (
                                    <MDBCheckbox
                                        onChange={onChange}
                                        onBlur={onBlur}>
                                    </MDBCheckbox>
                                )} />
                            </td>
                        </tr>
                        <tr>
                            <th scope='col'>
                                Brzina vjetra
                            </th>
                            <td>
                                <Controller control={control} name="wind_speed" render={({ field: { onChange, onBlur } }) => (
                                    <MDBCheckbox
                                        onChange={onChange}
                                        onBlur={onBlur}>
                                    </MDBCheckbox>
                                )} />
                            </td>
                        </tr>
                        <tr>
                            <th scope='col'>
                                Nivo vode
                            </th>
                            <td>
                                <Controller control={control} name="water_level" render={({ field: { onChange, onBlur } }) => (
                                    <MDBCheckbox
                                        onChange={onChange}
                                        onBlur={onBlur}>
                                    </MDBCheckbox>
                                )} />
                            </td>
                        </tr>
                        <tr>
                            <th scope='col'>
                                Otvaranje
                            </th>
                            <td>
                                <Controller control={control} name="opening" render={({ field: { onChange, onBlur } }) => (
                                    <MDBCheckbox
                                        onChange={onChange}
                                        onBlur={onBlur}>
                                    </MDBCheckbox>
                                )} />
                            </td>
                        </tr>
                        <tr>
                            <th scope='col'>
                                Zatvaranje
                            </th>
                            <td>
                                <Controller control={control} name="closing" render={({ field: { onChange, onBlur } }) => (
                                    <MDBCheckbox
                                        onChange={onChange}
                                        onBlur={onBlur}>
                                    </MDBCheckbox>
                                )} />
                            </td>
                        </tr>
                        <tr>
                            <th scope='col'>
                                Otvoren
                            </th>
                            <td>
                                <Controller control={control} name="opened" render={({ field: { onChange, onBlur } }) => (
                                    <MDBCheckbox
                                        onChange={onChange}
                                        onBlur={onBlur}>
                                    </MDBCheckbox>
                                )} />
                            </td>
                        </tr>
                        <tr>
                            <th scope='col'>
                                Zatvoren
                            </th>
                            <td>
                                <Controller control={control} name="closed" render={({ field: { onChange, onBlur } }) => (
                                    <MDBCheckbox
                                        onChange={onChange}
                                        onBlur={onBlur}>
                                    </MDBCheckbox>
                                )} />
                            </td>
                        </tr>
                        <tr>
                            <th scope='col'>
                                Punjenje
                            </th>
                            <td>
                                <Controller control={control} name="filling" render={({ field: { onChange, onBlur } }) => (
                                    <MDBCheckbox
                                        onChange={onChange}
                                        onBlur={onBlur}>
                                    </MDBCheckbox>
                                )} />
                            </td>
                        </tr>
                        <tr>
                            <th scope='col'>
                                Pražnjenje
                            </th>
                            <td>
                                <Controller control={control} name="emptying" render={({ field: { onChange, onBlur } }) => (
                                    <MDBCheckbox
                                        onChange={onChange}
                                        onBlur={onBlur}>
                                    </MDBCheckbox>
                                )} />
                            </td>
                        </tr>
                        <tr>
                            <th scope='col'>
                                Pun
                            </th>
                            <td>
                                <Controller control={control} name="full" render={({ field: { onChange, onBlur } }) => (
                                    <MDBCheckbox
                                        onChange={onChange}
                                        onBlur={onBlur}>
                                    </MDBCheckbox>
                                )} />
                            </td>
                        </tr>
                        <tr>
                            <th scope='col'>
                                Prazan
                            </th>
                            <td>
                                <Controller control={control} name="empty" render={({ field: { onChange, onBlur } }) => (
                                    <MDBCheckbox
                                        onChange={onChange}
                                        onBlur={onBlur}>
                                    </MDBCheckbox>
                                )} />
                            </td>
                        </tr>
                        <tr>
                            <th scope='col'>
                                Daljinski režim
                            </th>
                            <td>
                                <Controller control={control} name="remote_mode" render={({ field: { onChange, onBlur } }) => (
                                    <MDBCheckbox
                                        onChange={onChange}
                                        onBlur={onBlur}>
                                    </MDBCheckbox>
                                )} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="d-flex justify-content-between">
                                    <MDBBtn color='info' className='custom-btn-color' onClick={handleSubmit(handleBack)}>Nazad na početnu</MDBBtn>
                                    <MDBBtn color='success' className='custom-btn-color' onClick={handleSubmit(handleAssignMeasurementAndStatus)}>Potvrdi</MDBBtn>
                                </div>
                            </td>
                        </tr>
                    </MDBTableBody>
                </MDBTable>
            </MDBContainer>
            <Footer></Footer>
        </>
    )
}

export default AssignMeasurementAndStatus