import ExploreHeader from "@/components/explore/ExploreHeader";
import ExploreClient from "@/components/explore/ExploreClient";
import ExploreFooter from "@/components/explore/ExploreFooter";

export default function ExplorePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans antialiased overflow-x-hidden relative bg-[#0a0e1a] text-[#e4e1ed]">
      {/* Background Gradient Ambient Effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-container/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-container/5 blur-[100px]" />
      </div>

      {/* Top Header */}
      <ExploreHeader />

      {/* Main Explore Client Content */}
      <ExploreClient />

      {/* Footer */}
      <ExploreFooter />
    </div>
  );
}
