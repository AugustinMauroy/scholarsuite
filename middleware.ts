import { withAuth } from "next-auth/middleware";
import nextAuthConfig from "@/lib/auth";

export default withAuth({
  pages: nextAuthConfig.pages,
});
