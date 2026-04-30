import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { LabNav } from "@/components/lab/LabNav";
import "@/app/lab.css";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="lab-shell">
      <LabNav userEmail={user?.email} />
      <div className="lab-main">
        {children}
      </div>
    </div>
  );
}
