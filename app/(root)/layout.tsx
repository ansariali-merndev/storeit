import { Header } from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/action/user.action";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return redirect("/sign-in");
  }

  const { fullName, avatar, email } = currentUser;
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <Sidebar fullName={fullName} avatar={avatar} email={email} />

        <div className="flex-1 flex flex-col">
          <Header {...currentUser} />
          <Toaster richColors position="top-center" />
          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
