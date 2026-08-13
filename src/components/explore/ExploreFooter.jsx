import Link from "next/link";
import Image from "next/image";

export default function ExploreFooter() {
  return (
    <footer className="w-full py-8 border-t border-outline-variant/20 bg-[#1b1b23] mt-auto z-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-6 md:px-10 max-w-[1440px] mx-auto">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo/logo_5.png"
            alt="KataKata Logo"
            width={130}
            height={36}
            className="h-auto max-h-8 w-auto object-contain brightness-120 filter drop-shadow-[0_0_10px_rgba(192,193,255,0.2)]"
          />
        </Link>
        <nav className="flex flex-wrap justify-center gap-6">
          {/* <Link
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
          </Link> */}
        </nav>
        <div className="font-label-sm text-label-sm text-primary text-center">
          © {new Date().getFullYear()} QuoteBox.
        </div>
      </div>
    </footer>
  );
}
