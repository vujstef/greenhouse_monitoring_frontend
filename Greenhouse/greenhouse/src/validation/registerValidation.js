import * as yup from 'yup';

export const useRegisterValidation = () => {
    return yup.object().shape({
        first_name: yup.string().matches(/^[A-Z]/, 'Prvo slovo mora biti veliko').required("Obavezno polje za ime"),
        last_name: yup.string().matches(/^[A-Z]/, 'Prvo slovo mora biti veliko').required("Obavezno polje za prezime"),
        email: yup.string().email("Email nije validan!").required("Obavezno polje za email"),
        password: yup.string().min(8, 'Lozinka mora imati najmanje 8 karaktera').required("Obavezno polje za lozinku"),
        password_confirmation: yup.string().oneOf([yup.ref('password'), null], 'Lozinke se moraju poklapati').required('Obavezno polje potvrda lozinke'),
        role: yup.string().oneOf(['korisnik', 'admin'], 'Morate odabrati tip korisnika').required('Morate odabrati tip korisnika')
    })
}