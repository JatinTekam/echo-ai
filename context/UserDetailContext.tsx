import { createContext, type Dispatch, type SetStateAction } from "react";
import type { User } from "@/db/schema";

export type UserDetails = Pick<
  User,
  "name" | "email" | "agentCredits" | "usageCredits"
>;

type UserDetailContextValue = {
  userDetails: UserDetails | undefined;
  setUserDetails: Dispatch<SetStateAction<UserDetails | undefined>>;
};

export const UserDetailContext =
  createContext<UserDetailContextValue | null>(null);