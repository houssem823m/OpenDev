"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select } from "@/components/ui/select";
import { deleteUser } from "@/services/api";
import api from "@/services/api";
import { User } from "@/types";
import { Trash2, CheckSquare, Square } from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UsersResponse {
  items: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const swrKey = `users?search=${searchTerm}&page=${page}&limit=${limit}`;

  const { data, mutate, isLoading } = useSWR<{ success: boolean; data: UsersResponse }>(
    swrKey,
    async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const { data } = await api.get(`/users?${params.toString()}`);
      return data;
    }
  );

  const users = data?.data?.items || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 0;

  const handleRoleChange = async (userId: string, newRole: "user" | "admin") => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      toast.success("Rôle mis à jour");
      mutate();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  const handleBanToggle = async (userId: string, isBanned: boolean) => {
    try {
      await api.put(`/users/${userId}/ban`, { isBanned: !isBanned });
      toast.success(isBanned ? "Utilisateur débani" : "Utilisateur banni");
      mutate();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  const handleBulkRoleChange = async (newRole: "user" | "admin") => {
    try {
      await Promise.all(
        Array.from(selectedUsers).map((id) => api.put(`/users/${id}/role`, { role: newRole }))
      );
      toast.success(`${selectedUsers.size} utilisateur(s) mis à jour`);
      setSelectedUsers(new Set());
      mutate();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  const handleBulkBanToggle = async (isBanned: boolean) => {
    try {
      await Promise.all(
        Array.from(selectedUsers).map((id) =>
          api.put(`/users/${id}/ban`, { isBanned: !isBanned })
        )
      );
      toast.success(
        `${selectedUsers.size} utilisateur(s) ${isBanned ? "débani(s)" : "banni(s)"}`
      );
      setSelectedUsers(new Set());
      mutate();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(Array.from(selectedUsers).map((id) => deleteUser(id)));
      toast.success(`${selectedUsers.size} utilisateur(s) supprimé(s)`);
      setSelectedUsers(new Set());
      mutate();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      toast.success("Utilisateur supprimé");
      mutate();
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const toggleSelect = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map((u) => u._id)));
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Utilisateurs</h1>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Rechercher par nom ou email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="max-w-md"
        />
      </div>

      {/* Bulk Actions */}
      {selectedUsers.size > 0 && (
        <div className="mb-4 p-4 bg-primary/10 rounded-lg flex items-center gap-4 flex-wrap">
          <span className="font-medium">{selectedUsers.size} sélectionné(s)</span>
          <Select
            onChange={(e) => handleBulkRoleChange(e.target.value as "user" | "admin")}
            defaultValue=""
          >
            <option value="" disabled>
              Changer le rôle
            </option>
            <option value="user">Utilisateur</option>
            <option value="admin">Admin</option>
          </Select>
          <Button variant="outline" size="sm" onClick={() => handleBulkBanToggle(false)}>
            Bannir
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleBulkBanToggle(true)}>
            Débannir
          </Button>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            Supprimer
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSelectedUsers(new Set())}>
            Annuler
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : users.length > 0 ? (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <button onClick={toggleSelectAll}>
                      {selectedUsers.size === users.length ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <button onClick={() => toggleSelect(user._id)}>
                        {selectedUsers.has(user._id) ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                        {getInitials(user.name)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value as "user" | "admin")
                        }
                      >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Admin</option>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={user.isBanned ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => handleBanToggle(user._id, user.isBanned)}
                      >
                        {user.isBanned ? "Banni" : "Actif"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(user._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Affichage de {(page - 1) * limit + 1} à {Math.min(page * limit, total)} sur {total}
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={limit.toString()}
                onChange={(e) => {
                  setLimit(parseInt(e.target.value));
                  setPage(1);
                }}
                className="w-24"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Précédent
              </Button>
              <span className="text-sm">
                Page {page} sur {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Suivant
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-muted-foreground">Aucun utilisateur</div>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;utilisateur</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={() => deleteId && handleDelete(deleteId)}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
