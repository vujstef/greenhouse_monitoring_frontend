import * as yup from 'yup';

export const useThingspeakValidation = () => {
    return yup.object().shape({
        channel_id: yup.string().required("Obavezno polje za ime plastenika."),
        read_key: yup.string().required("Obavezno polje za ključ za čitanje."),
        write_key: yup.string().required("Obavezno polje za ključ za upisivanje."),
    })
}