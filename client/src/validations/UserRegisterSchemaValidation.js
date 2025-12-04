import * as yup from "yup";

export const UserRegisterSchemaValidation = yup.object().shape({
  fullName: yup.string().required("Full name is required"),

  email: yup
    .string()
    .email("Not a valid email format")
    .required("Email is required"),

  password: yup
    .string()
    .min(4, "Minimum 4 characters required")
    .max(8, "Maximum 8 characters allowed")
    .required("Password is required"),

  bloodType: yup.string().required("Blood type is required"),

  dob: yup.string().required("Date of birth is required"),

  city: yup.string().required("City is required"),

  gender: yup.string().required("Gender is required"),

  medicalHistory: yup.string().optional(),
});
