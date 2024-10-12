import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuthFetch = () => {
  // Declare state at the top level of the hook
  const [userObject, setUserObject] = useState({
    name: "",
    email: "",
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    // document.cookie =
    //   "your_cookie_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // localStorage.removeItem("your_jwt_token"); // Remove JWT from local storage

    // Optionally, you can call your API to log out the user on the server side
    let response = await fetch("http://localhost:3009/api/user/logout", {
      method: "POST",
      credentials: "include", // Include credentials if needed
    });

    navigate("/");
  };

  // Fetch user data inside useEffect
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("x-auth-token");
      console.log("Token from localStorage:", token);

      if (token != null) {
        try {
          const response = await fetch(
            "http://localhost:3009/api/user/profile",
            {
              method: "POST",
              headers: {
                "x-auth-token": token,
              },
            }
          );

          if (response.ok) {
            let data = await response.json();
            setUserObject({ name: data.name, email: data.email });
            setLoggedIn(true);
          } else {
            // Handle non-ok responses if needed
            setLoggedIn(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        try {
          let response = await fetch("http://localhost:3009/api/user/profile", {
            method: "POST",
            credentials: "include",
          });

          if (response.ok) {
            let data = await response.json();
            setUserObject({ name: data.name, email: data.email });
            console.log(userObject);
            setLoggedIn(true);
          } else {
            console.log("Error fetching user data:", response.statusText);
            // Handle non-ok responses if needed
            setLoggedIn(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUser();
  }, []); // Empty dependency array means this will only run once after the initial render

  return { userObject, loggedIn, logout };
};

export default useAuthFetch;
