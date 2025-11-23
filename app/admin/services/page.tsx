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
import { getServices, deleteService } from "@/services/api";
import api from "@/services/api";
import { Service } from "@/types";
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

const fetcher = () => getServices();

export default function AdminServicesPage() {
  const [showArchived, setShowArchived] = useState(false);
  const { data: services, mutate, isLoading } = useSWR<Service[]>("admin-services", fetcher);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const filteredServices = services?.filter((s) => 
    showArchived ? s.isArchived : !s.isArchived
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      toast.success("Service supprimé avec succès");
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
        <h1 className="text-3xl font-bold">Services</h1>
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
            <Link href="/admin/services/add">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un service
            </Link>
          </Button>
        </div>
      </div>

      {filteredServices && filteredServices.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service._id}>
                  <TableCell>
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{service.title}</TableCell>
                  <TableCell>{service.slug}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {service.description}
                  </TableCell>
                  <TableCell>
                    {service.isArchived ? (
                      <span className="text-xs px-2 py-1 bg-muted rounded">Archivé</span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Actif</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/services/${service._id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      {service.isArchived ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              await api.put(`/services/${service._id}`, { isArchived: false });
                              toast.success("Service restauré");
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
                              await api.put(`/services/${service._id}`, { isArchived: true });
                              toast.success("Service archivé");
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
                        onClick={() => setDeleteId(service._id)}
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
          Aucun service. <Link href="/admin/services/add" className="text-primary">Ajouter un service</Link>
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le service</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce service? Cette action est irréversible.
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
