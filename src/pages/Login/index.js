import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, signIn } from "../../redux/features/auth/authSlice";
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
import IconButton from "@mui/material/IconButton";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { BASE_URL, configToken } from "../../utils/api";

const theme = createTheme();

const MyTextInput = (props) => {
  const [field, meta] = useField(props);
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
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isLoggedIn, isAdmin, isSuperAdmin } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = (values, resetForm) => {
    console.log(values);
    dispatch(setLoading(true));
    axios
      .post(`${BASE_URL}users/login`, values, configToken())
      .then((res) => {
        if (res.data.error) {
          dispatch(setLoading(false));
          dispatch(addToast({ type: "error", message: res.data.error }));
        } else {
          console.log(res.data);
          dispatch(setLoading(false));
          dispatch(signIn(res.data));
          resetForm();
          dispatch(
            addToast({ type: "success", message: "Successfully logged in!" })
          );
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(setLoading(false));
        dispatch(addToast({ type: "error", message: err.error }));
      });
  };

  if (isLoggedIn && !isAdmin) {
    return <Navigate to="/vacancy" replace />;
  } else if (isLoggedIn && isAdmin) {
    return <Navigate to="/admin/vacancy" replace />;
  } else if (isLoggedIn && isSuperAdmin) {
    return <Navigate to="/superadmin/dashboard" replace />;
  }

  return (
    <div className="hero-container">
      <ThemeProvider theme={theme}>
        <Container
          component={Paper}
          maxWidth="xs"
          sx={{ backgroundColor: "white", py: 1, my: 10, borderRadius: 5 }}
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
              Login
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                }}
                validationSchema={Yup.object({
                  email: Yup.string()
                    .email("Invalid email address!")
                    .required("This field is required!"),
                  password: Yup.string()
                    .min(8, "Password is minimum 8 characters in length.")
                    .required("This field is required!"),
                })}
                onSubmit={(values, { resetForm }) =>
                  handleSubmit(values, resetForm)
                }
              >
                <Form>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <MyTextInput
                        label="Email Address"
                        id="email"
                        name="email"
                        type="email"
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
                  </Grid>

                  {/* <Grid container>
                  <Grid item xs>
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      Forgot password?
                    </Link>
                  </Grid>
                </Grid> */}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading ? true : false}
                    sx={{ mt: 3, mb: 2 }}
                  >
                    {isLoading ? (
                      <CircularProgress color="primary" size={25} />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </Form>
              </Formik>

              <Grid container>
                <Grid item xs={12} style={{ textAlign: "center" }}>
                  <Link to="/signup" style={{ textDecoration: "none" }}>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
                <Grid item xs={12} style={{ textAlign: "center" }}>
                  <Link to="/admin/login" style={{ textDecoration: "none" }}>
                    {"Admin Login"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default Login;
