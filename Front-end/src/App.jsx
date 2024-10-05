import React from "react";
import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import { Grid, GridItem, Box } from "@chakra-ui/react";
import background from "./assets/BackgroundImage.jpeg";

const App = () => {
  return (
    <Box
      bgImage={`url(${background})`}
      bgPosition="center"
      bgRepeat="repeat-y"
      bgSize="cover"
      width="100vw"
      minheight="100vh"
    >
      <Grid
        templateAreas={`"nav" "main"`}
        templateRows="80px 1fr" // First row for navbar, second for main
        templateColumns="1fr" // Full width for each row
        gap={0} // Remove gap for a seamless layout
        width="100vw"
      >
        {/* Navbar */}
        <GridItem
          area="nav"
          w="100%"
          bg="rgba(0, 0, 0, 0.7)"
          zIndex={2}
          position="fixed"
        >
          <Navbar />
        </GridItem>

        {/* Homepage */}
        <GridItem area="main" w="100%" zIndex={1}>
          <Homepage />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default App;
