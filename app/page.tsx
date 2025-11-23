"use client";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, Code, Palette, Rocket, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 md:py-32 border-b border-border/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm font-medium text-primary"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Développement Web sur Mesure</span>
            </motion.div>
            
            <div className="flex flex-col items-center gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-24 h-24 rounded-2xl border-4 border-primary flex items-center justify-center bg-background shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-primary text-4xl font-bold">&lt;</span>
                  <span className="text-secondary text-4xl font-bold">&gt;</span>
                </div>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="text-primary">
                  Open<span className="text-secondary">Dev</span>
                </span>
                <br />
                <span className="text-foreground">Votre Partenaire Digital</span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-foreground/70 max-w-2xl mx-auto font-normal">
              Transformez vos idées en solutions digitales performantes. 
              Nous créons des applications web modernes, élégantes et efficaces.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 group">
                <Link href="/services">
                  Découvrir nos services
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="/projects">
                  Voir nos réalisations
                </Link>
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-background">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Pourquoi Choisir <span className="text-primary">Open<span className="text-secondary">Dev</span></span> ?
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Des solutions sur mesure pour répondre à tous vos besoins digitaux
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Code,
                title: "Développement Moderne",
                description: "Technologies de pointe et frameworks performants pour des applications rapides et scalables.",
                color: "text-primary",
                bgColor: "bg-primary/10",
              },
              {
                icon: Palette,
                title: "Design Élégant",
                description: "Interfaces utilisateur intuitives et esthétiques qui captivent vos utilisateurs.",
                color: "text-secondary",
                bgColor: "bg-secondary/10",
              },
              {
                icon: Rocket,
                title: "Performance Optimale",
                description: "Applications optimisées pour la vitesse et l'efficacité, garantissant une expérience fluide.",
                color: "text-primary",
                bgColor: "bg-primary/10",
              },
              {
                icon: Shield,
                title: "Sécurité Renforcée",
                description: "Protection de vos données avec les meilleures pratiques de sécurité web.",
                color: "text-secondary",
                bgColor: "bg-secondary/10",
              },
              {
                icon: Zap,
                title: "Délais Respectés",
                description: "Livraison dans les temps avec un suivi transparent de votre projet.",
                color: "text-primary",
                bgColor: "bg-primary/10",
              },
              {
                icon: Sparkles,
                title: "Support Continu",
                description: "Accompagnement après livraison pour assurer le succès de votre projet.",
                color: "text-secondary",
                bgColor: "bg-secondary/10",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-soft-lg"
              >
                <div className={`inline-flex p-4 rounded-xl ${feature.bgColor} mb-6`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-foreground/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-muted/50 border-t border-border/50">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Prêt à Démarrer Votre Projet ?
            </h2>
            <p className="text-xl text-foreground/70">
              Contactez-nous dès aujourd&apos;hui pour discuter de vos besoins et obtenir un devis personnalisé.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/services">
                  Voir nos services
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="/projects">
                  Nos réalisations
                </Link>
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
