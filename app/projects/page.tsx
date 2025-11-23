"use client";

import useSWR from "swr";
import Container from "@/components/Container";
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/services/api";
import { Project } from "@/types";

const fetcher = () => getProjects();

export default function ProjectsPage() {
  const { data: projects, error, isLoading } = useSWR<Project[]>("projects", fetcher);

  if (error) {
    return (
      <Container>
        <div className="min-h-screen py-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-2">Erreur</h2>
            <p className="text-muted-foreground">Impossible de charger les projets</p>
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
            Nos <span className="text-primary">Réalisations</span>
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Découvrez les projets que nous avons créés pour nos clients
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
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun projet disponible pour le moment</p>
          </div>
        )}
      </div>
    </Container>
  );
}
