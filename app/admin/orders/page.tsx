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
import { updateOrder, deleteOrder, getServices } from "@/services/api";
import { Order, Service } from "@/types";
import { Trash2, Download, CheckSquare, Square } from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/services/api";

interface OrdersResponse {
  items: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Build SWR key with filters
  const swrKey = `orders?status=${statusFilter}&serviceId=${serviceFilter}&q=${searchTerm}&from=${dateFrom}&to=${dateTo}&page=${page}&limit=${limit}`;

  const { data, mutate, isLoading } = useSWR<{ success: boolean; data: OrdersResponse }>(
    swrKey,
    async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (serviceFilter !== "all") params.append("serviceId", serviceFilter);
      if (searchTerm) params.append("q", searchTerm);
      if (dateFrom) params.append("from", dateFrom);
      if (dateTo) params.append("to", dateTo);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const { data } = await api.get(`/orders?${params.toString()}`);
      return data;
    }
  );

  const { data: services } = useSWR<Service[]>("services", () => getServices());

  const orders = data?.data?.items || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 0;

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      toast.success("Statut mis à jour");
      mutate();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  const handleBulkStatusChange = async (newStatus: Order["status"]) => {
    try {
      await Promise.all(
        Array.from(selectedOrders).map((id) => updateOrder(id, { status: newStatus }))
      );
      toast.success(`${selectedOrders.size} commande(s) mise(s) à jour`);
      setSelectedOrders(new Set());
      mutate();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(Array.from(selectedOrders).map((id) => deleteOrder(id)));
      toast.success(`${selectedOrders.size} commande(s) supprimée(s)`);
      setSelectedOrders(new Set());
      mutate();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOrder(id);
      toast.success("Commande supprimée");
      mutate();
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const handleExport = () => {
    const csv = [
      ["ID", "Service", "Nom", "Email", "Message", "Statut", "Date"].join(","),
      ...orders.map((order) => {
        const service = typeof order.serviceId === "object" ? order.serviceId : null;
        return [
          order._id,
          service?.title || "N/A",
          order.name,
          order.email,
          `"${order.message.replace(/"/g, '""')}"`,
          order.status,
          new Date(order.createdAt).toLocaleDateString("fr-FR"),
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Export réussi!");
  };

  const toggleSelect = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedOrders.size === orders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map((o) => o._id)));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Commandes</h1>
        <Button onClick={handleExport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exporter CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
        <Input
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="in_progress">En cours</option>
          <option value="done">Terminé</option>
          <option value="cancelled">Annulé</option>
        </Select>
        <Select
          value={serviceFilter}
          onChange={(e) => {
            setServiceFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">Tous les services</option>
          {services?.map((service) => (
            <option key={service._id} value={service._id}>
              {service.title}
            </option>
          ))}
        </Select>
        <Input
          type="date"
          placeholder="Du"
          value={dateFrom}
          onChange={(e) => {
            setDateFrom(e.target.value);
            setPage(1);
          }}
        />
        <Input
          type="date"
          placeholder="Au"
          value={dateTo}
          onChange={(e) => {
            setDateTo(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Bulk Actions */}
      {selectedOrders.size > 0 && (
        <div className="mb-4 p-4 bg-primary/10 rounded-lg flex items-center gap-4">
          <span className="font-medium">{selectedOrders.size} sélectionné(s)</span>
          <Select
            onChange={(e) => handleBulkStatusChange(e.target.value as Order["status"])}
            defaultValue=""
          >
            <option value="" disabled>
              Changer le statut
            </option>
            <option value="pending">En attente</option>
            <option value="in_progress">En cours</option>
            <option value="done">Terminé</option>
            <option value="cancelled">Annulé</option>
          </Select>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            Supprimer
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSelectedOrders(new Set())}>
            Annuler
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : orders.length > 0 ? (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <button onClick={toggleSelectAll}>
                      {selectedOrders.size === orders.length ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Fichier</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const service = typeof order.serviceId === "object" ? order.serviceId : null;
                  return (
                    <TableRow key={order._id}>
                      <TableCell>
                        <button onClick={() => toggleSelect(order._id)}>
                          {selectedOrders.has(order._id) ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{order._id.slice(-8)}</TableCell>
                      <TableCell className="font-medium">
                        {service?.title || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{order.name}</div>
                          <div className="text-sm text-muted-foreground">{order.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md truncate">{order.message}</TableCell>
                      <TableCell>
                        {order.fileUrl && (
                          <Button variant="link" size="sm" asChild>
                            <a href={order.fileUrl} target="_blank" rel="noopener noreferrer">
                              Voir
                            </a>
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value as Order["status"])
                          }
                          className="w-32"
                        >
                          <option value="pending">En attente</option>
                          <option value="in_progress">En cours</option>
                          <option value="done">Terminé</option>
                          <option value="cancelled">Annulé</option>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteId(order._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
                <option value="100">100</option>
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
        <div className="text-center py-12 text-muted-foreground">
          Aucune commande trouvée
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la commande</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette commande? Cette action est irréversible.
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
