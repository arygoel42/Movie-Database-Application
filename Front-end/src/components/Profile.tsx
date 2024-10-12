import React from "react";
import useAuthFetch from "../hooks/authFetch";
import Navbar from "./Navbar";
import {
  Box,
  Grid,
  GridItem,
  Text,
  Spinner,
  VStack,
  Button,
} from "@chakra-ui/react";
import background from "../assets/BackgroundImage.jpeg";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { userObject, loggedIn, logout } = useAuthFetch();
  const navigate = useNavigate();

  const jwtlogout = () => {
    localStorage.removeItem("x-auth-token");
    navigate("/");
  };

  return (
    <div>
      <Box
        position="relative"
        bgImage={`url(${background})`}
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        minHeight="100vh"
      >
        {/* Overlay to improve text contrast */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.6)" // Dark overlay for contrast
        />
        <Grid
          templateAreas={`"nav" "main"`}
          templateRows="80px 1fr"
          templateColumns="1fr"
          gap={0}
          width="100vw"
        >
          {/* Navbar */}
          <GridItem area="nav" w="100%" zIndex={2} position="fixed">
            <Navbar />
          </GridItem>
          <GridItem area="main" w="100%" zIndex={1} pt="80px">
            <VStack spacing={6} align="center" color="white" mt="10">
              <Text fontSize="4xl" fontWeight="bold">
                Welcome {loggedIn ? userObject.name : "Guest"}
              </Text>

              <Text fontSize="2xl" fontWeight="medium">
                Email: {loggedIn ? userObject.email : "Not Logged In"}
              </Text>

              <Text fontSize="2xl" fontWeight="medium">
                Rented Movies:
              </Text>

              {loggedIn ? (
                <Box
                  p={4}
                  bg="rgba(255, 255, 255, 0.1)" // Slightly transparent background
                  borderRadius="md"
                  boxShadow="lg"
                  width="80%"
                  maxWidth="600px"
                >
                  {/* Placeholder for rented movies, replace with dynamic content */}
                  <Text fontSize="lg" color="white">
                    {localStorage.getItem("x-auth-token")}
                  </Text>
                  <Text fontSize="lg" color="white">
                    2. Movie Title 2
                  </Text>
                  <Text fontSize="lg" color="white">
                    3. Movie Title 3
                  </Text>
                </Box>
              ) : (
                <Spinner color="white" />
              )}
              <Button
                onClick={
                  localStorage.getItem("x-auth-token") ? jwtlogout : logout
                }
              >
                Logout
              </Button>
            </VStack>
          </GridItem>
        </Grid>
      </Box>
    </div>
  );
};

export default Profile;
