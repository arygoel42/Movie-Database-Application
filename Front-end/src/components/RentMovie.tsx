import React, { useState } from "react";
import {
  Box,
  Text,
  Input,
  VStack,
  Button,
  Flex,
  Image,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import useAuthFetch from "../hooks/authFetch";
import useMovie from "../hooks/movieFetch";
import background from "../assets/BackgroundImage.jpeg";

const RentMovie = () => {
  const { loggedIn } = useAuthFetch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: movie } = useMovie(undefined, id);
  const [name, setName] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!loggedIn) {
    navigate("/login");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    const token = localStorage.getItem("x-auth-token");
    e.preventDefault();

    if (name === "" || cardNum === "" || phone === "") {
      alert("Please fill in all the fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3009/api/customers", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token ?? "", // Use an empty string if token is null
        },
        body: JSON.stringify({
          name: name,
          CardNum: cardNum,
          phone: phone,
        }),
      });

      if (response.status === 500 || response.status === 400) {
        setErrorMessage("Something went wrong. Please try again.");
        console.log(response);
      }

      console.log(response);

      const response2 = await fetch("http://localhost:3009/api/rentals", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token ?? "", // Use an empty string if token is null
        },
        body: JSON.stringify({
          movieId: id,
          customerId: await response.json(),
        }),
      });

      if (response2.status === 500 || response2.status === 400) {
        setErrorMessage("Something went wrong. Please try again.");
        console.log(response2);
      }

      if (response.status === 200 && response2.status === 200) {
        navigate("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      position="relative"
      bgImage={`url(${background})`}
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
      minHeight="100vh"
      width="100vw"
    >
      {/* Navbar */}
      <Box position="fixed" top="0" width="100vw" zIndex={3}>
        <Navbar />
      </Box>

      {errorMessage && (
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

      {/* Main Content */}
      <Flex
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        pt="80px"
        position="relative"
        zIndex={2}
      >
        {/* Overlay */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.6)"
          zIndex={1}
        />

        {/* Main content box */}
        <Flex
          direction="column"
          bg="white"
          p={8}
          borderRadius="lg"
          boxShadow="xl"
          width="90%"
          maxW="600px"
          align="center"
          justify="center"
          zIndex={2} // Ensures content is above overlay
        >
          {/* Movie Details */}
          <VStack spacing={4} align="center" mb={6}>
            {movie && (
              <>
                <Image
                  src={movie.imageURL}
                  alt={movie.title}
                  borderRadius="lg"
                  boxShadow="md"
                  maxHeight="300px"
                  objectFit="cover"
                />
                <Text fontSize="2xl" fontWeight="bold" color="teal.700">
                  {movie.title}
                </Text>
                <Text fontSize="md" color="gray.600" textAlign="center">
                  {movie.description}
                </Text>
              </>
            )}
          </VStack>

          {/* Rental Form */}
          <VStack as="form" onSubmit={handleSubmit} spacing={4} width="100%">
            <Input
              placeholder="Name"
              size="lg"
              bg="gray.100"
              borderRadius="full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              placeholder="Card Number"
              type="number"
              size="lg"
              bg="gray.100"
              borderRadius="full"
              value={cardNum}
              onChange={(e) => setCardNum(e.target.value)}
              required
            />
            <Input
              placeholder="Phone Number"
              type="tel"
              size="lg"
              bg="gray.100"
              borderRadius="full"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Button
              type="submit"
              size="lg"
              colorScheme="teal"
              borderRadius="full"
              width="100%"
              _hover={{ bg: "teal.400", transform: "scale(1.05)" }}
            >
              Rent Movie
            </Button>
          </VStack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default RentMovie;
