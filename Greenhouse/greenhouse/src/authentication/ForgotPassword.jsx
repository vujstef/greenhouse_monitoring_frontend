import React from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBCardImage } from 'mdb-react-ui-kit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useForm, Controller } from "react-hook-form";
import { useforgotPasswordValidation } from '../validation/forgotPasswordValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import picture from '../images/lock.png';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(useforgotPasswordValidation()) });

  useEffect(() => {
    if (errors.email?.message) {
      toast.error(errors.email.message)
    }
  }, [errors])

  const handleSubmitForm = async (formData) => {
    try {
      const response = await axiosInstance.post('/Greenhouse/submitForgotPassword', formData);
      toast.success("Email za restartovanje šifre vam je poslan.", { autoClose: 2500 })
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      if (error.response) {
        toast.error("Došlo je do greške. Pokušajte ponovo.")
      }
      else {
        toast.error("Došlo je do greške. Pokušajte ponovo.")
      }
    }
  }

  return (
    <>
      <ToastContainer></ToastContainer>
      <MDBContainer fluid className='d-flex align-items-center justify-content-center'>
        <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
          <MDBCardBody className='px-5 text-center'>
            <h2 className='text-uppercase text-center mb-5'>Zaboravljena lozinka</h2>
            <MDBCardImage className='mb-4 text-center img-fluid' src={picture} alt='Katanac' />
            <form onSubmit={handleSubmit(handleSubmitForm)}>
              <Controller control={control} name="email" render={({ field: { onChange, onBlur } }) => (
                <MDBInput
                  title={errors.email}
                  wrapperClass="mb-4"
                  label="Email"
                  type="text"
                  size="lg"
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )} />
              <MDBBtn className="mt-4 mb-4 w-100 gradient-custom-4" size="lg" type="submit">
                Pošalji email
              </MDBBtn>
              <Link to="/" className="d-block text-center mt-3">Vrati se na početnu stranicu</Link>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
      <Footer></Footer>
    </>
  );
}

export default ForgotPassword;