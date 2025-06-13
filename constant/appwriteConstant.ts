export const appwrite = {
  endpointsId: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  dbId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  userCollection: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
  fileCollection: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION!,
  bucket: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
  secretKey: process.env.SECRET_KEY!,
};
