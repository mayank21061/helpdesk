import {
  Backdrop,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
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
import CryptoJS from "crypto-js";
import Axios from "axios";
import { useContext } from "react";
import { HelpdeskContext } from "./ChatContext";

const LoginPage = () => {
  const { setUsername, loading, setLoading } = useContext(HelpdeskContext);
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

  const encryptFun = ({ password, username }) => {
    var keybefore = username + "appolocomputers";
    var ivbefore = username + "costacloud012014";
    var key = CryptoJS.enc.Latin1.parse(keybefore.substring(0, 16));
    var iv = CryptoJS.enc.Latin1.parse(ivbefore.substring(0, 16));
    var ciphertext = CryptoJS.AES.encrypt(password, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
    }).toString();
    return ciphertext;
  };
  const handleSubmit = async (data) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        clientAddress: "hi",
      };
      const credentials = {
        username: formik.values.username,
        password: encryptFun(data),
        keycloak: process.env.REACT_APP_KEYCLOAK,
        client_id: process.env.REACT_APP_CLIENT_ID,
      };
      await fetch(`http://11.0.0.118:9090/auth/token`, {
        method: "POST",
        headers: {
          ...headers,
        },
        body: JSON.stringify(credentials),
      })
        .then(async (response) => {
          if (response.status === 200) {
            const login = await response.json();
            sessionStorage.setItem("jwt_token", login.access_token);
            sessionStorage.setItem("sessionId", login.session_state);
            localStorage.setItem("refresh_token", login.refresh_token);
            localStorage.setItem(
              "client_id",
              window.__ENV__.REACT_APP_CLIENT_ID
            );
            localStorage.setItem("expires_in", login.expires_in);
            localStorage.setItem("username", formik.values.username);
            setUsername(formik.values.username);
            navigate("/helpdesk");
            console.log("came here");
          } else if (!navigator.onLine) {
            alert("Please connect to internet");
          } else {
            alert("Please enter correct username and password");
          }
        })
        .catch((e) => {
          console.log(e);
          localStorage.clear();
        });
    } catch (e) {
      localStorage.clear();
      console.log(e);
    }
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: handleSubmit,
  });

  let Prime_No, Primitive, Private_Key_A, Secret_A, Shared_Secret;

  const power = (a, b, p) => {
    if (b == 1) return a;
    else return Math.pow(a, b) % p;
  };
  useEffect(() => {
    setInterval(() => {
      handleRefreshToken();
    }, 400000);

    formik.values.username && handleRefreshToken();
  }, []);

  useEffect(() => {
    Prime_No = process.env.REACT_APP_PRIME_NO;
    Primitive = process.env.REACT_APP_PRIMITIVE;
    Private_Key_A = Math.floor(Math.random() * (10 - 1 + 1) + 1);
    Secret_A = power(Primitive, Private_Key_A, Prime_No);
  }, []);

  const handleRefreshToken = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      const data = JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: localStorage.getItem("refresh_token"),
        keycloak: window.__ENV__.REACT_APP_KEYCLOACK,
        client_id: localStorage.getItem("client_id"),
      });
      const login = await Axios.post(
        "http://11.0.0.118:9090/auth/refresh-token",
        data,
        { headers }
      );

      if (login.status === 200) {
        const { data } = login;
        sessionStorage.setItem("jwt_token", data.access_token);
        sessionStorage.setItem("sessionId", data.session_state);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("client_id", window.__ENV__.REACT_APP_CLIENT_ID);
        localStorage.setItem("expires_in", data.expires_in);
        navigate("/helpdesk");
      }
    } catch (error) {
      localStorage.clear();
    }
  };

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
            {/* <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
