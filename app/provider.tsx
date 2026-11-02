"use client";
import {
  UserDetailContext,
  type UserDetails,
} from "@/context/UserDetailContext";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [userDetails, setUserDetails] = useState<UserDetails | undefined>();
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

useEffect(() => {
  console.log({
    isLoaded,
    isSignedIn,
    userId,
  });
}, [isLoaded, isSignedIn, userId]);

  // useEffect(() => {
  //   createNewUser();
  // }, []);

  // const createNewUser = async () => {
  //   const result = await axios.post("/api/users");
  //   console.log(result);
  //   setUserDetails(result.data);
  // };
useEffect(() => {
if (!isLoaded || !isSignedIn) return;

const createNewUser = async () => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Clerk session token is unavailable");
    }

    const result = await axios.post(
      "/api/users",
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    setUserDetails(result.data);
  } catch (error) {
    console.error("Failed to create or fetch user:", error);
  }
};

createNewUser();

}, [getToken, isLoaded, isSignedIn]);

  return (
    <div>
      <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
        {children}
      </UserDetailContext.Provider>
    </div>
  );
};

export default Provider;
