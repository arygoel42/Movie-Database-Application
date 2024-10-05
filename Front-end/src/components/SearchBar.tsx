import React, { useEffect } from "react";
import { IoExitOutline } from "react-icons/io5";
import {
  Flex,
  VStack,
  Text,
  Box,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import useStore from "../Store/store.ts";
import useMovie from "../hooks/movieFetch";
import { MdSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import SearchPage from "./SearchPage.tsx";

const SearchBar = () => {
  const navigate = useNavigate();

  const { searchBoolean, setSearchBoolean } = useStore();
  const { searchTerm, setSearchTerm } = useStore();

  // Call the hook here
  const { data, error, isLoading } = useMovie(
    undefined,
    undefined,
    undefined,
    searchTerm // Pass searchTerm directly to the hook
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search/${searchTerm}`);
  };

  // You can add logic to handle data here, if needed
  useEffect(() => {
    if (searchTerm == "") {
      setSearchTerm(undefined);
    }
    if (searchBoolean && searchTerm) {
      if (data) {
        console.log(data); // Log the data received from the hook
      }
      if (error) {
        console.error(error); // Log any errors
      }
    }
  }, [searchBoolean, searchTerm, data, error]); // Add dependencies here

  return (
    <Box>
      <div>
        <Flex alignItems="center">
          <IoExitOutline
            size={30}
            onClick={() => setSearchBoolean(!searchBoolean)}
          />
          <VStack>
            <Box color="black">
              <form onSubmit={(e) => handleSubmit(e)}>
                <input
                  type="text"
                  placeholder="Search"
                  style={{
                    marginLeft: "10px",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid gray",
                    color: "black", // This sets the text color to black
                    backgroundColor: "white", // Optionally, set the background to white for contrast
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
            </Box>

            {data?.length > 0 ? (
              <>
                <VStack>
                  <Box
                    width="100%"
                    bg="white"
                    border="1px solid lightgray"
                    borderRadius="md"
                    boxShadow="md"
                    maxHeight="100px"
                    overflowY="auto" // If the list is long, allow scrolling
                    position="absolute"
                  >
                    <List spacing={2}>
                      {data?.map((movie, index) => (
                        <ListItem
                          key={index}
                          px={4}
                          py={2}
                          _hover={{ bg: "gray.100", cursor: "pointer" }}
                          onClick={() =>
                            navigate(`/${movie.title}/${movie._id}`)
                          }
                          color="black"
                        >
                          <ListIcon as={MdSearch} color="gray.400" />
                          {movie.title}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </VStack>
              </>
            ) : null}
          </VStack>
        </Flex>
      </div>
    </Box>
  );
};

export default SearchBar;
