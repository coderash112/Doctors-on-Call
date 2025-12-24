export const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("authUser");
};

export const logout = () => {
  localStorage.removeItem("authUser");
  localStorage.removeItem("mcqScore");
  localStorage.removeItem("typedWords");
};
