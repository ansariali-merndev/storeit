import { Toaster } from "sonner";
import { FileUploader } from "./FileUploader";
import { SignOut } from "./SignOut";

export const Header = ({ ...currentUser }) => {
  return (
    <header className="bg-zinc-100 w-full min-h-[12vh] flex items-center justify-end gap-4 px-4">
      <FileUploader {...currentUser} />
      <Toaster />
      <SignOut />
    </header>
  );
};
