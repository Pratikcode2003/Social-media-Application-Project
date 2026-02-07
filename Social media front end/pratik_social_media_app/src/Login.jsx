import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import TextField from "@mui/material/TextField";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux"; // Added useSelector
import { loginUserAction } from "./Redux/Auth/auth.action";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material"; // For loading indicator

const Login = () => {
  const initialValues = { email: "", password: "" };
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get auth state from Redux
  const { auth } = useSelector(store => store);
  const { loading, error } = auth;
  const [submitted, setSubmitted] = useState(false);


  const handleSubmit = (values) => {
    setSubmitted(true);
    dispatch(loginUserAction({ data: values }));
  };


  return (
    <>
      {/* Display error message from Redux */}
      {submitted && error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {typeof error === 'string' ? error : 'Invalid email or password'}
        </div>
      )}

      <Formik
        onSubmit={handleSubmit}
        validationSchema={validationSchema} // Uncommented validation
        initialValues={initialValues}
      >
        {({ isSubmitting }) => (
          <Form onChange={()=>setSubmitted(false)} className="space-y-5">
            <div className="space-y-5">
              <div>
                <Field
                  as={TextField}
                  name="email"
                  placeholder="Email"
                  type="email"
                  variant="outlined" // Fixed typo: "varient" to "variant"
                  fullWidth
                  error={false}
                />
                <ErrorMessage
                  name="email"
                  component={"div"}
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Field
                  as={TextField}
                  name="password"
                  placeholder="Password"
                  type="password"
                  variant="outlined" // Fixed typo
                  fullWidth
                />
                <ErrorMessage
                  name="password"
                  component={"div"}
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <Button
                sx={{ padding: ".8rem 0rem" }}
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Login"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <div className="flex gap-2 justify-center items-center pt-5">
        <p>If don't have account?</p>
        <Button onClick={() => navigate("/register")}>REGISTER</Button>
      </div>
    </>
  );
};

export default Login;