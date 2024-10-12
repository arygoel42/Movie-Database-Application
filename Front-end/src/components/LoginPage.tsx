import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import {
  Grid,
  GridItem,
  Text,
  Button,
  Box,
  VStack,
  Input,
  Alert,
  AlertTitle,
  AlertIcon,
  CloseButton,
  AlertDescription,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import useStore from "../Store/store.ts";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  let hasError = false;
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { LoginSuccess, setLoginSuccess, AccountSuccess, setAccountSuccess } =
    useStore();

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    setErrorMessage("");
    e.preventDefault();
    const enteredUsername = e.target[0].value; // Username from the form input
    const enteredPassword = e.target[1].value;
    console.log("Login button clicked");
    setUsername(enteredUsername);
    setPassword(enteredPassword);

    setUsernameError(false);
    setPasswordError(false);

    if (
      enteredUsername.length > 40 ||
      enteredUsername.length < 5 ||
      !validateEmail(enteredUsername)
    ) {
      setUsernameError(true);
      hasError = true;
    }
    if (enteredPassword.length > 40 || enteredPassword.length < 5) {
      setPasswordError(true);
      hasError = true;
    }

    if (hasError) {
      return;
    }
    try {
      let response = await axios.post("http://localhost:3009/api/auth", {
        email: enteredUsername,
        password: enteredPassword,
      });
      hasError = false;

      if (response.status === 200) {
        const token = await response.headers["x-auth-token"];

        if (token) {
          localStorage.setItem("x-auth-token", token);

          navigate("/");
          setAccountSuccess(true);
        } else {
          setErrorMessage("Login failed. Please try again.");
        }
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data);
        console.log("Login failed:", error.response.data);
      } else {
        setErrorMessage(
          "An unexpected error occurred. Please try again later."
        );
      }
    }
  };

  const googleSign = async () => {
    window.open("http://localhost:3009/api/user/google/auth", "_self");
  };

  return (
    <div>
      {AccountSuccess && (
        <Alert status="success" variant="subtle">
          <AlertIcon />
          <AlertTitle>Account Created!</AlertTitle>
          <AlertDescription>Welcome to the Movie Database</AlertDescription>
          <CloseButton
            position="absolute"
            right="8px"
            top="8px"
            onClick={() => setAccountSuccess(false)}
          />
        </Alert>
      )}
      {errorMessage !== "" && (
        <Alert status="error" variant="subtle">
          <AlertIcon />
          <AlertTitle>{errorMessage}</AlertTitle>
          <CloseButton
            position="absolute"
            right="8px"
            top="8px"
            onClick={() => setLoginSuccess(false)}
          />
        </Alert>
      )}

      <Grid
        templateRows="80px 1fr"
        templateColumns="1fr"
        minHeight="100vh"
        width="100vw"
        bgGradient="linear(to-r, teal.600, blue.600)"
      >
        {/* Navbar */}
        <GridItem>
          <Navbar />
        </GridItem>

        {/* Main content */}
        <GridItem display="flex" justifyContent="center" alignItems="center">
          <Box
            bg="white"
            borderRadius="lg"
            p={10}
            maxW="500px"
            boxShadow="lg"
            transition="0.3s ease-in-out"
            _hover={{ boxShadow: "2xl", transform: "translateY(-5px)" }}
            textAlign="center"
          >
            <VStack spacing={6}>
              {/* Welcome Message */}
              <Text
                fontSize="3xl"
                fontWeight="bold"
                color="teal.700"
                letterSpacing="wider"
              >
                Welcome to Movie Database
              </Text>

              {/* Subtext */}
              <Text fontSize="lg" color="gray.600">
                Login to get started
              </Text>

              <Button
                onClick={googleSign}
                width="100%"
                bgGradient="linear(to-r, red.500, yellow.500)"
                color="white"
                _hover={{ bgGradient: "linear(to-r, red.400, yellow.400)" }}
              >
                Sign in with Google
              </Button>

              <form onSubmit={(e) => handleSubmit(e)}>
                <Input
                  type="email"
                  placeholder="Email"
                  borderRadius="full"
                  background="gray.100"
                  mb={3}
                  p={5}
                  required
                  isInvalid={usernameError}
                />
                {usernameError && (
                  <Text color="red.500" fontSize="sm">
                    Please enter a valid email.
                  </Text>
                )}

                <Input
                  type="password"
                  placeholder="Password"
                  borderRadius="full"
                  background="gray.100"
                  mb={3}
                  p={5}
                  required
                  isInvalid={passwordError}
                />
                {passwordError && (
                  <Text color="red.500" fontSize="sm">
                    Please enter a valid password.
                  </Text>
                )}

                <Button
                  type="submit"
                  size="lg"
                  colorScheme="teal"
                  borderRadius="full"
                  width="100%"
                  _hover={{ bg: "teal.400", transform: "scale(1.05)" }}
                  px={10}
                  py={6}
                  mt={4}
                >
                  Login
                </Button>

                <Link to="/signup">
                  <Text fontSize="sm" color="gray.500" mt={4}>
                    Don't have an account? Sign up here.
                  </Text>
                </Link>
              </form>
            </VStack>
          </Box>
        </GridItem>
      </Grid>
    </div>
  );
};

export default LoginPage;
