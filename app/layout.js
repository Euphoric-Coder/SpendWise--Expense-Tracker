import localFont from "next/font/local";
import "./globals.css";
import { Inter, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Homepage/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import ClerkAuthHandler from "@/components/ClerkAuthHandler";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata = {
  title: "BudgetEase",
  description: "Track your expenses and manage your finances with ease.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      afterSignOutUrl="/sign-in" // Redirect to the Sign-In Page after sign out
      // signInForceRedirectUrl="/dashboard" // Redirect to the Dashboard after sign in
      // signUpForceRedirectUrl="/dashboard" // Redirect to the Dashboard after sign up
    >
      <ClerkAuthHandler />
      <html lang="en" suppressHydrationWarning>
        <body className={`${outfit.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
