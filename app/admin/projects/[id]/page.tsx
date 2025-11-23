"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProjectSchema } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/lib/uploadthing";
import { getProject, getProjectImages, updateProject, deleteProject, createProjectImage, deleteProjectImage } from "@/services/api";
import toast from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectImage } from "@/types";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [mainImageUrl, setMainImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: project, isLoading } = useSWR(`project-${id}`, () => getProject(id));
  const { data: images = [], mutate: mutateImages } = useSWR<ProjectImage[]>(
    project ? `project-images-${id}` : null,
    () => getProjectImages(id)
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    values: project
      ? {
          title: project.title,
          category: project.category,
          description: project.description,
          mainImage: project.mainImage,
          externalLink: project.externalLink,
        }
      : undefined,
  });

  if (isLoading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (!project) {
    return <div className="text-center py-12">Projet non trouvé</div>;
  }

  if (project.mainImage && !mainImageUrl) {
    setMainImageUrl(project.mainImage);
  }

  const onSubmit = async (data: z.infer<typeof updateProjectSchema>) => {
    try {
      await updateProject(id, {
        ...data,
        mainImage: mainImageUrl || data.mainImage,
        externalLink: data.externalLink || undefined,
      });
      toast.success("Projet mis à jour avec succès!");
      router.push("/admin/projects");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProject(id);
      toast.success("Projet supprimé avec succès");
      router.push("/admin/projects");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const handleAddGalleryImage = async (url: string) => {
    try {
      await createProjectImage({ projectId: id, imageUrl: url });
      toast.success("Image ajoutée à la galerie!");
      mutateImages();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'ajout");
    }
  };

  const handleDeleteGalleryImage = async (imageId: string) => {
    try {
      await deleteProjectImage(imageId);
      toast.success("Image supprimée!");
      mutateImages();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin/projects">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </Button>
        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
          <Trash2 className="w-4 h-4 mr-2" />
          Supprimer
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Modifier le projet</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6 mb-8">
        <div>
          <Label htmlFor="title">Titre</Label>
          <Input id="title" {...register("title")} disabled={isSubmitting} />
          {errors.title && (
            <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category">Catégorie</Label>
          <Input id="category" {...register("category")} disabled={isSubmitting} />
          {errors.category && (
            <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} rows={6} disabled={isSubmitting} />
          {errors.description && (
            <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="externalLink">Lien externe</Label>
          <Input id="externalLink" {...register("externalLink")} type="url" disabled={isSubmitting} />
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

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/projects">Annuler</Link>
          </Button>
        </div>
      </form>

      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">Galerie d&apos;images</h2>
        <div className="mb-4">
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res && res[0]) {
                handleAddGalleryImage(res[0].url);
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
        </div>
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image._id} className="relative group">
                <img
                  src={typeof image.imageUrl === "string" ? image.imageUrl : image.imageUrl}
                  alt="Gallery"
                  className="w-full h-32 object-cover rounded"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteGalleryImage(image._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le projet</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce projet? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
