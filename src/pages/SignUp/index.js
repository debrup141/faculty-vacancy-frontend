import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/features/auth/authSlice";
import { addToast } from "../../redux/features/toast/toastSlice";

import { Formik, Form, useField } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AccountCircle from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { BASE_URL, configToken } from "../../utils/api";

const theme = createTheme();

const MyTextInput = (props) => {
  const [field, meta] = useField(props);

  if (props.name === "isOpenToWork") {
    return (
      <FormGroup>
        <FormControlLabel
          control={<Checkbox {...props} {...field} />}
          labelPlacement="end"
          label="Open to Work ?"
        />
      </FormGroup>
    );
  } else {
    return (
      <>
        <TextField
          {...field}
          {...props}
          margin="dense"
          size="small"
          fullWidth
          helperText={meta.touched && meta.error ? meta.error : null}
          error={meta.touched && Boolean(meta.error)}
        />
      </>
    );
  }
};

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isAdmin, isLoggedIn } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("This field is required!"),
    lastName: Yup.string().required("This field is required!"),

    email: Yup.string()
      .email("Invalid email address!")
      .required("This field is required!"),

    dob: Yup.date("Select a valid Date!")
      .max(new Date(), "DOB can not be in future!")
      .required("This field is required!"),

    password: Yup.string()
      .min(8, "Password should be of minimum 8 characters in length.")
      .required("This field is required!"),

    confirmPassword: Yup.string()
      .required("This field is required!")
      .oneOf([Yup.ref("password")], "Password does not match!"),
  });

  const handleSubmit = (values, resetForm) => {
    console.log(values);
    dispatch(setLoading(true));
    axios
      .post(`${BASE_URL}users/register`, values, configToken())
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          resetForm();
          dispatch(setLoading(false));
          dispatch(
            addToast({
              type: "success",
              message: "Your account is created successfully!",
            })
          );
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(setLoading(false));
        dispatch(
          addToast({
            type: "error",
            message: "Could not create your account. Please try again!",
          })
        );
      });
  };

  if(isLoggedIn && !isAdmin){
    return <Navigate to="/vacancy" replace />;
  }

  else if(isLoggedIn && isAdmin){
    return <Navigate to="/admin/vacancy" replace />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container
        component={Paper}
        maxWidth="xs"
        sx={{ backgroundColor: "white", py: 1, my: 6, borderRadius: 5 }}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 4,
            marginBottom: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                dob: "",
                password: "",
                confirmPassword: "",
                isOpenToWork: false,
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) =>
                handleSubmit(values, resetForm)
              }
            >
              <Form>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={6}>
                    <MyTextInput
                      label="First Name"
                      name="firstName"
                      type="text"
                      id="firstName"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <AccountCircle fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MyTextInput
                      label="Last Name"
                      name="lastName"
                      type="text"
                      id="lastName"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <AccountCircle fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MyTextInput
                      label="Email Address"
                      name="email"
                      type="email"
                      id="email"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <EmailIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MyTextInput
                      label="Date of Birth"
                      name="dob"
                      type="date"
                      id="dob"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <MyTextInput
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff fontSize="small" />
                              ) : (
                                <Visibility fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <MyTextInput
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff fontSize="small" />
                              ) : (
                                <Visibility fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MyTextInput name="isOpenToWork" id="isOpenToWork" />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading ? true : false}
                  sx={{ mt: 1, mb: 2 }}
                >
                  {isLoading ? (
                    <CircularProgress color="primary" size={25} />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </Form>
            </Formik>

            <Grid container>
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  {"Already have an account? Login"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
