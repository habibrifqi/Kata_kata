import Link from "next/link";

export default function ExploreFooter() {
  return (
    <footer className="w-full py-8 border-t border-outline-variant/20 bg-[#1b1b23] mt-auto z-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-6 md:px-10 max-w-[1440px] mx-auto">
        <div className="font-headline-sm text-headline-sm font-bold text-on-surface">
          KataKata
        </div>
        <nav className="flex flex-wrap justify-center gap-6">
          <Link
            className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all"
            href="#"
          >
            About
          </Link>
          <Link
            className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all"
            href="#"
          >
            Privacy Policy
          </Link>
          <Link
            className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all"
            href="#"
          >
            Contact
          </Link>
        </nav>
        <div className="font-label-sm text-label-sm text-primary text-center">
          © 2024 KataKata. Curation for the curious soul.
        </div>
      </div>
    </footer>
  );
}
