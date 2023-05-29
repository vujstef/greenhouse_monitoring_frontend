import * as yup from 'yup';

export const useWriteConfigurationAndManagementDataValidation = () => {
    return yup.object().shape({
        min_air_temp: yup.number().nullable().positive(),
        min_wind_speed: yup.number().nullable().positive(),
        max_soil_temp: yup.number().nullable().positive(),
        max_soil_humidity: yup.number().nullable().positive(),
        opening_command: yup.number().nullable().oneOf([1]),
        closing_command: yup.number().nullable().oneOf([2]),
        filling_command: yup.number().nullable().oneOf([3]),
        emptying_command: yup.number().nullable().oneOf([4]),
        remote_mode: yup.number().nullable().oneOf([0, 1]),
    })
}