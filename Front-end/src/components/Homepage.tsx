import React from "react";
import { Box, Text } from "@chakra-ui/react";
import DisplayMovies from "./DisplayMovies";

const Homepage = () => {
  return (
    <Box
      bg="transparent"
      px={4}
      py={2}
      width="100%"
      zIndex={2} // Ensure the content sits above the background
    >
      <Box bg="gray.900" px={7} color="white" width="100%" borderRadius="md">
        <Text fontSize="xl" mb={4}>
          Welcome to the Movie Database
        </Text>
        <DisplayMovies />
      </Box>
    </Box>
  );
};

export default Homepage;
