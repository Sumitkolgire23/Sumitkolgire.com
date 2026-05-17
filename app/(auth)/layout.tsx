/* (auth) root layout — provides <html>/<body> without site nav/footer.
   Dark tokens come from lab.css imported here. */
import type { Metadata } from "next";
import "@/app/lab.css";

export const metadata: Metadata = {
  title: "Lab Access — Sumit Kolgire",
  description: "Private research lab login.",
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
