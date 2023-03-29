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

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithRedirect(auth, provider);

    if (auth) {
      navigate("/");
    }
  };

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
    } catch (err) {
      navigate("/error", {
        state: {
          status: err.response?.status,
          text: err.response?.statusText,
          message: err.response?.data?.message,
        },
      });
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

  const showRegister = (e) => {
    e.preventDefault();
    setRegister(true);
  };

  const showLocalLogin = (e) => {
    e.preventDefault();
    setLogin(true);
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
    <Container data-testid="login-container">
      <Title>The Beat</Title>
      <Main>
        <Message data-pt="message">
          {message || "Press Login Button to Start"}
        </Message>
        <LoginContainer>
          <ActionButton type="button" onClick={handleGoogleLogin}>
            Google Social Login
          </ActionButton>
          <ActionButton
            type="button"
            onClick={showLocalLogin}
            data-pt="login-button"
          >
            User Login
          </ActionButton>
          <ActionButton
            type="button"
            onClick={showRegister}
            data-pt="register-button"
          >
            User Register
          </ActionButton>
          {(login || register) && (
            <Modal>
              <FormContainer
                onSubmit={register ? handleRegister : handleLocalLogin}
              >
                {register ? (
                  <FormInput
                    type="text"
                    placeholder="이름"
                    value={name}
                    name="name"
                    onChange={handleInput}
                    required
                    data-pt="register-name"
                  />
                ) : null}
                <FormInput
                  type="email"
                  placeholder="이메일"
                  value={email}
                  name="email"
                  onChange={handleInput}
                  required
                  data-pt={register ? "register-email" : "login-email"}
                />
                <FormInput
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  name="password"
                  onChange={handleInput}
                  required
                  data-pt={register ? "register-password" : "login-password"}
                />
                <SubmitButton type="submit" data-pt="submit-button">
                  {register ? "Register" : "Login"}
                </SubmitButton>
                <SubmitButton
                  type="button"
                  onClick={() =>
                    register ? setRegister(false) : setLogin(false)
                  }
                >
                  나가기
                </SubmitButton>
              </FormContainer>
            </Modal>
          )}
        </LoginContainer>
      </Main>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-image: url("login.png");
  background-size: cover;
  background-position: center;
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5em;
  color: white;
`;

const Main = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 25%;
  width: 100%;
  align-items: center;
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

const LoginContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 50%;
  align-items: center;
`;

const ActionButton = styled.button`
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

const FormContainer = styled.form`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  width: 40vw;
  height: 70vh;
`;

const FormInput = styled.input`
  margin: 0 0 20px 0;
  padding: 10px;
  width: 80%;
  height: 10%;
  background-color: #f0f0f0;
  border-style: hidden;
  border-radius: 5px;
  box-shadow: inset -3px -3px 7px #d9d9d9,
    inset 3px 3px 7px rgba(255, 255, 255, 0.5);
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  width: 80%;
  height: 15%;
  background-color: #f0f0f0;
  border-style: hidden;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.3), -3px -3px 7px #ffffff;
`;
