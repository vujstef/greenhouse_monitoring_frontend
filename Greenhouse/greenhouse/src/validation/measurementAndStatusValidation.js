import * as yup from 'yup';

export const useMeasurementAndStatusValidation = () => {
    return yup.object().shape({
        air_temperature: yup.boolean().default(false),
        relative_air_humidity: yup.boolean().default(false),
        soil_temperature: yup.boolean().default(false),
        relative_humidity_of_the_soil: yup.boolean().default(false),
        lighting_intensity: yup.boolean().default(false),
        outside_air_temperature: yup.boolean().default(false),
        wind_speed: yup.boolean().default(false),
        water_level: yup.boolean().default(false),
        opening: yup.boolean().default(false),
        closing: yup.boolean().default(false),
        opened: yup.boolean().default(false),
        closed: yup.boolean().default(false),
        filling: yup.boolean().default(false),
        emptying: yup.boolean().default(false),
        full: yup.boolean().default(false),
        empty: yup.boolean().default(false),
        remote_mode: yup.boolean().default(false),
    })
}
