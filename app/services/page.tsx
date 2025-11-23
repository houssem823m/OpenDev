"use client";

import useSWR from "swr";
import Container from "@/components/Container";
import ServiceCard from "@/components/ServiceCard";
import { getServices } from "@/services/api";
import { Service } from "@/types";

const fetcher = () => getServices();

export default function ServicesPage() {
  const { data: services, error, isLoading } = useSWR<Service[]>("services", fetcher);

  if (error) {
    return (
      <Container>
        <div className="min-h-screen py-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-2">Erreur</h2>
            <p className="text-muted-foreground">Impossible de charger les services</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="min-h-screen py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Nos <span className="text-primary">Services</span>
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Des solutions sur mesure pour transformer vos idées en réalité digitale
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-96 bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun service disponible pour le moment</p>
          </div>
        )}
      </div>
    </Container>
  );
}
