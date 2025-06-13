"use server";

import { appwrite } from "@/constant/appwriteConstant";
import { createAdminSession } from "../appwriteConfig";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "@/utils/utils";
import { cookies } from "next/headers";

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
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};

export const createAccount = async ({
  fullname,
  email,
}: {
  fullname: string;
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
        fullName: fullname,
        email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${fullname}`,
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
  console.log("At verify password: ", password, "accountid: ", accountId);

  try {
    const { account } = await createAdminSession();

    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    console.log("Verify Otp error", error);
    throw new Error("Verify Otp failed");
  }
};
