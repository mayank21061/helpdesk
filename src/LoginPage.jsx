import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/LoginPage.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AccountCircleOutlined,
  Key,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
  };

  const VALIDATION_SCHEMA = Yup.object({
    username: Yup.string().trim().required("Username is required"),
    password: Yup.string().trim().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: (values) => {
      let formData = {
        ...values,
      };
      console.log(formData);
      navigate("/helpdesk");
    },
  });

  return (
    <div className="loginPage">
      <div className="inputBox">
        <div className="heading-image">
          <img
            src={`${process.env.PUBLIC_URL}/assets/costacloud.png`}
            alt="costacloud-logo"
            height={35}
          />
          <h1 className="login-heading">Helpdesk</h1>
        </div>

        <div>
          <form
            onSubmit={formik.handleSubmit}
            className="inputForm"
            action="submit"
          >
            <TextField
              fullWidth
              name="username"
              type="text"
              placeholder="Username"
              size="small"
              // label="Username"
              onChange={(e) => formik.setFieldValue("username", e.target.value)}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleOutlined className="textfieldIcons" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              name="password"
              type={showPassword ? "text" : "password"}
              size="small"
              // label="Password"
              placeholder="Password"
              onChange={(e) => formik.setFieldValue("password", e.target.value)}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Key className="textfieldIcons" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
            />
            <Button
              id="loginBtn"
              type="submit"
              variant="outlined"
              color="primary"
              fullWidth
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;