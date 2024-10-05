import React from "react";
import { Grid, GridItem, Box, Text, SimpleGrid } from "@chakra-ui/react";
import background from "../assets/BackgroundImage.jpeg";
import Navbar from "./Navbar";
import useMovie from "../hooks/movieFetch";
import useStore from "../Store/store.ts";
import { useParams, useNavigate } from "react-router-dom";

const SearchPage = () => {
  const { searchTerm, setSearchTerm } = useStore();
  const { data: movies } = useMovie(
    undefined,
    undefined,
    undefined,
    searchTerm
  );
  const { search } = useParams();
  const navigate = useNavigate();

  return (
    <Box
      bgImage={`url(${background})`}
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
      minHeight="100vh" // Ensures it covers the full height of the viewport
    >
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
        templateRows="80px 1fr" // First row for navbar, second for content
        templateColumns="1fr"
        gap={0}
        width="100vw"
      >
        {/* Navbar */}
        <GridItem area="nav">
          <Navbar />
        </GridItem>

        {/* Main Content */}
        <GridItem area="main" p={6}>
          <Text
            fontSize={{ base: "3xl", md: "5xl" }} // Responsive font size
            fontWeight="bold"
            color="white"
            textAlign="center"
            mb="8"
          >
            {searchTerm != undefined || null
              ? `Results for: ${searchTerm}`
              : `No results found`}
          </Text>

          {/* Movie Grid */}
          <SimpleGrid
            columns={{ base: 2, md: 3, lg: 4 }} // Responsive grid columns
            spacing={6} // Space between movie cards
            justifyItems="center"
          >
            {movies?.map((movie, index) => (
              <Box
                key={index}
                minW="200px"
                maxW="250px"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="lg"
                bgImage={`url(${movie?.imageURL})`}
                bgSize="cover"
                bgPosition="center"
                position="relative"
                height="350px"
                cursor="pointer"
                _hover={{
                  transform: "scale(1.05)",
                  transition: "transform 0.3s ease",
                }}
                onClick={() => navigate(`/${movie.title}/${movie._id}`)}
              >
                {/* Movie Title & Genre Overlay */}
                <Box
                  position="absolute"
                  bottom="0"
                  width="100%"
                  bg="rgba(0, 0, 0, 0.6)" // Dark overlay
                  color="white"
                  textAlign="center"
                  p={4}
                >
                  <Text
                    fontWeight="bold"
                    fontSize="lg"
                    textShadow="2px 2px 4px rgba(0, 0, 0, 0.8)"
                  >
                    {movie.title}
                  </Text>
                  <Text
                    fontSize="sm"
                    color="gray.300"
                    textShadow="1px 1px 3px rgba(0, 0, 0, 0.8)"
                  >
                    {movie.genre.name}
                  </Text>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default SearchPage;
