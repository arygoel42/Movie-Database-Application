import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { movieObject } from "../components/DisplayMovies";

//make this generic to fetch all types of movies

const useMovie = (
  type?: string,
  id?: string,
  genre?: string,
  Search?: string,
  SpecificMovie?: any
) => {
  const fetchMovie = () => {
    let url = "http://localhost:3009/api/";

    if (type) {
      url += `movies/${type}`;
    }

    if (id) {
      url += `movies/${id}`;
    }

    if (genre) {
      url += `movies/genre/${genre}`;
    }

    if (Search) {
      url += `movies/search/${Search}`;
    }

    if (!type && !id && !genre && !Search) {
      return null; //return null if no type is provided
    }

    return axios.get<movieObject[]>(url).then((res) => res.data);
  };

  return useQuery<movieObject[]>({
    //having differnet keys! if we want to make it generic
    queryKey: ["movies", type || genre || id || Search || SpecificMovie],
    queryFn: fetchMovie,
  });
};

export default useMovie;
