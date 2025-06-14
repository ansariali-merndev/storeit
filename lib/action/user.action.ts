"use server";

import { appwrite } from "@/constant/appwriteConstant";
import { createAdminSession, createSessionClient } from "../appwriteConfig";
import { Query, ID, Client, Account } from "node-appwrite";
import { parseStringify } from "@/utils/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminSession();
  const result = await databases.listDocuments(
    appwrite.dbId,
    appwrite.userCollection,
    [Query.equal("email", email)]
  );

  return result.total ? result.documents[0] : null;
};

const sendEmailOTP = async (email: string) => {
  const { account } = await createAdminSession();
  try {
    const token = await account.createEmailToken(ID.unique(), email);
    return token.userId;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existinguser = await getUserByEmail(email);

  const accountId = await sendEmailOTP(email);
  if (!accountId) throw new Error("failed to send otp");

  if (!existinguser) {
    const { databases } = await createAdminSession();
    await databases.createDocument(
      appwrite.dbId,
      appwrite.userCollection,
      ID.unique(),
      {
        fullName,
        email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`,
        accountId,
      }
    );
  }

  return parseStringify({ accountId });
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminSession();

    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "strict",
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    console.log("Verify Otp error", error);
    throw new Error("Verify Otp failed");
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();
    const result = await account.get();

    const user = await databases.listDocuments(
      appwrite.dbId,
      appwrite.userCollection,
      [Query.equal("accountId", result.$id)]
    );

    if (user.total <= 0) return null;
    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      throw new Error("user not found please sign in first");
    }

    const otpResponse = await sendEmailOTP(email);

    if (!otpResponse) {
      throw new Error("Failed to send OTP, Please try again");
    }

    console.log(existingUser.accountId);
    return parseStringify({
      success: true,
      accountId: existingUser.accountId,
    });
  } catch (error: any) {
    console.error("SignIn Error:", error.message);
    return parseStringify({
      success: false,
      error: error.message || "Failed to sign in user",
      accountId: null,
    });
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    console.log("Sign out Error: ", error);
  } finally {
    redirect("/sign-in");
  }
};
