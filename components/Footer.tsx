import Container from "@/components/Container";
import Logo from "@/components/Logo";
import Link from "next/link";
import { Github, Linkedin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-20">
      <Container>
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo showText={true} />
            <p className="text-sm text-muted-foreground">
              Transformez vos idées en solutions digitales performantes et élégantes.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors">
                  Projets
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Développement Web</li>
              <li>Design UI/UX</li>
              <li>Consulting</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                contact@opendev.com
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                +33 1 23 45 67 89
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t py-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} OpenDev. Tous droits réservés.</p>
        </div>
      </Container>
    </footer>
  );
}
