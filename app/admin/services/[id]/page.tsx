"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateServiceSchema } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/lib/uploadthing";
import { getServiceById, updateService, deleteService } from "@/services/api";
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

interface EditServicePageProps {
  params: { id: string };
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const { id } = params;
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: service, isLoading } = useSWR(
    `service-${id}`,
    () => getServiceById(id)
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof updateServiceSchema>>({
    resolver: zodResolver(updateServiceSchema),
    values: service
      ? {
          title: service.title,
          description: service.description,
          slug: service.slug,
          image: service.image,
        }
      : undefined,
  });

  if (isLoading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (!service) {
    return <div className="text-center py-12">Service non trouvé</div>;
  }

  if (service.image && !imageUrl) {
    setImageUrl(service.image);
  }

  const onSubmit = async (data: z.infer<typeof updateServiceSchema>) => {
    try {
      await updateService(id, {
        ...data,
        image: imageUrl || data.image,
      });
      toast.success("Service mis à jour avec succès!");
      router.push("/admin/services");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteService(id);
      toast.success("Service supprimé avec succès");
      router.push("/admin/services");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin/services">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </Button>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Supprimer
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Modifier le service</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div>
          <Label htmlFor="title">Titre</Label>
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
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            {...register("slug")}
            disabled={isSubmitting}
          />
          {errors.slug && (
            <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
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
            {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/services">Annuler</Link>
          </Button>
        </div>
      </form>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le service</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce service? Cette action est irréversible.
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
