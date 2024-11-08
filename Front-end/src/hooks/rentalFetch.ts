import { useEffect, useState } from "react";

const rentalFetch = () => {
  const [rentalObj, setRentalObj] = useState(null); // Use state to track rentalObj
  const [rentals, setRentals] = useState([]); // Use state to track rentals

  const CheckRental = async (id: string) => {
    const token = localStorage.getItem("x-auth-token");

    try {
      const response = await fetch("http://localhost:3009/api/rentals/id", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token ?? "",
        },
        body: JSON.stringify({
          id: id,
        }),
      });

      if (response.status === 500) {
        throw new Error("System failure in route");
      }

      if (response.status === 400) {
        return false;
      }

      const data = await response.json();
      setRentalObj(data); // Update state with fetched data
      console.log(data);

      return true;
    } catch (error) {
      console.log(error.message);
    }
  };

  //   const getRentals = async () => {
  //     const token = localStorage.getItem("x-auth-token");
  //     try {
  //       const response = await fetch(
  //         "http://localhost:3009/api/rentals/getUserRentals",
  //         {
  //           method: "POST",
  //           headers: {
  //             "x-auth-token": token ?? "",
  //           },
  //           credentials: "include",
  //         }
  //       );
  //       if (response.status !== 200) {
  //         console.log("Error in fetching rentals");
  //         return;
  //       }
  //       const data = await response.json();
  //       setRentals(data.rentals);
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   };

  return { CheckRental, rentals }; // Return state so it can be accessed
};

export default rentalFetch;
