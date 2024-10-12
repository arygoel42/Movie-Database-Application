import React from "react";
import {
  Box,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  CloseButton,
} from "@chakra-ui/react";
import DisplayMovies from "./DisplayMovies";
import useStore from "../Store/store";
import { set } from "joi/lib/types/lazy";

const Homepage = () => {
  const { LoginSuccess, setLoginSuccess } = useStore();
  const { AccountSuccess, setAccountSuccess } = useStore();
  return (
    <div>
      {AccountSuccess && (
        <Alert status="success" variant="subtle">
          <AlertIcon />
          <AlertTitle>Account Created!</AlertTitle>
          <AlertDescription>You have successfully logged in</AlertDescription>
          <CloseButton
            position="absolute"
            right="8px"
            top="8px"
            onClick={() => setAccountSuccess(false)}
          />
        </Alert>
      )}

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
    </div>
  );
};

export default Homepage;
