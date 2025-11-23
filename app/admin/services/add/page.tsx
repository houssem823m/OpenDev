"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createServiceSchema } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/lib/uploadthing";
import { createService } from "@/services/api";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { slugify } from "@/lib/utils/slugify";

export default function AddServicePage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<z.infer<typeof createServiceSchema>>({
    resolver: zodResolver(createServiceSchema),
  });

  const title = watch("title");
  const autoSlug = title ? slugify(title) : "";
  
  // Auto-update slug when title changes and slug is empty or matches old auto-slug
  useEffect(() => {
    if (title && (!watch("slug") || watch("slug") === slugify(title))) {
      setValue("slug", autoSlug);
    }
  }, [title, autoSlug, setValue, watch]);

  const onSubmit = async (data: z.infer<typeof createServiceSchema>) => {
    try {
      await createService({
        ...data,
        image: imageUrl || undefined,
        slug: data.slug || autoSlug || "",
      });
      toast.success("Service créé avec succès!");
      router.push("/admin/services");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/admin/services">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Ajouter un service</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div>
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Nom du service"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            {...register("slug")}
            placeholder={autoSlug || "slug-du-service"}
            disabled={isSubmitting}
          />
          {errors.slug && (
            <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Généré automatiquement à partir du titre si vide
          </p>
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Description du service..."
            rows={6}
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <Label>Image</Label>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res && res[0]) {
                setImageUrl(res[0].url);
                setIsUploading(false);
                toast.success("Image uploadée avec succès!");
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
          {imageUrl && (
            <div className="mt-4">
              <img src={imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded" />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting ? "Création..." : "Créer le service"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/services">Annuler</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
