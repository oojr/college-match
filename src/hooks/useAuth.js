import React from "react";
import { AuthContext } from "../context/AuthContextProvider";

export default function useAuth() {
  return React.useContext(AuthContext);
}
