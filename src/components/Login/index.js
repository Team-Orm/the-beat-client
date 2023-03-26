import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import axios from "axios";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../../features/api/firebaseApi";
import Modal from "../Modal";

export default function Login() {
  const navigate = useNavigate();
  const [register, setRegister] = useState(false);
  const [login, setLogin] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/users/local/register`,
        {
          displayName: name,
          uid: email,
          password,
          photoURL: "default.png",
        },
      );

      if (response.status === 201) {
        setRegister(false);
        setMessage("유저가 등록 되었습니다.");
      }
    } catch (error) {
      alert("Error signing in with email and password:", error);
    }
  };

  const handleLocalLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/users/local/login`,
        {
          uid: email,
          password,
        },
      );

      if (response.status === 201) {
        setLogin(false);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("jwt", response.data.user.token);
        return navigate("/");
      }
    } catch (error) {
      alert("Error signing in with email and password:", error);
    }
  };

  const showRegister = async (e) => {
    e.preventDefault();
    setRegister(true);
  };

  const showLogin = async (e) => {
    e.preventDefault();
    setLogin(true);
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithRedirect(auth, provider);

    if (auth) {
      navigate("/");
    }

    return true;
  };

  const handleInput = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (auth.currentUser || user) {
      navigate("/");
    }
  }, [auth.currentUser, navigate]);

  return (
    <LoginContainer data-testid="login-container">
      <Title>The Beat</Title>
      <BottomContainer>
        <Message data-pt="message">
          {message || "Press Login Button to Start"}
        </Message>
        <Local>
          <LoginButton type="button" onClick={handleLogin}>
            Google Social Login
          </LoginButton>
          <LoginButton type="button" onClick={showLogin} data-pt="login-button">
            User Login
          </LoginButton>
          <LoginButton
            type="button"
            onClick={showRegister}
            data-pt="register-button"
          >
            User Register
          </LoginButton>
          {(login || register) && (
            <Modal>
              <RegisterForm
                onSubmit={register ? handleRegister : handleLocalLogin}
              >
                {register ? (
                  <Input
                    type="text"
                    placeholder="이름"
                    value={name}
                    name="name"
                    onChange={handleInput}
                    required
                    data-pt="register-name"
                  />
                ) : null}
                <Input
                  type="email"
                  placeholder="이메일"
                  value={email}
                  name="email"
                  onChange={handleInput}
                  required
                  data-pt={register ? "register-email" : "login-email"}
                />
                <Input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  name="password"
                  onChange={handleInput}
                  required
                  data-pt={register ? "register-password" : "login-password"}
                />
                <Button type="submit" data-pt="submit-button">
                  {register ? "Register" : "Login"}
                </Button>
              </RegisterForm>
            </Modal>
          )}
        </Local>
      </BottomContainer>
    </LoginContainer>
  );
}

const LoginContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-image: url("login.png");
  background-size: cover;
  background-position: center;
`;

const Input = styled.input`
  background-color: #f0f0f0;
  border: none;
  outline: none;
  padding: 10px;
  height: 10%;
  width: 80%;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: inset -3px -3px 7px #d9d9d9,
    inset 3px 3px 7px rgba(255, 255, 255, 0.5);
`;

const Button = styled.button`
  height: 15%;
  width: 80%;
  background-color: #f0f0f0;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.3), -3px -3px 7px #ffffff;
`;

const RegisterForm = styled.form`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  width: 40vw;
  height: 70vh;
`;

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 25%;
  width: 100%;
  align-items: center;
`;

const Local = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 50%;
  align-items: center;
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5em;
  color: white;
`;

const Message = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5em;
  color: white;
  animation: blink 1.75s infinite;

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
`;

const LoginButton = styled.button`
  width: 15vw;
  height: 10vh;
  background-color: transparent;
  border-radius: 10px;
  border: 3px solid rgba(255, 255, 255, 0.5);
  font-size: 2em;
  color: white;

  :hover {
    color: skyBlue;
    border: 3px solid skyBlue;
  }
`;
