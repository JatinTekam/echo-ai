import { db, users } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  console.log(user)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = user.primaryEmailAddress?.emailAddress?.trim();
  const name =
    user.fullName?.trim() ||
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim();

  if (!email) {
    return NextResponse.json(
      { error: "User profile is missing an email" },
      { status: 400 },
    );
  }

  // if user already exist in DB
  const usersResult = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  //If not then insert new user
  if (usersResult.length == 0) {
    const res = await db
      .insert(users)
      .values({
        name,
        email,
      })
      .returning();

    return NextResponse.json(res[0]);
  }

  return NextResponse.json(usersResult[0]);
}
