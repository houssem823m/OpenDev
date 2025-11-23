"use client";

import { use } from "react";
import useSWR from "swr";
import Image from "next/image";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import OrderModal from "@/components/OrderModal";
import { getService } from "@/services/api";
import { Service } from "@/types";
import { useState } from "react";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export default function ServicePage({ params }: ServicePageProps) {
  const { slug } = use(params);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const { data: service, error, isLoading } = useSWR<Service>(
    `service-${slug}`,
    () => getService(slug)
  );

  if (isLoading) {
    return (
      <Container>
        <div className="min-h-screen py-12">
          <div className="h-96 bg-muted animate-pulse rounded-lg mb-8" />
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded w-1/2" />
            <div className="h-4 bg-muted animate-pulse rounded w-full" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
          </div>
        </div>
      </Container>
    );
  }

  if (error || !service) {
    return (
      <Container>
        <div className="min-h-screen py-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-2">Service non trouvé</h2>
            <p className="text-muted-foreground">Le service demandé n&apos;existe pas</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="min-h-screen py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden">
            {service.image ? (
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <svg
                  className="w-32 h-32 text-primary/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
            <div className="prose max-w-none mb-6">
              <p className="text-muted-foreground text-lg whitespace-pre-line">
                {service.description}
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => setOrderModalOpen(true)}
              className="w-full lg:w-auto"
            >
              Commander ce service
            </Button>
          </div>
        </div>
      </div>

      <OrderModal
        open={orderModalOpen}
        onOpenChange={setOrderModalOpen}
        service={service}
      />
    </Container>
  );
}
