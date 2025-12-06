import * as yup from 'yup';

export const UserSchemaValidation = yup.object().shape({
    email: yup
        .string()
        .email('Invalid email format! Please use example@mail.com')
        .required('Email is required.'),
    password: yup
        .string()
        .required('Password is required.')
        .min(4, 'Password must be at least 4 characters.')
        .max(8, 'Password cannot exceed 8 characters.'),
});
