import { Profile } from "@/components/public/pages/profile"
import { isProfileTab } from "@/components/public/pages/profile/config";
import { redirect } from "next/navigation";

export default async function page({ params }: { params: Promise<{ active_tab: string }> }) {
  const { active_tab } = await params;
  if (!isProfileTab(active_tab)) {
    console.error(`Invalid profile tab: ${active_tab}`);
    return redirect("/profile");
  }
  return <Profile />
}