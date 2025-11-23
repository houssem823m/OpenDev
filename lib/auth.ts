import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 [AUTH] Starting authentication...");
        
        if (!credentials?.email || !credentials?.password) {
          console.error("❌ [AUTH] Missing credentials:", { 
            hasEmail: !!credentials?.email, 
            hasPassword: !!credentials?.password 
          });
          throw new Error("Email et mot de passe requis.");
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();
        console.log("📧 [AUTH] Email received:", credentials.email);
        console.log("📧 [AUTH] Normalized email:", normalizedEmail);

        try {
          await connectDB();
          console.log("✅ [AUTH] Database connected");
        } catch (error) {
          console.error("❌ [AUTH] Database connection failed:", error);
          throw new Error("Erreur de connexion à la base de données.");
        }

        const user = await User.findOne({ email: normalizedEmail });
        console.log("👤 [AUTH] User lookup result:", user ? "User found" : "User NOT found");

        if (!user) {
          console.error("❌ [AUTH] User not found for email:", normalizedEmail);
          throw new Error("Identifiants incorrects.");
        }

        console.log("👤 [AUTH] User details:", {
          id: user._id?.toString(),
          email: user.email,
          role: user.role,
          isBanned: user.isBanned,
          isVerified: user.isVerified,
          hasPassword: !!user.password,
          passwordLength: user.password?.length,
          passwordPrefix: user.password?.substring(0, 10) + "...",
        });

        if (user.isBanned) {
          console.error("❌ [AUTH] User is banned");
          throw new Error("Ce compte a été suspendu. Contactez un administrateur.");
        }

        const requireVerification = process.env.REQUIRE_EMAIL_VERIFICATION === "true";
        console.log("📧 [AUTH] Email verification check:", {
          REQUIRE_EMAIL_VERIFICATION: process.env.REQUIRE_EMAIL_VERIFICATION,
          requireVerification,
          isVerified: user.isVerified,
        });

        if (requireVerification && !user.isVerified) {
          console.error("❌ [AUTH] Email not verified");
          throw new Error("Veuillez vérifier votre email avant de vous connecter.");
        }

        console.log("🔑 [AUTH] Comparing password...");
        console.log("🔑 [AUTH] Password hash format:", {
          length: user.password?.length,
          startsWith: user.password?.substring(0, 7),
          isValidFormat: user.password?.startsWith("$2a$") || user.password?.startsWith("$2b$"),
        });

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        console.log("🔑 [AUTH] Password comparison result:", isValidPassword ? "✅ VALID" : "❌ INVALID");

        if (!isValidPassword) {
          console.error("❌ [AUTH] Password mismatch");
          console.error("🔑 [AUTH] Debug info:", {
            providedPasswordLength: credentials.password.length,
            storedHashLength: user.password?.length,
            storedHashPrefix: user.password?.substring(0, 20),
          });
          throw new Error("Identifiants incorrects.");
        }

        console.log("✅ [AUTH] Authentication successful!");
        console.log("✅ [AUTH] Returning user:", {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        });

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

