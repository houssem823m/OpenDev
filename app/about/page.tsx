"use client";

import useSWR from "swr";
import Container from "@/components/Container";
import { getContent } from "@/services/api";
import { motion } from "framer-motion";
import { CheckCircle, Users, Target, Award } from "lucide-react";

export default function AboutPage() {
  const { data: content, isLoading } = useSWR("site-content", getContent);

  if (isLoading) {
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

  const about = content?.about || {
    excerpt: "Nous sommes une équipe passionnée de développement",
    description: "OpenDev est une agence spécialisée dans le développement web et mobile.",
  };

  const advantages = content?.advantages || [
    {
      title: "Qualité",
      description: "Code de qualité et maintenable",
    },
    {
      title: "Rapidité",
      description: "Livraison rapide et efficace",
    },
    {
      title: "Support",
      description: "Support continu après livraison",
    },
  ];

  return (
    <Container>
      <div className="min-h-screen py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-primary">À propos</span>{" "}
            <span className="text-foreground">de nous</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {about.excerpt}
          </p>
        </motion.div>

        {/* About Description */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-soft">
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                {about.description || about.excerpt}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Advantages Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Pourquoi nous <span className="text-primary">choisir</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((advantage: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 shadow-soft hover:shadow-soft-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {index === 0 && <Award className="w-6 h-6 text-primary" />}
                    {index === 1 && <Target className="w-6 h-6 text-primary" />}
                    {index === 2 && <Users className="w-6 h-6 text-primary" />}
                    {!index && index !== 0 && index !== 1 && index !== 2 && (
                      <CheckCircle className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">
                      {advantage.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {advantage.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12 border border-border"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Nos <span className="text-primary">valeurs</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Excellence</h3>
                <p className="text-muted-foreground">
                  Nous visons l&apos;excellence dans chaque projet, en utilisant les meilleures pratiques et technologies.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Transparence</h3>
                <p className="text-muted-foreground">
                  Communication claire et transparente tout au long du processus de développement.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Innovation</h3>
                <p className="text-muted-foreground">
                  Nous restons à la pointe de la technologie pour offrir des solutions modernes et performantes.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Engagement</h3>
                <p className="text-muted-foreground">
                  Nous nous engageons à livrer des projets de qualité dans les délais convenus.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </Container>
  );
}
