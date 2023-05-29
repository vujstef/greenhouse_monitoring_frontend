import * as yup from 'yup';

export const useLoginValidation = () => {
    return yup.object().shape({
        email: yup.string().email("Email nije validan!").required("Obavezno polje za email"),
        password: yup.string().min(8, 'Lozinka mora imati najmanje 8 karaktera').required("Obavezno polje za lozinku"),
    })
}