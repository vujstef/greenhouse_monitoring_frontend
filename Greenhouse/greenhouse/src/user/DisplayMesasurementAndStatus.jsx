import React from 'react'
import Navigation from '../user/Navigation'
import Footer from '../authentication/Footer'
import { MDBBtn, MDBContainer, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import axiosInstance from '../api/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import image from '../images/slika.png';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Status401 from '../status/Status401';
import Status403 from '../status/Status403';
import { useNavigate } from 'react-router-dom';
import { useGreenhouseDataContext } from '../store/greenhouseStore';
import good_mark from '../images/good_mark.png';
import bad_mark from '../images/bad_mark.png';
import air_temperature from '../images/air_temperature.png';
import humidity from '../images/humidity.png';
import light from '../images/light.png';
import wind from '../images/wind.png';
import water from '../images/water.png';
import open from '../images/open.png';
import close from '../images/close.png';
import full from '../images/full.png';
import empty from '../images/empty.png';
import remote from '../images/remote.png';

const DisplayMesasurementAndStatus = () => {
    const navigate = useNavigate();
    const [showStatus401, setShowStatus401] = useState(false);
    const { id } = useParams();
    const { greenhouseData, setGreenhouseData } = useGreenhouseDataContext();
    const [showStatus403, setShowStatus403] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setShowStatus401(true);
        } else {
            navigate(`/home/getDisplayedMeasurementStatuses/${id}`);
        }
    }, []);

    const getDisplayedMeasurementStatuses = async () => {
        try {
            const responseData = await axiosInstance.get(`Greenhouse/displayParametersToUser/${id}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setGreenhouseData(responseData.data);
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
        getDisplayedMeasurementStatuses();
    }, [])

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
                <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', alignItems: 'center', paddingTop: '5px', paddingRight: '5x' }}>
                    <MDBBtn style={{ marginRight: '10px' }} onClick={handleRefresh} color='success'>Osvježi</MDBBtn>
                    <MDBBtn onClick={handleNavigate} color='secondary'>Vrati se na početnu</MDBBtn>
                </div>
                <div className="container text-center">
                    <h3 style={{ color: 'black', paddingTop: '40px', fontWeight: 'bold' }}>Mjerenja i statusi plastenika</h3>
                    {greenhouseData?.map((x) => (
                        <>
                            <p style={{ color: 'black', fontWeight: 'bold' }}>{x?.time}</p>
                            <MDBTable align='middle' responsive className='mb-4' style={{ backgroundColor: '#8fd3f480', maxWidth: '100%' }} >
                                <MDBTableHead style={{ fontWeight: 'bold', fontSize: '1.5em', color: 'black', paddingTop: '40px' }}>
                                    <tr>
                                        <th scope='col' style={{ color: 'black', fontWeight: 'bold' }}>Parametri</th>
                                        <th scope='col' style={{ color: 'black', fontWeight: 'bold' }}>Vrijednosti</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody style={{ color: 'black', fontWeight: 'bold' }} key={x.id}>
                                    {x?.parameters?.air_temperature !== undefined && (
                                        <tr>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                <img src={air_temperature} alt="Image" style={{ marginRight: '10px' }} />
                                                Temperatura vazduha
                                            </th>
                                            <td style={{ backgroundColor: 'white' }}>{x?.parameters?.air_temperature} [°C]</td>
                                        </tr>
                                    )}
                                    {x?.parameters?.relative_air_humidity !== undefined && (
                                        <tr>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                <img src={humidity} alt="Image" style={{ marginRight: '10px' }} />
                                                Relativna vlažnost vazduha
                                            </th>
                                            <td scope='col' style={{ backgroundColor: 'white' }}>{x?.parameters?.relative_air_humidity} [%]</td>
                                        </tr>
                                    )}
                                    {x?.parameters?.soil_temperature !== undefined && (
                                        <tr>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                <img src={air_temperature} alt="Image" style={{ marginRight: '10px' }} />
                                                Temperatura zemlje
                                            </th>
                                            <td style={{ backgroundColor: 'white' }}>{x?.parameters?.soil_temperature} [°C]</td>
                                        </tr>
                                    )}
                                    {x?.parameters?.relative_humidity_of_the_soil !== undefined && (
                                        <tr>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                <img src={humidity} alt="Image" style={{ marginRight: '10px' }} />
                                                Relativna vlažnost zemlje
                                            </th>
                                            <td style={{ backgroundColor: 'white' }}>{x?.parameters?.relative_humidity_of_the_soil} [%]</td>
                                        </tr>
                                    )}
                                    {x?.parameters?.lighting_intensity !== undefined && (
                                        <tr>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                <img src={light} alt="Image" style={{ marginRight: '10px' }} />
                                                Intenzitet osvjetljenja
                                            </th>
                                            <td style={{ backgroundColor: 'white' }}>{x?.parameters?.lighting_intensity} [lx]</td>
                                        </tr>
                                    )}
                                    {x?.parameters?.outside_air_temperature !== undefined && (
                                        <tr>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                <img src={air_temperature} alt="Image" style={{ marginRight: '10px' }} />
                                                Vanjska temperatura vazduha
                                            </th>
                                            <td style={{ backgroundColor: 'white' }}>{x?.parameters?.outside_air_temperature} [°C]</td>
                                        </tr>
                                    )}
                                    {x?.parameters?.wind_speed !== undefined && (
                                        <tr>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                <img src={wind} alt="Image" style={{ marginRight: '10px' }} />
                                                Brzina vjetra
                                            </th>
                                            <td style={{ backgroundColor: 'white' }}>{x?.parameters?.wind_speed} [m/s]</td>
                                        </tr>
                                    )}
                                    {x?.parameters?.water_level !== undefined && (
                                        <tr>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                <img src={water} alt="Image" style={{ marginRight: '10px' }} />
                                                Nivo vode
                                            </th>
                                            <td style={{ backgroundColor: 'white' }}>{x?.parameters?.water_level} [%]</td>
                                        </tr>
                                    )}
                                    {x?.parameters?.opening !== undefined && (
                                        <tr>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                <img src={open} alt="Image" style={{ marginRight: '10px' }} />
                                                Otvaranje
                                            </th>
                                            <td style={{ backgroundColor: 'white' }}>
                                                {Number(x?.parameters?.opening) === 1 ? (
                                                    <img src={good_mark} alt="Good Mark" />
                                                ) : (
                                                    <img src={bad_mark} alt="Error Mark" />
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                    {x?.parameters?.closing !== undefined && (
                                        <tr>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                <img src={close} alt="Image" style={{ marginRight: '10px' }} />
                                                Zatvaranje
                                            </th>
                                            <td style={{ backgroundColor: 'white' }}>
                                                {Number(x?.parameters?.closing) === 1 ? (
                                                    <img src={good_mark} alt="Good Mark" />
                                                ) : (
                                                    <img src={bad_mark} alt="Error Mark" />
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                    {x?.parameters?.opened !== undefined && (
                                        <tr>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                <img src={open} alt="Image" style={{ marginRight: '10px' }} />
                                                Otvoren
                                            </th>
                                            <td style={{ backgroundColor: 'white' }}>
                                                {Number(x?.parameters?.opened) === 1 ? (
                                                    <img src={good_mark} alt="Good Mark" />
                                                ) : (
                                                    <img src={bad_mark} alt="Error Mark" />
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                    {x?.parameters?.closed !== undefined && (
                                        <tr>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                <img src={close} alt="Image" style={{ marginRight: '10px' }} />
                                                Zatvoren
                                            </th>
                                            <td style={{ backgroundColor: 'white' }}>
                                                {Number(x?.parameters?.closed) === 1 ? (
                                                    <img src={good_mark} alt="Good Mark" />
                                                ) : (
                                                    <img src={bad_mark} alt="Error Mark" />
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                    {x?.parameters?.filling !== undefined && (
                                        <tr>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                <img src={full} alt="Image" style={{ marginRight: '10px' }} />
                                                Punjenje
                                            </th>
                                            <td style={{ backgroundColor: 'white' }}>
                                                {Number(x?.parameters?.filling) === 1 ? (
                                                    <img src={good_mark} alt="Good Mark" />
                                                ) : (
                                                    <img src={bad_mark} alt="Error Mark" />
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                    {x?.parameters?.emptying !== undefined && (
                                        <tr>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                <img src={empty} alt="Image" style={{ marginRight: '10px' }} />
                                                Pražnjenje
                                            </th>
                                            <td style={{ backgroundColor: 'white' }}>
                                                {Number(x?.parameters?.emptying) === 1 ? (
                                                    <img src={good_mark} alt="Good Mark" />
                                                ) : (
                                                    <img src={bad_mark} alt="Error Mark" />
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                    {x?.parameters?.full !== undefined && (
                                        <tr>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                <img src={full} alt="Image" style={{ marginRight: '10px' }} />
                                                Pun
                                            </th>
                                            <td style={{ backgroundColor: 'white' }}>
                                                {Number(x?.parameters?.full) === 1 ? (
                                                    <img src={good_mark} alt="Good Mark" />
                                                ) : (
                                                    <img src={bad_mark} alt="Error Mark" />
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                    {x?.parameters?.empty !== undefined && (
                                        <tr>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                <img src={empty} alt="Image" style={{ marginRight: '10px' }} />
                                                Prazan
                                            </th>
                                            <td style={{ backgroundColor: 'white' }}>
                                                {Number(x?.parameters?.empty) === 1 ? (
                                                    <img src={good_mark} alt="Good Mark" />
                                                ) : (
                                                    <img src={bad_mark} alt="Error Mark" />
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                    {x?.parameters?.remote_mode !== undefined && (
                                        <tr>
                                            <th scope='col' style={{ color: 'black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                                <img src={remote} alt="Image" style={{ marginRight: '10px' }} />
                                                Daljinski režim
                                            </th>
                                            <td style={{ backgroundColor: 'white' }}>
                                                {Number(x?.parameters?.remote_mode) === 1 ? (
                                                    <img src={good_mark} alt="Good Mark" />
                                                ) : (
                                                    <img src={bad_mark} alt="Error Mark" />
                                                )}
                                            </td>
                                        </tr>
                                    )}

                                </MDBTableBody>
                            </MDBTable>
                        </>
                    ))}
                </div>
            </MDBContainer >
            <Footer />
        </>
    )
}

export default DisplayMesasurementAndStatus