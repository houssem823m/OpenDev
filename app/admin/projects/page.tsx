"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProjects, deleteProject } from "@/services/api";
import api from "@/services/api";
import { Project } from "@/types";
import { Plus, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const fetcher = () => getProjects();

export default function AdminProjectsPage() {
  const [showArchived, setShowArchived] = useState(false);
  const { data: projects, mutate, isLoading } = useSWR<Project[]>("admin-projects", fetcher);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const filteredProjects = projects?.filter((p) => 
    showArchived ? p.isArchived : !p.isArchived
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      toast.success("Projet supprimé avec succès");
      mutate();
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projets</h1>
        <div className="flex gap-2">
          <Button
            variant={showArchived ? "outline" : "default"}
            onClick={() => setShowArchived(false)}
          >
            Actifs
          </Button>
          <Button
            variant={showArchived ? "default" : "outline"}
            onClick={() => setShowArchived(true)}
          >
            Archivés
          </Button>
          <Button asChild>
            <Link href="/admin/projects/add">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un projet
            </Link>
          </Button>
        </div>
      </div>

      {filteredProjects && filteredProjects.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell>
                    {project.mainImage ? (
                      <img
                        src={project.mainImage}
                        alt={project.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {project.description || "-"}
                  </TableCell>
                  <TableCell>
                    {project.isArchived ? (
                      <span className="text-xs px-2 py-1 bg-muted rounded">Archivé</span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Actif</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/projects/${project._id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      {project.isArchived ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              await api.put(`/projects/${project._id}`, { isArchived: false });
                              toast.success("Projet restauré");
                              mutate();
                            } catch (error: any) {
                              toast.error(error.message);
                            }
                          }}
                        >
                          Restaurer
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              await api.put(`/projects/${project._id}`, { isArchived: true });
                              toast.success("Projet archivé");
                              mutate();
                            } catch (error: any) {
                              toast.error(error.message);
                            }
                          }}
                        >
                          Archiver
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(project._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          Aucun projet. <Link href="/admin/projects/add" className="text-primary">Ajouter un projet</Link>
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le projet</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce projet? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
