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
import { useNavigate } from "react-router-dom";
import useStore from "../Store/store.ts";

const SignUp = () => {
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const navigate = useNavigate();
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { setAccountSuccess } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const enteredName = e.target[0].value;
    const enteredUsername = e.target[1].value;
    const enteredPassword = e.target[2].value;

    setUsername(enteredUsername);
    setPassword(enteredPassword);
    setName(enteredName);

    setUsernameError(false);
    setPasswordError(false);

    if (
      enteredUsername.length > 50 ||
      enteredUsername.length < 5 ||
      !validateEmail(enteredUsername)
    ) {
      setUsernameError(true);
    }
    if (enteredPassword.length > 20 || enteredPassword.length < 5) {
      setPasswordError(true);
    }

    if (usernameError || passwordError) {
      return;
    }

    try {
      let response = await axios.post("http://localhost:3009/api/user", {
        name: name,
        email: username,
        password: password,
      });

      if (response.status === 200) {
        navigate("/login");
        setAccountSuccess(true);
      }
    } catch (error) {
      if (error.response.status === 400 || error.response.status === 500) {
        setErrorMessage(error.response.data);
      }
    }
  };

  const googleSign = async () => {
    window.open("http://localhost:3009/api/user/google/auth", "_self");
  };

  return (
    <div>
      {errorMessage !== "" && (
        <Alert status="error" variant="subtle">
          <AlertIcon />
          <AlertTitle>{errorMessage}</AlertTitle>
          <CloseButton
            position="absolute"
            right="8px"
            top="8px"
            onClick={() => setErrorMessage("")}
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
                Create an account to get started
              </Text>

              <Button
                onClick={googleSign}
                width="100%"
                bgGradient="linear(to-r, red.500, yellow.500)"
                color="white"
                _hover={{ bgGradient: "linear(to-r, red.400, yellow.400)" }}
              >
                Sign up with Google
              </Button>

              <form onSubmit={(e) => handleSubmit(e)}>
                <Input
                  type="text"
                  placeholder="Name"
                  borderRadius="full"
                  background="gray.100"
                  mb={3}
                  p={5}
                  required
                />
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
                  Sign up
                </Button>

                <Link to="/login">
                  <Text fontSize="sm" color="gray.500" mt={4}>
                    Already have an account? Log in here.
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

export default SignUp;
