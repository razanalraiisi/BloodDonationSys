import * as yup from "yup";

export const UserRegisterSchemaValidation = yup.object().shape({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(3, "Full name must be at least 3 characters")
    .max(40, "Full name cannot exceed 40 characters")
    .matches(/^[A-Za-z\s]+$/, "Full name can only contain letters"),

  email: yup
    .string()
    .email("Not a valid email format")
    .required("Email is required")
    .transform((value) => value?.toLowerCase())
    .test(
      "unique-email",
      "Email is already registered",
      async function (value) {
        if (!value) return true;
        try {
          const res = await fetch(
            "https://blooddonationsys.onrender.com/users/check-email/" + value
          );
          const data = await res.json();
          return data.exists === false;
        } catch (e) {
          return this.createError({
            message: "Unable to validate email. Try again.",
          });
        }
      }
    ),

  password: yup
    .string()
    .required("Password is required")
    .min(4, "Minimum 4 characters required")
    .max(8, "Maximum 8 characters allowed"),

  bloodType: yup
    .string()
    .required("Blood type is required")
    .oneOf(
      ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
      "Invalid blood type"
    ),

  dob: yup
    .string()
    .required("Date of birth is required")
    .test("age-check", "You must be at least 17 years old", function (value) {
      if (!value) return false;
      const dob = new Date(value);
      const today = new Date();
      const minAge = new Date(
        today.getFullYear() - 17,
        today.getMonth(),
        today.getDate()
      );
      return dob <= minAge;
    }),

  city: yup
    .string()
    .required("City is required")
    .min(2, "City should have at least 2 characters"),

  gender: yup.string().required("Gender is required"),

  medicalHistory: yup
    .string()
    .max(400, "Medical history cannot exceed 400 characters")
    .optional(),
});
