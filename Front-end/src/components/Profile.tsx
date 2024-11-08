import React, { useEffect, useState } from "react";
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
  Card,
  CardBody,
  SimpleGrid,
  Heading,
  Image,
  Flex,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { FaSignOutAlt } from "react-icons/fa";
import background from "../assets/BackgroundImage.jpeg";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [rentals, setRentals] = useState<any[]>([]);
  const [rentalObjects, setRentalObjects] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const { userObject, loggedIn, logout } = useAuthFetch();
  const navigate = useNavigate();
  const token = localStorage.getItem("x-auth-token");

  const jwtlogout = () => {
    localStorage.removeItem("x-auth-token");
    navigate("/");
  };

  const getRentals = async () => {
    const token = localStorage.getItem("x-auth-token");
    try {
      const response = await fetch(
        "http://localhost:3009/api/rentals/getUserRentals",
        {
          method: "POST",
          headers: {
            "x-auth-token": token ?? "",
          },
          credentials: "include",
        }
      );
      if (response.status !== 200) {
        console.log("Error in fetching rentals");
        return;
      }
      const data = await response.json();
      setRentals(data.rentals);
      setRentalObjects(data.rentalObject);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getRentals();
  }, []);

  const handleMovieSelect = (movie: any) => {
    setSelectedMovie(movie);
  };

  const fetchRentalObject = (movieTitle: string) => {
    return rentalObjects.find((obj) => obj.movie.title === movieTitle);
  };

  const handleReturn = async (movieTitle: string) => {
    const token = localStorage.getItem("x-auth-token");
    const rentalObject = fetchRentalObject(movieTitle);
    try {
      const response = await fetch(
        "http://localhost:3009/api/rentals/processReturn",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token ?? "",
          },
          body: JSON.stringify({
            rentalObjectid: rentalObject._id,
          }),
        }
      );

      if (response.status === 500) {
        throw new Error("System failure in route");
      }

      setRentals(rentals.filter((rental) => rental.title !== movieTitle));
      setSelectedMovie(null);
    } catch (error) {
      console.log(error.message);
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
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(0, 0, 0, 0.85)"
      />
      <Grid
        templateAreas={`"nav nav" "sidebar main"`}
        templateRows="80px 1fr"
        templateColumns="1fr 3fr"
        gap={0}
        width="100vw"
      >
        <GridItem area="nav" w="100%" zIndex={2} position="fixed">
          <Navbar />
        </GridItem>
        <GridItem
          area="sidebar"
          w="100%"
          zIndex={1}
          pt="80px"
          display="flex"
          flexDirection="column"
          overflowY="auto"
          height="calc(100vh - 80px)"
          borderRight="1px solid rgba(255, 255, 255, 0.1)"
          bg="rgba(0, 0, 0, 0.7)"
        >
          <Flex alignItems="center" justifyContent="space-between" p={4}>
            <Text fontSize="2xl" fontWeight="bold" color="white">
              My Rentals
            </Text>
            <IconButton
              aria-label="Logout"
              icon={<FaSignOutAlt />}
              colorScheme="red"
              variant="ghost"
              onClick={token ? jwtlogout : logout}
            />
          </Flex>
          {loggedIn ? (
            <SimpleGrid columns={1} spacing={4} p={4}>
              {rentals.length > 0 ? (
                rentals.map((rental) => (
                  <Card
                    key={rental._id}
                    bg="rgba(255, 255, 255, 0.1)"
                    borderRadius="md"
                    boxShadow="lg"
                    cursor="pointer"
                    _hover={{ transform: "scale(1.02)", boxShadow: "2xl" }}
                    onClick={() => handleMovieSelect(rental)}
                    transition="all 0.2s"
                  >
                    <Flex>
                      <Image
                        src={
                          rental.imageURL ||
                          "https://via.placeholder.com/100x150"
                        }
                        alt={rental.title}
                        objectFit="cover"
                        width="100px"
                        height="150px"
                        borderLeftRadius="md"
                      />
                      <CardBody>
                        <Heading size="md" color="white">
                          {rental.title}
                        </Heading>
                        <Text color="gray.300">
                          Genre: {rental.genre?.name || "N/A"}
                        </Text>
                      </CardBody>
                    </Flex>
                  </Card>
                ))
              ) : (
                <Text color="gray.400" p={4}>
                  You have no rentals at the moment.
                </Text>
              )}
            </SimpleGrid>
          ) : (
            <Spinner color="white" />
          )}
        </GridItem>

        <GridItem
          area="main"
          w="100%"
          zIndex={1}
          pt="80px"
          display="flex"
          flexDirection="column"
          height="calc(100vh - 80px)"
          overflowY="auto"
          p={4}
        >
          {selectedMovie ? (
            <Box
              bg="rgba(255, 255, 255, 0.1)"
              borderRadius="md"
              boxShadow="lg"
              padding={6}
              maxW="800px"
              margin="0 auto"
            >
              <Stack direction={{ base: "column", md: "row" }} spacing={6}>
                <Image
                  src={
                    selectedMovie.imageURL ||
                    "https://via.placeholder.com/200x300"
                  }
                  alt={selectedMovie.title}
                  objectFit="cover"
                  width="200px"
                  height="300px"
                  borderRadius="md"
                />
                <Box>
                  <Heading size="lg" color="white" mb={4}>
                    {selectedMovie.title}
                  </Heading>
                  <Text color="gray.300" mb={2}>
                    <strong>Genre:</strong> {selectedMovie.genre?.name || "N/A"}
                  </Text>
                  <Text color="gray.300" mb={2}>
                    <strong>Description:</strong>{" "}
                    {selectedMovie.description || "No description available."}
                  </Text>
                  <Text color="gray.300" mb={2}>
                    <strong>Release Date:</strong>{" "}
                    {selectedMovie.releaseDate || "N/A"}
                  </Text>
                  <Text color="gray.300" mb={2}>
                    <strong>Runtime:</strong> {selectedMovie.runtime || "N/A"}{" "}
                    minutes
                  </Text>
                  <Text color="gray.300" mb={4}>
                    <strong>Daily Rental Rate:</strong> $
                    {selectedMovie.dailyRentalRate || 0}
                  </Text>
                  <Button
                    colorScheme="teal"
                    onClick={() => handleReturn(selectedMovie.title)}
                  >
                    Return Movie
                  </Button>
                </Box>
              </Stack>
            </Box>
          ) : (
            <Flex
              alignItems="center"
              justifyContent="center"
              height="100%"
              color="white"
            >
              <Text fontSize="xl">Select a movie to see details</Text>
            </Flex>
          )}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Profile;
