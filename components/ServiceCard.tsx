"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Service } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface ServiceCardProps {
  service: Service;
  index?: number;
}

export default function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="group h-full overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-soft-lg flex flex-col bg-card">
        {service.image ? (
          <div className="relative h-56 w-full overflow-hidden bg-muted">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="relative h-56 w-full bg-muted flex items-center justify-center">
            <Sparkles className="w-16 h-16 text-primary/30" />
          </div>
        )}
        <CardContent className="p-6 flex-1 flex flex-col">
          <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
            {service.title}
          </h3>
          <p className="text-foreground/70 mb-6 line-clamp-3 flex-1 leading-relaxed">
            {service.description}
          </p>
          <Button asChild variant="default" className="w-full group/btn">
            <Link href={`/services/${service.slug}`}>
              Découvrir
              <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
