import * as yup from 'yup';

export const useResetPasswordValidation = () => {
    return yup.object().shape({
        email: yup.string().email("Email nije validan!").required("Obavezno polje za email"),
        password: yup.string().min(8, 'Lozinka mora imati najmanje 8 karaktera').required("Obavezno polje za lozinku"),
        password_confirmation: yup.string().oneOf([yup.ref('password'), null], 'Lozinke se moraju poklapati').required('Obavezno polje potvrda lozinke'),
    })
}