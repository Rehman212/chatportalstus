import type { Metadata } from "next";
import { PasswordExperience } from "@/components/auth/auth-experience";

export const metadata: Metadata = { title: "Reset password" };

export default function ResetPasswordPage() {
  return <PasswordExperience reset />;
}
