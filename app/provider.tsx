"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [userDetails, setUserDetails] = useState();

  useEffect(() => {
    createNewUser();
  }, []);

  const createNewUser = async () => {
    const result = await axios.post("/api/users");
    console.log(result);
    setUserDetails(result.data);
  };

  return (
    <div>
      <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
        {children}
      </UserDetailContext.Provider>
    </div>
  );
};

export default Provider;
