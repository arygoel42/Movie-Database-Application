import { create } from "zustand";

const useStore = create((set) => ({
  // Define the state
  searchBoolean: false,
  searchTerm: null, //

  // Define the action to update the search term
  setSearchBoolean: (boolean) => set(() => ({ searchBoolean: boolean })),
  setSearchTerm: (term) => set(() => ({ searchTerm: term })),
}));

export default useStore;
