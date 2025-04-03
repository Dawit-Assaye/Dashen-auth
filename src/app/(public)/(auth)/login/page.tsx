import OtpForm from "@/components/OtpForm";
import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return <OtpForm />;
}
