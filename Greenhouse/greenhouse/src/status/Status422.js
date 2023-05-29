import React from 'react';
import { MDBIcon, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import image from '../images/unauthorized.png';
import "@fortawesome/fontawesome-free/css/all.min.css";

const Status422 = () => {
    return (
        <MDBContainer fluid className="error-page d-flex justify-content-center align-items-center">
            <MDBRow className="text-center">
                <MDBCol>
                    <div className="error-template">
                        <img src={image} alt="Error image" className="img-fluid" />
                        <h1>Oops!</h1>
                        <h2>422 Unprocessable Entity</h2>
                        <div className="error-details">
                            Zahtjev nije mogao biti procesuiran.
                        </div>
                        <div className="error-actions">
                            <a href="/" className="btn btn-primary btn-lg mr-2">
                                <MDBIcon icon="home" className="mr-2" />
                                Nazad na početnu stranicu
                            </a>
                        </div>
                    </div>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
};

export default Status422;
