"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/lib/uploadthing";
import { createProject, createProjectImage } from "@/services/api";
import toast from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddProjectPage() {
  const router = useRouter();
  const [mainImageUrl, setMainImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
  });

  const onSubmit = async (data: z.infer<typeof createProjectSchema>) => {
    try {
      const project = await createProject({
        ...data,
        mainImage: mainImageUrl || undefined,
        externalLink: data.externalLink || undefined,
      });
      
      setProjectId(project._id);
      toast.success("Projet créé avec succès!");

      // Upload gallery images if any
      if (galleryImages.length > 0) {
        for (const imageUrl of galleryImages) {
          await createProjectImage({
            projectId: project._id,
            imageUrl,
          });
        }
        toast.success("Images de la galerie ajoutées!");
      }

      router.push("/admin/projects");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création");
    }
  };

  const handleGalleryUpload = (url: string) => {
    setGalleryImages([...galleryImages, url]);
    toast.success("Image ajoutée à la galerie!");
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/admin/projects">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Ajouter un projet</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div>
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Nom du projet"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category">Catégorie *</Label>
          <Input
            id="category"
            {...register("category")}
            placeholder="Web, Mobile, Design, etc."
            disabled={isSubmitting}
          />
          {errors.category && (
            <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Description du projet..."
            rows={6}
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="externalLink">Lien externe</Label>
          <Input
            id="externalLink"
            {...register("externalLink")}
            placeholder="https://example.com"
            type="url"
            disabled={isSubmitting}
          />
          {errors.externalLink && (
            <p className="text-sm text-destructive mt-1">{errors.externalLink.message}</p>
          )}
        </div>

        <div>
          <Label>Image principale</Label>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res && res[0]) {
                setMainImageUrl(res[0].url);
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
          {mainImageUrl && (
            <div className="mt-4">
              <img src={mainImageUrl} alt="Preview" className="w-32 h-32 object-cover rounded" />
            </div>
          )}
        </div>

        {projectId && (
          <div>
            <Label>Galerie d&apos;images (optionnel)</Label>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res[0]) {
                  handleGalleryUpload(res[0].url);
                  setIsUploading(false);
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
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {galleryImages.map((url, idx) => (
                  <img key={idx} src={url} alt={`Gallery ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting ? "Création..." : "Créer le projet"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/projects">Annuler</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
