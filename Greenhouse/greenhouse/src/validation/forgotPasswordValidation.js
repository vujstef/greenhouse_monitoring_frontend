import * as yup from 'yup';

export const useforgotPasswordValidation = () => {
    return yup.object().shape({
        email: yup.string().email("Email nije validan!").required("Obavezno polje za email."),
    })
}