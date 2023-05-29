import React, { useEffect } from 'react';
import Navigation from '../user/Navigation';
import Footer from '../authentication/Footer'
import { MDBContainer, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBCheckbox, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import image from '../images/slika.png';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosInstance from '../api/axiosInstance';
import { useForm, Controller } from "react-hook-form";
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useConfigurationAndManagementValidation } from '../validation/configurationAndManagementValidation';
import { useAuthenticationContext } from '../store/authenticationContext';
import Status401 from '../status/Status401';
import Status403 from '../status/Status403'

const AssignConfigurationAndManagementCommand = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { control, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(useConfigurationAndManagementValidation()) });
    const { checkRole } = useAuthenticationContext();
    const [showStatus401, setShowStatus401] = useState(false);
    const [showStatus403, setShowStatus403] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setShowStatus401(true);
        } else {
            navigate(`/home/admin/assignConfigurationAndManagementCommand/${id}`);
        }
    }, []);

    const handleAssignConfigurationCommand = async (formData) => {
        try {
            if (checkRole(localStorage.getItem('roleId')) === 'admin') {
                const response = await axiosInstance.put(`Greenhouse/admin/assignConfigurationCommand/${id}`, formData, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                toast.success("Konfiguracione komande su uspješno ažurirane.", { autoClose: 1500 })
                setTimeout(() => {
                    navigate(`/home/admin/assignConfigurationAndManagementCommand/${id}`);
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

    const handleAssignManagementCommand = async (formData) => {
        try {
            if (checkRole(localStorage.getItem('roleId')) === 'admin') {
                const response = await axiosInstance.put(`Greenhouse/admin/assignManagementCommand/${id}`, formData, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                toast.success("Upravljačke komande su uspješno ažurirane.", { autoClose: 1500 })
                setTimeout(() => {
                    navigate(`/home/admin/assignConfigurationAndManagementCommand/${id}`);
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
                <div className="d-flex flex-column justify-content-center align-items-center" style={{ margin: '20px' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', alignItems: 'center', paddingTop: '5px', paddingRight: '5x' }}>
                        <MDBBtn color='secondary' className='custom-btn-color' onClick={handleSubmit(handleBack)}>Nazad na početnu</MDBBtn>
                    </div>
                    <div className="d-flex flex-column align-items-justify">
                        <MDBRow style={{ paddingTop: '40px'}}>
                            <MDBCol>
                                <MDBTable align='middle' responsive className='mb-4' style={{ backgroundColor: '#8fd3f480', maxWidth: '100%' }}>
                                    <MDBTableHead style={{ fontWeight: 'bold', fontSize: '1.5em', color: 'black' }}>
                                        <tr>
                                            <th scope='col'>Konfiguracione komande</th>
                                            <th></th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody style={{ color: 'black' }}>
                                        <tr>
                                            <th scope='col'>
                                                Minimalna temperatura vazduha za otvaranje
                                            </th>
                                            <td>
                                                <Controller control={control} name="min_air_temp" render={({ field: { onChange, onBlur } }) => (
                                                    <MDBCheckbox onChange={onChange} onBlur={onBlur} />
                                                )} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope='col'>
                                                Minimalna brzina vjetra za zatvaranje
                                            </th>
                                            <td>
                                                <Controller control={control} name="min_wind_speed" render={({ field: { onChange, onBlur } }) => (
                                                    <MDBCheckbox onChange={onChange} onBlur={onBlur} />
                                                )} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope='col'>
                                                Maskimalna temperatura zemlje za navodnjavanje
                                            </th>
                                            <td>
                                                <Controller control={control} name="max_soil_temp" render={({ field: { onChange, onBlur } }) => (
                                                    <MDBCheckbox onChange={onChange} onBlur={onBlur} />
                                                )} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope='col'>
                                                Maksimalna vlažnost zemlje za navodnjavanje
                                            </th>
                                            <td>
                                                <Controller control={control} name="max_soil_humidity" render={({ field: { onChange, onBlur } }) => (
                                                    <MDBCheckbox onChange={onChange} onBlur={onBlur} />
                                                )} />
                                            </td>
                                        </tr>
                                    </MDBTableBody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan='2'>
                                                <div className="d-flex justify-content-center">
                                                    <MDBBtn color='success' className='custom-btn-color' onClick={handleSubmit(handleAssignConfigurationCommand)}>Potvrdi</MDBBtn>
                                                </div>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </MDBTable>
                            </MDBCol>

                            <MDBCol>
                                <MDBTable align='middle' responsive className='mb-4' style={{ backgroundColor: '#8fd3f480', maxWidth: '100%' }}>
                                    <MDBTableHead style={{ fontWeight: 'bold', fontSize: '1.5em', color: 'black' }}>
                                        <tr>
                                            <th scope='col'>Upravljačke komande</th>
                                            <th></th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody style={{ color: 'black' }}>
                                        <tr>
                                            <th scope='col'>
                                                Otvaranje
                                            </th>
                                            <td>
                                                <Controller control={control} name="opening_command" render={({ field: { onChange, onBlur } }) => (
                                                    <MDBCheckbox onChange={onChange} onBlur={onBlur} />
                                                )} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope='col'>
                                                Zatvaranje
                                            </th>
                                            <td>
                                                <Controller control={control} name="closing_command" render={({ field: { onChange, onBlur } }) => (
                                                    <MDBCheckbox onChange={onChange} onBlur={onBlur} />
                                                )} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope='col'>
                                                Punjenje
                                            </th>
                                            <td>
                                                <Controller control={control} name="filling_command" render={({ field: { onChange, onBlur } }) => (
                                                    <MDBCheckbox onChange={onChange} onBlur={onBlur} />
                                                )} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope='col'>
                                                Pražnjenje
                                            </th>
                                            <td>
                                                <Controller control={control} name="emptying_command" render={({ field: { onChange, onBlur } }) => (
                                                    <MDBCheckbox onChange={onChange} onBlur={onBlur} />
                                                )} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope='col'>
                                                Daljinski režim
                                            </th>
                                            <td>
                                                <Controller control={control} name="remote_mode" render={({ field: { onChange, onBlur } }) => (
                                                    <MDBCheckbox onChange={onChange} onBlur={onBlur} />
                                                )} />
                                            </td>
                                        </tr>
                                    </MDBTableBody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan='2'>
                                                <div className="d-flex justify-content-center">
                                                    <MDBBtn color='success' className='custom-btn-color' onClick={handleSubmit(handleAssignManagementCommand)}>Potvrdi</MDBBtn>
                                                </div>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </MDBTable>
                            </MDBCol>
                        </MDBRow>
                    </div>
                </div>
            </MDBContainer>
            <Footer></Footer>
        </>
    )
}

export default AssignConfigurationAndManagementCommand