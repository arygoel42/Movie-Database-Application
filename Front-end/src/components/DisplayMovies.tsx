import React from "react";
import { Text, Box, Flex, IconButton } from "@chakra-ui/react";
import useMovie from "../hooks/movieFetch";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MovieRender from "./MovieRender";
import useAuthFetch from "../hooks/authFetch";
import { AddIcon, MinusIcon } from "@chakra-ui/icons"; // Import the AddIcon
import axios from "axios";

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
  const [watchList, setWatchList] = useState<movieObject[]>([]); // Define the type for the watchList state
  const layoutObject = ["toprated", "Action", "Suspense", "Horror"];

  const addWatchList = async (id) => {
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
      } else if (response.status === 404 || response.status === 500) {
        console.log("issue in adding movie to watchList");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const removeWatchList = async (id) => {
    const token = localStorage.getItem("x-auth-token");
    try {
      let response = await axios.post(
        "http://localhost:3009/api/movies/removeWatchList",
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
        console.log("movie removed from watchList");
        setWatchList(watchList.filter((movie) => movie._id != id));
      } else if (response.status === 404 || response.status === 500) {
        console.log("issue removing movie from watchList");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchWatchList = async () => {
    const token = localStorage.getItem("x-auth-token");
    try {
      const response = await axios.post(
        "http://localhost:3009/api/movies/checkWatchList",
        {},
        {
          headers: {
            "x-auth-token": token,
          },
          withCredentials: true,
        }
      );

      let WatchList = response.data.watchList;
      console.log(response.data.watchList);

      setWatchList(WatchList || []); // Set the watchList to an empty array if it's undefined or empty
    } catch (error) {
      console.log("error:", error.message);
    }
  };

  useEffect(() => {
    fetchWatchList();
  }, []);

  const { data } = useMovie("popular");
  const { loggedIn } = useAuthFetch();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  if (!data) return null;
  const fallbackImage = "https://via.placeholder.com/200x300?text=No+Image";

  const filteredData = Array.isArray(data)
    ? data?.filter((movie) => movie?.imageURL !== "N/A" && movie?.title)
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
      {watchList.length > 0 && (
        <Box
          overflow="hidden" // Hide the overflow of the movie list
          width="90vw" // Full width of viewport
          position="relative"
          backgroundColor="gray.900"
        >
          <Text fontSize="2xl" color="white" mb={4} textAlign="center">
            Watch Next!
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
            {watchList.map((movie, index) => (
              <Box
                onClick={() => console.log(movie._id)}
                key={`${movie._id}-${index}`} // Ensure unique keys
                display="inline-block"
                mx={5} // Space between movie boxes
                bgImage={`url(${movie?.imageURL || fallbackImage})`} // Set the background to the movie poster
                bgSize="cover" // Cover the entire box
                bgPosition="center"
                width="200px" // Adjust the width of each movie box
                height="380px" // Adjust the height of each movie box
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
                      {movie?.title}
                    </Link>
                  </Text>
                  <Text
                    fontSize="small"
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                  >
                    {movie?.genre?.name}
                  </Text>
                </Box>
                {loggedIn && (
                  <IconButton
                    aria-label="Add to favorites"
                    icon={<MinusIcon />}
                    size="sm"
                    colorScheme="red"
                    position="absolute"
                    top="10px"
                    right="10px"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents the card's click event
                      removeWatchList(movie._id); // Adds the movie to the watchlist
                    }}
                  />
                )}
              </Box>
            ))}
          </Flex>
        </Box>
      )}

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
          {filteredData.map((movie, index) => (
            <Box
              onClick={() => console.log(movie._id)}
              key={`${movie._id}-${index}`} // Ensure unique keys
              display="inline-block"
              mx={5} // Space between movie boxes
              bgImage={`url(${movie?.imageURL || fallbackImage})`} // Set the background to the movie poster
              bgSize="cover" // Cover the entire box
              bgPosition="center"
              width="200px" // Adjust the width of each movie box
              height="380px" // Adjust the height of each movie box
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
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the card's click event
                    addWatchList(movie._id); // Adds the movie to the watchlist
                  }}
                />
              )}
            </Box>
          ))}
        </Flex>
      </Box>

      <div>
        {layoutObject.map((category, index) => (
          <div key={index}>
            <Text fontSize="2xl" color="white" mb={4} textAlign="center">
              {category}
            </Text>
            <MovieRender
              category={category}
              watchList={watchList}
              setWatchList={setWatchList}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayMovies;
