"use client";

import useSWR from "swr";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getServices, getProjects, getOrders, getUsers } from "@/services/api";
import { Package, FolderKanban, ShoppingCart, Users } from "lucide-react";

export default function AdminPage() {
  const { data: services } = useSWR("dashboard-services", () => getServices());
  const { data: projects } = useSWR("dashboard-projects", () => getProjects());
  const { data: orders } = useSWR("dashboard-orders", () => getOrders());
  const { data: users } = useSWR("dashboard-users", () => getUsers());

  const stats = [
    {
      title: "Services",
      value: services?.length || 0,
      icon: Package,
      href: "/admin/services",
    },
    {
      title: "Projets",
      value: projects?.length || 0,
      icon: FolderKanban,
      href: "/admin/projects",
    },
    {
      title: "Commandes",
      value: orders?.length || 0,
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    {
      title: "Utilisateurs",
      value: users?.length || 0,
      icon: Users,
      href: "/admin/users",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link href={stat.href}>Voir tout →</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
