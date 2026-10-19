
import { ContentSurface } from "@/components/content/ContentProvider";
import AuthPage from "@/components/auth/AuthPage";
import "./auth.css";

export default function LoginPage() {
  return <ContentSurface scope="src/app/[locale]/dang-nhap/page.tsx"><AuthPage /></ContentSurface>;
}
