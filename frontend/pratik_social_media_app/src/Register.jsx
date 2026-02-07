import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import TextField from "@mui/material/TextField";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import { registerUserAction } from "./Redux/Auth/auth.action";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Alert } from "@mui/material";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get auth state
  const { auth } = useSelector(store => store);
  const { loading, error, registerSuccess } = auth;
  const [submitted,setSubmitted]=useState(false)

  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    gender: ""
  };

  const validationSchema = Yup.object({
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    gender: Yup.string().required("Please select gender")
  });

  const handleSubmit = (values) => {
    const payload = {
      firstName: values.firstname,
      lastName: values.lastname,
      email: values.email,
      password: values.password,
      gender: values.gender
    };
    console.log("handleSubmit payload", payload);
    dispatch(registerUserAction({ data: payload }));
    setSubmitted(true)
  };

  // Handle successful registration
  useEffect(() => {
    if (registerSuccess) {
      // Clear any stored JWT (just in case)
      localStorage.removeItem("jwt");
      
      // Redirect to login after 1.5 seconds
      const timer = setTimeout(() => {
        navigate("/login");
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [registerSuccess, navigate]);

  return (
    <>
      {/* Show error message if registration fails */}
      {submitted&&error && (
        <Alert severity="error" className="mb-4">
          {typeof error === 'string' ? error : 'Registration failed. Please try again.'}
        </Alert>
      )}
      
      {/* Show success message */}
      {registerSuccess && (
        <Alert severity="success" className="mb-4">
          Registration successful! Redirecting to login...
        </Alert>
      )}
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form onChange={()=>setSubmitted(false)} className="space-y-1">
            <div className="space-y-3">
              <div>
                <Field
                  as={TextField}
                  name="firstname"
                  placeholder="First Name"
                  fullWidth
                  variant="outlined"
                />
                <ErrorMessage name="firstname" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <Field
                  as={TextField}
                  name="lastname"
                  placeholder="Last Name"
                  fullWidth
                  variant="outlined"
                />
                <ErrorMessage name="lastname" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <Field
                  as={TextField}
                  name="email"
                  placeholder="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <Field
                  as={TextField}
                  name="password"
                  placeholder="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <p className="mb-2 text-sm">Gender</p>
                <RadioGroup
                  row
                  name="gender"
                  value={values.gender}
                  onChange={(e) => setFieldValue("gender", e.target.value)}
                >
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                </RadioGroup>
                <ErrorMessage name="gender" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                disabled={loading || registerSuccess}
              >
                {loading ? <CircularProgress size={24} /> : "Register"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      
      <div className="flex gap-2 justify-center items-center pt-5">
        <p>If you already have account?</p>
        <Button onClick={() => navigate("/login")}>Login</Button>
      </div>
    </>
  );
};

export default Register;