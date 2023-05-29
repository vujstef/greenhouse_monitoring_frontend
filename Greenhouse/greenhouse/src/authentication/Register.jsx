import React from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput, } from 'mdb-react-ui-kit';
import image from '../images/slika.png';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Footer from './Footer';
import { useRegisterValidation } from '../validation/registerValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useForm, Controller } from "react-hook-form";
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';


const Register = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(useRegisterValidation()) });

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
    if (errors.role?.message) {
      toast.error(errors.role.message)
    }
  }, [errors])

  const handleSubmitForm = async (formData) => {
    try {
      const response = await axiosInstance.post('/Greenhouse/register', formData)
      toast.success("Uspješno ste se registrovali.", { autoClose: 1500 })
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      if (error.response) {
        toast.error("Došlo je do greške. Pokušajte ponovo. Email vec postoji.")
      }
      else {
        toast.error("Došlo je do greške. Pokušajte ponovo. ")
      }
    }
  }

  return (
    <>
      <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image' style={{ backgroundImage: `url(${image})` }}>
        <div className='mask gradient-custom-3'></div>
        <ToastContainer />
        <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
          <MDBCardBody className='px-5'>
            <h2 className="text-uppercase text-center mb-5">Registracija</h2>
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

            <Box sx={{ minWidth: 120 }}>
              <Controller
                control={control}
                name="role"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Tip korisnika</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="tipKorisnika"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                    >
                      <MenuItem value={'korisnik'}>Korisnik</MenuItem>
                      <MenuItem value={'admin'}>Administrator</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
            
            <MDBBtn className='mt-4 mb-4 w-100 gradient-custom-4' size='lg' onClick={handleSubmit(handleSubmitForm)}>Registruj se</MDBBtn>
            <Link to="/" className="d-block text-center mt-3">Vrati se na početnu stranicu</Link>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
      <Footer></Footer>
    </>
  );
}

export default Register