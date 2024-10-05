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
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

const LoginPage = () => {
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredUsername = e.target[0].value; // Username from the form input
    const enteredPassword = e.target[1].value;
    console.log("Login button clicked");
    setUsername(enteredUsername);
    setPassword(enteredPassword);

    setUsernameError(false);
    setPasswordError(false);

    if (
      enteredUsername.length > 20 ||
      enteredUsername.length < 5 ||
      !validateEmail(enteredUsername)
    ) {
      setUsernameError(true);
    }
    if (enteredPassword.length > 20 || enteredPassword.length < 5) {
      setPasswordError(true);
    }
  };

  if (!usernameError && !passwordError) {
    //enter post request to backend
    let response = axios.post("http://localhost:3009/api/login", {});
  }

  return (
    <div>
      <Grid
        templateRows="80px 1fr" // Navbar and content layout
        templateColumns="1fr"
        minHeight="100vh" // Full height for the page
        width="100vw" // Full width for the page
        bgGradient="linear(to-r, teal.500, blue.500)"
      >
        {/* Navbar */}
        <GridItem>
          <Navbar />
        </GridItem>

        {/* Main content */}
        <GridItem display="flex" justifyContent="center" alignItems="center">
          <Box
            bg="rgba(0, 0, 0, 0.7)" // Semi-transparent background
            borderRadius="md"
            p={8}
            maxW="500px"
            textAlign="center"
            boxShadow="xl"
          >
            <VStack spacing={6}>
              {/* Welcome Message */}
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="white"
                lineHeight="shorter"
                letterSpacing="wide"
              >
                Welcome to the Movie Database
              </Text>

              {/* Subtext */}
              <Text fontSize="lg" color="gray.300">
                Login to get started
              </Text>
              <form onSubmit={(e) => handleSubmit(e)}>
                <Input
                  type="text"
                  placeholder="Username"
                  borderRadius="full"
                  background={"white"}
                  mb={2} // Reduced margin-bottom for spacing between input fields
                  min={5}
                  max={20}
                  required
                  isInvalid={usernameError}
                />
                {usernameError && (
                  <Text color="red.500" mt={0}>
                    {" "}
                    {/* Removed margin */}
                    Please enter a valid username between 5 and 20 characters
                  </Text>
                )}

                <Input
                  type="text"
                  placeholder="Password"
                  borderRadius="full"
                  background={"white"}
                  mb={2} // Reduced margin-bottom for spacing between input fields
                  min={5}
                  max={20}
                  required
                  isInvalid={passwordError}
                />
                {passwordError && (
                  <Text color="red.500" mt={0}>
                    {" "}
                    {/* Removed margin */}
                    Please enter a valid password between 5 and 20 characters
                  </Text>
                )}

                {/* Login Button */}
                <Button
                  type="submit"
                  size="lg"
                  colorScheme="teal"
                  borderRadius="full"
                  _hover={{ bg: "teal.400", transform: "scale(1.05)" }} // Modern hover effect
                  px={10}
                  py={6}
                >
                  Login
                </Button>
                <Link to="/signup">
                  <Text fontSize="sm" color="gray.300" mt={2}>
                    Don't have an account?
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
