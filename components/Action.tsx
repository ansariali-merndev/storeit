import { PiDotsThreeOutlineVerticalDuotone } from "react-icons/pi";
import { saveAs } from "file-saver";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { deleteUserFile } from "@/lib/action/file.action";
import { toast } from "sonner";
import { extractFileIdFromUrl } from "@/lib/utils";

export const Action = ({
  url,
  name,
  file,
  setIsRefresh,
}: {
  url: string;
  name: string;
  file: any;
  setIsRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleDownload = () => {
    saveAs(url, name);
  };

  const handleDelete = async () => {
    const fileId = extractFileIdFromUrl(file.url);

    if (!fileId) {
      toast("Invalid file URL");
      return;
    }

    try {
      const res = await deleteUserFile({
        documentId: file.$id,
      });
      if (res) {
        toast("Deleted Successfully");
        setIsRefresh((prev) => !prev);
      }
    } catch (error) {
      console.log("frontend delete user file error: ", error);
      toast("Something went wrong");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "check this file",
        url,
      });
    } else {
      alert("Share not supported on this browser.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <PiDotsThreeOutlineVerticalDuotone />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleDownload}>Download</DropdownMenuItem>
        <DropdownMenuItem onClick={handleShare}>Share</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
        <DropdownMenuItem>More</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
