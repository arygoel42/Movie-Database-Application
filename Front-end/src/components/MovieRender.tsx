import React from "react";
import useMovie from "../hooks/movieFetch";
import { Text, Box, Flex, Image, Stack } from "@chakra-ui/react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface Props {
  category: string;
}

const MovieRender = ({ category }: Props) => {
  const genreObject = [
    { name: "Action", _id: "28" },
    { name: "Adventure", _id: "12" },
    { name: "Comedy", _id: "35" },
    { name: "Drama", _id: "18" },
    { name: "Horror", _id: "27" },
    { name: "Science Fiction", _id: "878" },
    { name: "Fantasy", _id: "14" },
    { name: "Thriller", _id: "53" },
    { name: "Mystery", _id: "9648" },
    { name: "Romance", _id: "10749" },
    { name: "Animation", _id: "16" },
    { name: "Documentary", _id: "99" },
    { name: "Crime", _id: "80" },
    { name: "Musical", _id: "10402" },
    { name: "War", _id: "10752" },
    { name: "Western", _id: "37" },
    { name: "Historical", _id: "36" },
    { name: "Biographical", _id: "18" },
    { name: "Family", _id: "10751" },
    { name: "Sports", _id: "21" },
    { name: "Superhero", _id: "878" },
    { name: "Noir", _id: "80" },
    { name: "Psychological Thriller", _id: "53" },
    { name: "Disaster", _id: "27" },
    { name: "Suspense", _id: "9648" },
    { name: "Slasher", _id: "27" },
    { name: "Period Piece", _id: "36" },
    { name: "Coming-of-Age", _id: "35" },
    { name: "Dystopian", _id: "878" },
    { name: "Martial Arts", _id: "28" },
  ];
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollMovies = (direction: "right" | "left") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "right" ? 300 : -300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Initialize data, error, and isLoading by default
  let data, error, isLoading, typeMovie;

  // Check if the category is either "toprated" or "popular"
  console.log(category);
  if (category === "toprated" || category === "popular") {
    ({ data, error, isLoading } = useMovie(category)); // Destructure data
  }

  // Check if the category exists in the genreObject
  const exists = genreObject.some((obj) => obj.name === category);
  if (exists) {
    ({ data, error, isLoading } = useMovie(undefined, undefined, category)); // Destructure data
  }

  // Check if data is available before filtering
  const filteredData = Array.isArray(data)
    ? data?.filter((movie) => movie?.imageURL !== "N/A" && movie?.title)
    : [];

  // If data is undefined or null, you can handle the error case here
  if (!filteredData.length) {
    return <Text>No movies found.</Text>;
  }

  return (
    <Box
      overflow="hidden" // Hide the overflow of the movie list
      width="90vw" // Full width of viewport
      position="relative"
      backgroundColor="gray.900"
    >
      <Flex
        ref={scrollContainerRef}
        overflowX="auto"
        gap={4}
        p={4}
        sx={{
          "::-webkit-scrollbar": {
            display: "none", // Hide scrollbar on webkit browsers
          },
          msOverflowStyle: "none", // Hide scrollbar on IE/Edge
          scrollbarWidth: "none", // Hide scrollbar on Firefox
        }}
      >
        {filteredData.map((movie, index) => (
          <Box
            key={index}
            minW="200px" // Ensure each item has a minimum width
            maxW="250px"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            bgImage={`url(${movie?.imageURL})`}
            bgSize="cover"
            bgPosition="center"
            position="relative"
            height="300px"
            cursor="pointer"
            _hover={{
              bg: "rgba(0, 0, 0, 0.3)",
              transform: "scale(1.05)",
              transition: "transform 0.15s",
            }}
            onClick={() => navigate(`/${movie.title}/${movie._id}`)}
          >
            {/* Movie title and genre overlay */}
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
      </Flex>
    </Box>
  );
};

export default MovieRender;
