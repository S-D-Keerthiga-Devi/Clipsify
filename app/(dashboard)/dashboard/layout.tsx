import Sidebar from "./components/Sidebar";
import Footer from "@/app/components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full">
      <Sidebar />
      <div className="pl-16 md:pl-20">
        {children}
        {/* Footer with sidebar offset */}
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </main>
  );
}