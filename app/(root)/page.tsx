import { Card } from "@/components/Card";
import { getUserFiles } from "@/lib/action/file.action";

export default async function Home() {
  const files = await getUserFiles();
  return (
    <section>
      <Card file={files} />
    </section>
  );
}
