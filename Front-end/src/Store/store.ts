import { create } from "zustand";

const useStore = create((set) => ({
  // Define the state
  searchBoolean: false,
  searchTerm: null, //
  LoginSuccess: false,
  AccountSuccess: false,

  // Define the action to update the search term
  setSearchBoolean: (boolean) => set(() => ({ searchBoolean: boolean })),
  setSearchTerm: (term) => set(() => ({ searchTerm: term })),
  setLoginSuccess: (boolean) => set(() => ({ LoginSuccess: boolean })),
  setAccountSuccess: (boolean) => set(() => ({ AccountSuccess: boolean })),
}));

export default useStore;
