import React from "react";
import { useState } from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  Stack,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import useStore from "../Store/store.ts";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { MdManageSearch } from "react-icons/md";
import { IoExitOutline } from "react-icons/io5";
import SearchBar from "./SearchBar";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { credential } from "firebase-admin";
import axios from "axios";
import useAuthFetch from "../hooks/authFetch.ts";

const Navbar = () => {
  const { userObject, loggedIn, logout } = useAuthFetch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSearchOpen, setSearchOpen] = useState(false);
  const { searchBoolean, setSearchBoolean } = useStore();
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("x-auth-token");
      setUser("");

      if (token) {
        let response = await fetch("http://localhost:3009/api/user/profile", {
          method: "POST",
          headers: {
            "x-auth-token": token,
          },
        });

        if (!response.ok) {
          // Handle the error response
          const errorData = await response.json();
          console.error("Error:", errorData.message);
        }

        if (response.ok) {
          let data = await response.json();
          setUser(data.name);
        } else {
          console.log("token not valid");
        }
      } else {
        let response = await fetch("http://localhost:3009/api/user/profile", {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          let data = await response.json();
          setUser(data.name);
        }
      }
    };
    fetchData();
  }, [navigate]);

  const HandleNavigate = () => {
    if (user === "") {
      navigate("/login");
    } else {
      navigate("/profile"); // change later
    }
  };

  return (
    <Box
      bg="transparent" // Set background to transparent
      px={4} // Padding on the x-axis
      py={2} // Padding on the y-axis
      position="fixed" // Make it fixed to the top
      width="100%" // Make it full width
      zIndex={1000} // Ensure it sits above other content
    >
      <Box bg="gray.900" px={7} color="white" width="100%">
        <Flex
          h={16}
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          {/* Logo or Brand Name */}

          <Text
            fontWeight="bold"
            fontSize="lg"
            letterSpacing="wide"
            textTransform="uppercase"
            position="absolute"
            left="20px"
          >
            <Link to="/">Vidly</Link>
          </Text>

          {/* Desktop Menu Links */}
          <HStack spacing={8} alignItems="center">
            <ChakraLink _hover={{ textDecoration: "none", color: "gray.300" }}>
              Home
            </ChakraLink>
            <ChakraLink
              href="#about"
              _hover={{ textDecoration: "none", color: "gray.300" }}
            >
              About
            </ChakraLink>
            <ChakraLink
              href="#services"
              _hover={{ textDecoration: "none", color: "gray.300" }}
            >
              Services
            </ChakraLink>
            <ChakraLink
              href="#contact"
              _hover={{ textDecoration: "none", color: "gray.300" }}
            >
              Contact
            </ChakraLink>
          </HStack>

          {/* Search Icon and Bar */}
          <HStack position="absolute" right="20px" spacing={4}>
            {!searchBoolean ? (
              <MdManageSearch
                size={40}
                onClick={() => setSearchBoolean(!searchBoolean)}
              />
            ) : (
              <SearchBar />
            )}

            {/* Call to Action Button */}
            <Button
              as="a"
              onClick={() => HandleNavigate()}
              colorScheme="teal"
              variant="solid"
              size="sm"
              display={{ base: "none", md: "flex" }}
            >
              {user != "" ? user : "Login"}
            </Button>
          </HStack>
        </Flex>

        {/* Mobile Menu */}
        {isOpen && (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as="nav" spacing={4}>
              <ChakraLink href="#home" onClick={onClose}>
                Home
              </ChakraLink>
              <ChakraLink href="#about" onClick={onClose}>
                About
              </ChakraLink>
              <ChakraLink href="#services" onClick={onClose}>
                Services
              </ChakraLink>
              <ChakraLink href="#contact" onClick={onClose}>
                Contact
              </ChakraLink>
              <Button
                as="a"
                href="#signup"
                colorScheme="teal"
                variant="solid"
                size="sm"
                onClick={onClose}
              >
                Sign Up
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
