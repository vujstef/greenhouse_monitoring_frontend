import * as yup from 'yup';

export const useCreateGreenhouseValidation = () => {
    return yup.object().shape({
        name: yup.string().matches(/^[A-Z]/, 'Prvo slovo mora biti veliko.').required("Obavezno polje za ime plastenika."),
        description: yup.string().matches(/^[A-Z]/, 'Prvo slovo mora biti veliko.').required("Obavezno polje za opis."),
    })
}