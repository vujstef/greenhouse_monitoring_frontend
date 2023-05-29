import React from 'react';
import { MDBFooter, MDBContainer } from 'mdb-react-ui-kit';

const Footer = () => {

    const currentYear = new Date().getFullYear();

    return (
        <MDBFooter className='text-center text-white' style={{ backgroundColor: 'transparent' }}>
            <MDBContainer className='p-4'></MDBContainer>

            <div className='text-center p-3' style={{ color: 'black' }}>
                &copy; Greenhouse {currentYear}
            </div>
        </MDBFooter>
    )
}

export default Footer