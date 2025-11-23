"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Project } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight, FolderKanban } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="group h-full overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-soft-lg flex flex-col bg-card">
        {project.mainImage ? (
          <div className="relative h-64 w-full overflow-hidden bg-muted">
            <Image
              src={project.mainImage}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/90 backdrop-blur-sm text-white border border-primary">
                {project.category}
              </span>
            </div>
            {project.externalLink && (
              <a
                href={project.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-4 right-4 p-2 rounded-full bg-background/90 backdrop-blur-sm border border-border hover:border-secondary hover:bg-secondary/10 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4 text-foreground hover:text-secondary" />
              </a>
            )}
          </div>
        ) : (
          <div className="relative h-64 w-full bg-muted flex items-center justify-center">
            <FolderKanban className="w-16 h-16 text-primary/30" />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/90 backdrop-blur-sm text-white border border-primary">
                {project.category}
              </span>
            </div>
          </div>
        )}
        <CardContent className="p-6 flex-1 flex flex-col">
          <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          {project.description && (
            <p className="text-foreground/70 mb-6 line-clamp-3 flex-1 leading-relaxed">
              {project.description}
            </p>
          )}
          <Button asChild variant="default" className="w-full group/btn">
            <Link href={`/projects/${project._id}`}>
              Voir le projet
              <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
