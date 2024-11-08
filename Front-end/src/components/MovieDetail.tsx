import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import {
  Grid,
  Box,
  GridItem,
  Text,
  Image,
  Flex,
  VStack,
  Button,
} from "@chakra-ui/react";
import background from "../assets/BackgroundImage.jpeg";
import useMovie from "../hooks/movieFetch";
import useStore from "../Store/store.ts";
import useAuthFetch from "../hooks/authFetch";
import rentalFetch from "../hooks/rentalFetch";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
const MovieDetailPage = () => {
  const { watchList, setWatchList } = useStore();

  const { title, id } = useParams();
  const { data: movie } = useMovie(
    undefined,
    id,
    undefined,
    undefined,
    undefined
  );
  const navigate = useNavigate();
  const { loggedIn } = useAuthFetch();
  const { CheckRental } = rentalFetch();

  const [isRented, setIsRented] = useState(false);

  useEffect(() => {
    const checkRental = async () => {
      const result = await CheckRental(movie?._id);
      setIsRented(result);
    };
    checkRental();
  }, [movie?._id]);

  const addWatchList = async (id) => {
    if (!loggedIn) {
      navigate("/login");
    }
    const token = localStorage.getItem("x-auth-token");
    try {
      console.log("sent reuiest");
      let response = await axios.post(
        "http://localhost:3009/api/movies/addWatchList",
        {
          id: id, // Send only the payload (id) in the body
        },
        {
          withCredentials: true, // Ensures cookies are sent with the request
          headers: {
            "x-auth-token": token, // Proper way to include custom headers
          },
        }
      );

      if (response.status === 200) {
        let movieOject = await response.data.movieObject;
        setWatchList([...watchList, movieOject]);
        alert("Movie added to watchList!");
      } else if (response.status === 404 || response.status === 500) {
        console.log("issue in adding movie to watchList");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <Box
        position="relative"
        bgImage={`url(${background})`}
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        minHeight="100vh" // Ensure background covers the entire page
      >
        {/* Overlay to improve text contrast */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.5)" // Dark overlay for contrast
        />

        <Grid
          templateAreas={`"nav" "main"`}
          templateRows="80px 1fr" // First row for navbar, second for main content
          templateColumns="1fr"
          gap={0}
          width="100vw"
        >
          {/* Navbar */}
          <GridItem area="nav" w="100%" zIndex={2} position="fixed">
            <Navbar />
          </GridItem>

          {/* Main content */}
          <GridItem
            area="main"
            pt="100px" // Adjusted padding to account for the navbar
            px={{ base: "10px", md: "50px" }}
            zIndex={1}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            {/* Movie Title */}
            <Text
              fontSize={{ base: "3xl", md: "5xl" }} // Responsive font size
              fontWeight="bold"
              color="white"
              textAlign="center"
              mb="4"
              textShadow="1px 1px 2px rgba(0, 0, 0, 0.6)" // Adding shadow for better readability
            >
              {movie?.title}
            </Text>

            {/* Movie Poster and Description */}
            <Flex
              align="center"
              justify="center"
              direction={{ base: "column", md: "row" }} // Stack vertically on small screens
              gap={6} // Gap between image and description
              mb={10} // Margin-bottom for spacing
            >
              {/* Movie Poster */}
              <Box
                boxShadow="lg"
                borderRadius="md"
                overflow="hidden"
                maxW={{ base: "300px", md: "400px" }} // Adjust size for responsiveness
              >
                <Image
                  src={movie?.imageURL}
                  alt={movie?.title}
                  objectFit="cover"
                  w="100%"
                  borderRadius="md" // Rounded corners for the poster
                />
              </Box>

              {/* Movie Description */}
              <VStack
                align="left"
                spacing={4} // Adjust spacing between elements
                maxW={{ base: "300px", md: "400px" }} // Adjust size for responsiveness
              >
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  color="gray.200"
                  maxW="600px"
                  textAlign="justify" // Make it more readable by justifying the text
                  lineHeight="1.6" // Improve readability
                >
                  {movie?.description}
                </Text>

                {isRented === false ? (
                  <Button
                    size="lg"
                    colorScheme="teal"
                    borderRadius="full"
                    onClick={() => navigate(`/rental/${movie?._id}`)}
                    _hover={{ transform: "scale(1.05)", boxShadow: "lg" }} // Subtle scaling effect on hover
                    px="8" // Padding to make the button look larger
                    py="6"
                  >
                    Rent Movie
                  </Button>
                ) : null}
                <Button
                  size="lg"
                  colorScheme="teal"
                  borderRadius="full"
                  onClick={() => addWatchList(movie?._id)}
                  _hover={{ transform: "scale(1.05)", boxShadow: "lg" }} // Subtle scaling effect on hover
                  px="8" // Padding to make the button look larger
                  py="6"
                >
                  Add to watchList+
                </Button>
              </VStack>
            </Flex>
          </GridItem>
        </Grid>
      </Box>
    </div>
  );
};

export default MovieDetailPage;
