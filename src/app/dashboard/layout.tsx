import { Toaster } from "sonner";
import TopBar from "../(base)/TopBar";
import BottomBar from "../components/BottomBar";

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col h-[100dvh] overflow-hidden bg-brand-100/20">
      <Toaster />
      <TopBar title={"Dashboard"} />
      <div className="flex-grow overflow-auto relative">
        <div className="pb-[60px]">{children}</div>
      </div>
      <BottomBar />
    </main>
  );
}
