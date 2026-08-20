import type { Metadata } from "next";
import { PasswordExperience } from "@/components/auth/auth-experience";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return <PasswordExperience />;
}
