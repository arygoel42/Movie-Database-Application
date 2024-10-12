import React from "react";
import { Text, Box, Flex, Image, Stack, IconButton } from "@chakra-ui/react";
import useMovie from "../hooks/movieFetch";
import { useRef } from "react";
import { Link } from "react-router-dom";
import MovieRender from "./MovieRender";
import useAuthFetch from "../hooks/authFetch";
import { AddIcon } from "@chakra-ui/icons"; // Import the AddIcon

export interface movieObject {
  numberInStock: number;
  dailyRentalRate: number;
  title: string;
  genre: {
    name: string;
    _id: string;
  };
  imageURL: string;
  _id: string;
  poster_page: string;
  description: string;
  popularity: number;
}

const DisplayMovies = () => {
  //mappable objets for displaying movies
  const layoutObject = ["toprated", "Action", "Suspense", "Horror"];

  const { data, error } = useMovie("popular");

  const { loggedIn, logout, userObject } = useAuthFetch();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!data) return null;
  const fallbackImage = "https://via.placeholder.com/200x300?text=No+Image";

  const filteredData = Array.isArray(data)
    ? data?.filter((movie) => movie?.imageURL != "N/A" && movie?.title)
    : [data];

  const scrollMovies = (direction: "right" | "left") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "right" ? 300 : -300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      <Box
        overflow="hidden" // Hide the overflow of the movie list
        width="90vw" // Full width of viewport
        position="relative"
        backgroundColor="gray.900"
      >
        <Text fontSize="2xl" color="white" mb={4} textAlign="center">
          Popular Movies
        </Text>

        <Flex
          ref={scrollContainerRef}
          css={`
            overflow-x: auto; // Enable horizontal scrolling
            scroll-behavior: smooth; // Smooth scroll when using scroll buttons
            white-space: nowrap;
            -ms-overflow-style: none; /* Hide scrollbar in IE and Edge */
            scrollbar-width: none; /* Hide scrollbar in Firefox */
            &::-webkit-scrollbar {
              display: none; /* Hide scrollbar in WebKit browsers (Chrome, Safari) */
            }
          `}
        >
          {/* Duplicate the movie list to create the endless scroll effect */}
          {filteredData
            // ?.filter((movie) => movie?.imageURL && movie?.title)
            .map((movie, index) => (
              <Box
                onClick={() => console.log(movie._id)}
                key={`${movie._id}-${index}`} // Ensure unique keys
                display="inline-block"
                mx={5} // Space between movie boxes
                bgImage={`url(${movie?.imageURL || fallbackImage})`} // Set the background to the movie poster
                bgSize="cover" // Cover the entire box
                bgPosition="center"
                width="200px" // Adjust the width of each movie box
                height="380" // Adjust the height of each movie box
                borderRadius="md"
                position="relative"
                flexShrink={0} // Prevent shrinking of movie boxes
                _hover={{
                  transform: "scale(1.05)",
                  transition: "transform 0.15s",
                }}
              >
                <Box
                  position="absolute"
                  bottom="0"
                  width="100%"
                  bg="rgba(0, 0, 0, 0.7)" // Dark overlay for readability
                  color="white"
                  textAlign="center"
                  py={2}
                >
                  <Text
                    fontSize="medium"
                    overflow="hidden"
                    whiteSpace="nowrap" // Prevent text wrapping
                    textOverflow="ellipsis" // Show ellipsis if text is too long
                  >
                    <Link to={`/${movie.title}/${movie._id}`}>
                      {" "}
                      {movie?.title}
                    </Link>
                  </Text>
                  <Text
                    fontSize="small"
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                  >
                    {movie?.genre.name}
                  </Text>
                </Box>
                {loggedIn && (
                  <IconButton
                    aria-label="Add to favorites"
                    icon={<AddIcon />}
                    size="sm"
                    colorScheme="teal"
                    position="absolute"
                    top="10px"
                    right="10px"
                    onClick={() => {
                      console.log("Added to favorites:", movie.title);
                    }}
                  />
                )}
              </Box>
            ))}
        </Flex>
      </Box>

      <div>
        {layoutObject.map((category, index) => (
          <div>
            <Text fontSize="2xl" color="white" mb={4} textAlign="center">
              {category}
            </Text>

            <MovieRender category={category} />

            {/* <MovieRender category={category} /> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayMovies;
