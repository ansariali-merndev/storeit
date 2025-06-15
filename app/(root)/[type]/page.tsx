import { Card } from "@/components/Card";
import { getUserFiles } from "@/lib/action/file.action";

export default async function Type({ params }: { params: any }) {
  const { type } = await params;
  let filteredFile = await getUserFiles();

  if (type === "images") {
    filteredFile = filteredFile.filter((item) => item.type === "image");
  } else if (type === "documents") {
    filteredFile = filteredFile.filter((item) => item.type === "document");
  } else if (type === "media") {
    filteredFile = filteredFile.filter(
      (item) => item.type === "video" || item.type === "audio"
    );
  } else if (type === "others") {
    filteredFile = filteredFile.filter((item) => item.type === "other");
  }

  return (
    <section>
      <Card file={filteredFile} />
    </section>
  );
}
