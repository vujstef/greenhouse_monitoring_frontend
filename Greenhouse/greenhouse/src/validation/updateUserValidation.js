import * as yup from 'yup';

export const useUpdateValidation = () => {
    return yup.object().shape({
        first_name: yup.string().nullable().matches(/^[A-Z]/, 'Prvo slovo mora biti veliko'),
        last_name: yup.string().nullable().matches(/^[A-Z]/, 'Prvo slovo mora biti veliko'),
        email: yup.string().email("Email nije validan!"),
        password: yup.string().min(8, 'Lozinka mora imati najmanje 8 karaktera'),
        password_confirmation: yup.string().oneOf([yup.ref('password'), null], 'Lozinke se moraju poklapati'),
    })
}