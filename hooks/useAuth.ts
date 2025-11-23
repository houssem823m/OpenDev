import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User } from "@/types";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const user = session?.user as User | undefined;
  const isAdmin = user?.role === "admin";
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const ensureAdmin = () => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/login");
      return false;
    }
    return true;
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    ensureAdmin,
  };
}

