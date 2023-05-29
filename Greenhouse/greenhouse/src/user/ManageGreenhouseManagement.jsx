import React from 'react'
import Navigation from './Navigation'
import Footer from '../authentication/Footer'
import { MDBBtn, MDBContainer, MDBTable, MDBTableHead, MDBTableBody, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBRange, MDBSwitch, MDBTooltip } from 'mdb-react-ui-kit';
import axiosInstance from '../api/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import image from '../images/slika.png';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Status401 from '../status/Status401';
import Status403 from '../status/Status403';
import { useNavigate } from 'react-router-dom';
import { useGreenhouseDataContext } from '../store/greenhouseStore';
import { useForm, Controller } from "react-hook-form";
import { useWriteConfigurationAndManagementDataValidation } from '../validation/writeConfigurationAndManagementDataValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import open_window from '../images/open_window.png';
import close_window from '../images/close_window.png';
import filling_tank from '../images/filling_tank.png';
import emptying_tank from '../images/emptying_tank.png';

const ManageGreenhouseConfiguration = () => {
    const navigate = useNavigate();
    const [showStatus401, setShowStatus401] = useState(false);
    const { id } = useParams();
    const { greenhouseData, setGreenhouseData } = useGreenhouseDataContext();
    const [showStatus403, setShowStatus403] = useState(false);
    const [switchValue, setSwitchValue] = useState(true);
    const [remoteMode, setRemoteMode] = useState(false);

    const handleSwitchChange = () => {
        try {
            setSwitchValue(!switchValue);
            const requestData = {
                remote_mode: switchValue ? 1 : 0
            };
            axiosInstance.put(
                `Greenhouse/updateRemoteMode/${id}`,
                requestData,
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            toast.success('Uspješno ste podesili upravljačke komande.', { autoClose: 1500 });
        } catch (error) {
            if (error.response) {
                setShowStatus401(true);
                setShowStatus403(true);
            } else {
                toast.error('Došlo je do greške. Pokušajte ponovo. ');
            }
        }
    };

    const handleReadData = async () => {
        try {
            const responseData = await axiosInstance.get(`Greenhouse/readConfigurations/${id}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setGreenhouseData(responseData.data);
            console.log(responseData);
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

    useEffect(() => {
        handleReadData();
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setShowStatus401(true);
        } else {
            navigate(`/home/manageGreenhouseManagement/${id}`);
        }
    }, []);

    const handleWriteManagementsData = async (value) => {
        try {
            const requestData = {
                opening_command: null,
                closing_command: null,
                filling_command: null,
                emptying_command: null,
            };

            switch (value) {
                case 1: {
                    requestData.opening_command = value;
                    break;
                }
                case 2: {
                    requestData.closing_command = value;
                    break;
                }
                case 3: {
                    requestData.filling_command = value;
                    break;
                }
                case 4: {
                    requestData.emptying_command = value;
                    break;
                }
            }

            const responseData = await axiosInstance.put(
                `Greenhouse/updateManagements/${id}`,
                requestData,
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            toast.success('Uspješno ste podesili upravljačke komande.', { autoClose: 1500 });
            console.log(responseData);
        } catch (error) {
            if (error.response) {
                setShowStatus401(true);
                setShowStatus403(true);
            } else {
                toast.error('Došlo je do greške. Pokušajte ponovo. ');
            }
        }
    };

    if (showStatus401) {
        return <Status401 status={401} />;
    }

    if (showStatus403) {
        return <Status403 status={403} />;
    }

    const handleNavigate = () => {
        navigate('/home');
    }

    const handleRefresh = () => {
        window.location.reload();
    }

    return (
        <>
            <ToastContainer />
            <Navigation />
            <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image' style={{ backgroundImage: `url(${image})` }}>
                <div className='mask gradient-custom-3'></div>
                <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', alignItems: 'center', paddingTop: '5px', paddingRight: '5px' }}>
                    <MDBBtn style={{ marginRight: '10px' }} onClick={handleRefresh} color='success'>Osvježi</MDBBtn>
                    <MDBBtn onClick={handleNavigate} color='secondary'>Vrati se na početnu</MDBBtn>
                </div>
                <MDBRow style={{ paddingTop: '50px' }}>
                    <MDBCol>
                        {greenhouseData?.map((x, index) => (
                            <MDBTable key={index} align='middle' responsive className='mb-4' style={{ backgroundColor: '#8fd3f480', maxWidth: '100%', width: '500px' }}>
                                <MDBTableHead style={{ fontWeight: 'bold', fontSize: '1.5em', color: 'black' }}>
                                    <tr>
                                        <th scope='col' style={{ color: 'black', fontWeight: 'bold' }}>Konfiguracione i upravljačke komande</th>
                                        <th scope='col' style={{ color: 'black', fontWeight: 'bold' }}>Očitani podaci</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody style={{ color: 'black', fontWeight: 'bold' }} key={x.id}>
                                    {x?.created_at !== undefined && (
                                        <tr key={`created_at-${index}`}>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                Vrijeme očitanja
                                            </th>
                                            <td scope='col' style={{ backgroundColor: 'white', width: '200px' }}>
                                                {x?.created_at}
                                            </td>
                                        </tr>
                                    )}
                                    {x?.field1 !== undefined && (
                                        <tr key={`min-temp-${index}`}>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                Minimalna temperatura vazduha za otvaranje
                                            </th>
                                            <td scope='col' style={{ backgroundColor: 'white' }}>
                                                {x?.field1} [°C]
                                            </td>
                                        </tr>
                                    )}
                                    {x?.field2 !== undefined && (
                                        <tr key={`min-wind-${index}`}>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                Minimalna brzina vjetra za zatvaranje
                                            </th>
                                            <td scope='col' style={{ backgroundColor: 'white' }}>
                                                {x?.field2} [m/s]
                                            </td>
                                        </tr>
                                    )}
                                    {x?.field3 !== undefined && (
                                        <tr key={`max-land-temp-${index}`}>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                Maksimalna temperatura zemlje za navodnjavanje
                                            </th>
                                            <td scope='col' style={{ backgroundColor: 'white' }}>
                                                {x?.field3} [°C]
                                            </td>
                                        </tr>
                                    )}
                                    {x?.field4 !== undefined && (
                                        <tr key={`max-land-humidity-${index}`}>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                Maksimalna vlažnost zemlje za navodnjavanje
                                            </th>
                                            <td scope='col' style={{ backgroundColor: 'white' }}>
                                                {x?.field4} [%]
                                            </td>
                                        </tr>
                                    )}
                                    {x?.field6 !== undefined && (
                                        <tr key={`management-command-${index}`}>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                Posljednja upravljačka komanda
                                            </th>
                                            <td scope='col' style={{ backgroundColor: 'white' }}>
                                                {Number(x?.field6) === 1 ? (
                                                    "Otvaranje"
                                                ) : Number(x?.field6) === 2 ? (
                                                    "Zatvaranje"
                                                ) : Number(x?.field6) === 3 ? (
                                                    "Punjenje"
                                                ) : Number(x?.field6) === 4 ? (
                                                    "Pražnjenje"
                                                ) : null}
                                            </td>
                                        </tr>
                                    )}
                                    {x?.field8 !== undefined && (
                                        <tr key={`remote-mode-${index}`}>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                Daljinski režim
                                            </th>
                                            <td scope='col' style={{ backgroundColor: 'white' }}>
                                                {Number(x?.field8) === 0 ? (
                                                    "Ugašeno"
                                                ) : Number(x?.field8) === 1 ? (
                                                    "Upaljeno"
                                                ) : null}
                                            </td>
                                        </tr>
                                    )}
                                </MDBTableBody>
                            </MDBTable>
                        ))}
                    </MDBCol>
                    <MDBCol>
                        <MDBCard className='m-5' fluid='true'>
                            <MDBCardBody className='px-5'>
                                <h2 className="text-uppercase text-center mb-5">Upravljačke komande</h2>
                                <div className="d-flex justify-content-center">
                                    <MDBSwitch
                                        checked={remoteMode === 1}
                                        label="Daljinski režim"
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            const value = checked ? '1' : '0';
                                            setRemoteMode(checked ? 1 : 0);
                                            handleSwitchChange(value);
                                        }}
                                    />
                                </div>
                                {remoteMode &&
                                    <>
                                        <div style={{ display: 'flex', gap: '5rem' }}>
                                            <MDBTooltip wrapperProps={{ color: 'transparent' }} title='Otvori prozor'>
                                                <div className='mt-4 mb-4'>
                                                    <MDBBtn
                                                        color='info'
                                                        fluid='true'
                                                        className='w-100'
                                                        size='sg'
                                                        onClick={() => {
                                                            handleWriteManagementsData(1);
                                                        }}
                                                    >
                                                        <img src={open_window} alt="..." />
                                                    </MDBBtn>
                                                </div>
                                            </MDBTooltip>
                                            <MDBTooltip wrapperProps={{ color: 'transparent' }} title='Zatvori prozor'>
                                                <div className='mt-4 mb-4'>
                                                    <MDBBtn
                                                        color='danger'
                                                        fluid='true'
                                                        className='w-100'
                                                        size='sg'
                                                        onClick={() => {
                                                            handleWriteManagementsData(2);
                                                        }}
                                                    >
                                                        <img src={close_window} alt="..." />
                                                    </MDBBtn>
                                                </div>
                                            </MDBTooltip>
                                        </div>

                                        <div style={{ display: 'flex', gap: '5rem' }}>
                                            <MDBTooltip wrapperProps={{ color: 'transparent' }} title='Punjenje'>
                                                <MDBBtn
                                                    color='info'
                                                    fluid='true'
                                                    className='mt-4 mb-4 w-100'
                                                    size='sg'
                                                    onClick={() => handleWriteManagementsData(3)}
                                                >
                                                    <img src={filling_tank} alt="..." />
                                                </MDBBtn>
                                            </MDBTooltip>
                                            <MDBTooltip wrapperProps={{ color: 'transparent' }} title='Pražnjenje'>
                                                <MDBBtn
                                                    color='danger'
                                                    fluid='true'
                                                    className='mt-4 mb-4 w-100'
                                                    size='sg'
                                                    onClick={() => handleWriteManagementsData(4)}
                                                >
                                                    <img src={emptying_tank} alt="..." />
                                                </MDBBtn>
                                            </MDBTooltip>
                                        </div>
                                    </>
                                }
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer >
            <Footer />
        </>
    )
}

export default ManageGreenhouseConfiguration