"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrderSchema } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/lib/uploadthing";
import { useState } from "react";
import toast from "react-hot-toast";

interface OrderFormProps {
  serviceId: string;
  onSubmit: (data: z.infer<typeof createOrderSchema>) => Promise<void>;
}

export default function OrderForm({ serviceId, onSubmit }: OrderFormProps) {
  const [fileUrl, setFileUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof createOrderSchema>>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      serviceId,
      name: "",
      email: "",
      message: "",
      fileUrl: "",
    },
  });

  const onFormSubmit = async (data: z.infer<typeof createOrderSchema>) => {
    try {
      await onSubmit({ ...data, fileUrl: fileUrl || undefined });
      reset();
      setFileUrl("");
      toast.success("Commande créée avec succès!");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création de la commande");
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom complet *</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Votre nom"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="votre@email.com"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Décrivez votre projet..."
          rows={5}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
        )}
      </div>

      <div>
        <Label>Fichier (optionnel)</Label>
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res && res[0]) {
              setFileUrl(res[0].url);
              setIsUploading(false);
              toast.success("Fichier uploadé avec succès!");
            }
          }}
          onUploadError={(error: Error) => {
            setIsUploading(false);
            toast.error(`Erreur: ${error.message}`);
          }}
          onUploadBegin={() => {
            setIsUploading(true);
          }}
        />
        {fileUrl && (
          <p className="text-sm text-muted-foreground mt-2">
            Fichier uploadé: {fileUrl.substring(0, 50)}...
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting || isUploading} className="w-full">
        {isSubmitting ? "Envoi..." : "Commander ce service"}
      </Button>
    </form>
  );
}

