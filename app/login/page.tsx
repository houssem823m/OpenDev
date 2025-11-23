"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock } from "lucide-react";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Veuillez saisir un email valide."),
  password: z.string().min(6, "Votre mot de passe doit contenir au moins 6 caractères."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl,
    });

    if (result?.error) {
      setServerError(
        result.error === "CredentialsSignin"
          ? "Identifiants incorrects. Vérifiez votre email et votre mot de passe."
          : result.error
      );
      return;
    }

    setSuccessMessage("Connexion réussie, redirection en cours...");
    setTimeout(() => {
      router.push(result?.url || callbackUrl);
    }, 750);
  };

  return (
    <Container>
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-soft relative overflow-hidden">
          <div className="absolute -top-16 -right-10 opacity-10">
            <Lock className="w-32 h-32 text-primary" />
          </div>

          <div className="relative mb-8 text-center space-y-2">
            <h1 className="text-4xl font-bold text-primary">Connexion</h1>
            <p className="text-muted-foreground">
              Accédez à l&apos;espace administrateur pour gérer vos contenus.
            </p>
          </div>

          <form className="space-y-6 relative" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@opendev.com"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            {successMessage && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm text-primary">
                {successMessage}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connexion...
                </span>
              ) : (
                "Se connecter"
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Besoin d&apos;un accès ? Contactez un administrateur pour créer votre compte.
            </p>
          </form>
        </div>
      </div>
    </Container>
  );
}

