"use client";

import { use } from "react";
import useSWR from "swr";
import Container from "@/components/Container";
import ProjectGallery from "@/components/ProjectGallery";
import { Button } from "@/components/ui/button";
import { getProject, getProjectImages } from "@/services/api";
import { Project, ProjectImage } from "@/types";
import { ExternalLink, Calendar, Copy, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { id } = use(params);
  const [copied, setCopied] = useState(false);

  const { data: project, error: projectError, isLoading: projectLoading } = useSWR<Project>(
    `project-${id}`,
    () => getProject(id)
  );

  const { data: images = [] } = useSWR<ProjectImage[]>(
    project ? `project-images-${id}` : null,
    () => getProjectImages(id)
  );

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Lien copié!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (projectLoading) {
    return (
      <Container>
        <div className="min-h-screen py-12">
          <div className="h-96 bg-muted animate-pulse rounded-lg mb-8" />
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded w-1/2" />
            <div className="h-4 bg-muted animate-pulse rounded w-full" />
          </div>
        </div>
      </Container>
    );
  }

  if (projectError || !project) {
    return (
      <Container>
        <div className="min-h-screen py-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-2">Projet non trouvé</h2>
            <p className="text-muted-foreground">Le projet demandé n&apos;existe pas</p>
          </div>
        </div>
      </Container>
    );
  }

  const formattedDate = new Date(project.createdAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Container>
      <div className="min-h-screen py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{project.title}</h1>
                <span className="px-3 py-1 bg-secondary/20 rounded-full text-sm text-secondary-foreground">
                  {project.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyLink}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              {project.externalLink && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.externalLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Voir le projet
                  </a>
                </Button>
              )}
            </div>
          </div>

          {project.description && (
            <div className="prose max-w-none mb-8">
              <p className="text-muted-foreground text-lg whitespace-pre-line">
                {project.description}
              </p>
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Galerie</h2>
          <ProjectGallery images={images} mainImage={project.mainImage} />
        </div>
      </div>
    </Container>
  );
}
