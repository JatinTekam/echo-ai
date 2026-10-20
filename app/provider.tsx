"use client";
import {
  UserDetailContext,
  type UserDetails,
} from "@/context/UserDetailContext";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [userDetails, setUserDetails] = useState<UserDetails | undefined>();
  //const { isLoaded, isSignedIn } = useUser();

  const { isLoaded, isSignedIn, user } = useUser();

useEffect(() => {
  console.log({
    isLoaded,
    isSignedIn,
    userId: user?.id,
  });
}, [isLoaded, isSignedIn, user]);

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
    const result = await axios.post("/api/users");
    setUserDetails(result.data);
  } catch (error) {
    console.error("Failed to create or fetch user:", error);
  }
};

createNewUser();

}, [isLoaded, isSignedIn]);

  return (
    <div>
      <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
        {children}
      </UserDetailContext.Provider>
    </div>
  );
};

export default Provider;
