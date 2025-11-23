"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/lib/uploadthing";
import api from "@/services/api";
import toast from "react-hot-toast";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    image?: string;
  };
  about: {
    excerpt: string;
    description: string;
  };
  advantages: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
  footer: {
    email: string;
    phone: string;
    hours: string;
  };
  siteImages: string[];
}

export default function AdminContentPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { data, mutate } = useSWR<{ success: boolean; data: SiteContent }>(
    "content",
    async () => {
      const { data } = await api.get("/content");
      return data;
    }
  );

  const [content, setContent] = useState<SiteContent>({
    hero: { title: "", subtitle: "", ctaText: "", ctaLink: "", image: "" },
    about: { excerpt: "", description: "" },
    advantages: [],
    footer: { email: "", phone: "", hours: "" },
    siteImages: [],
  });

  // Update local state when data loads
  useEffect(() => {
    if (data?.data) {
      setContent(data.data);
    }
  }, [data]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put("/content", content);
      toast.success("Contenu sauvegardé!");
      mutate();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const addAdvantage = () => {
    setContent({
      ...content,
      advantages: [...content.advantages, { title: "", description: "" }],
    });
  };

  const removeAdvantage = (index: number) => {
    setContent({
      ...content,
      advantages: content.advantages.filter((_, i) => i !== index),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestion du contenu</h1>
        <Button onClick={handleSave} disabled={isSaving || isUploading}>
          {isSaving ? "Sauvegarde..." : isUploading ? "Upload en cours..." : "Sauvegarder"}
        </Button>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Section Hero</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="heroTitle">Titre principal</Label>
              <Input
                id="heroTitle"
                value={content.hero.title}
                onChange={(e) => {
                  setContent({ ...content, hero: { ...content.hero, title: e.target.value } });
                }}
              />
            </div>
            <div>
              <Label htmlFor="heroSubtitle">Sous-titre</Label>
              <Input
                id="heroSubtitle"
                value={content.hero.subtitle}
                onChange={(e) => {
                  setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } });
                }}
              />
            </div>
            <div>
              <Label htmlFor="heroCtaText">Texte du bouton CTA</Label>
              <Input
                id="heroCtaText"
                value={content.hero.ctaText}
                onChange={(e) => {
                  setContent({ ...content, hero: { ...content.hero, ctaText: e.target.value } });
                }}
              />
            </div>
            <div>
              <Label htmlFor="heroCtaLink">Lien du bouton CTA</Label>
              <Input
                id="heroCtaLink"
                value={content.hero.ctaLink}
                onChange={(e) => {
                  setContent({ ...content, hero: { ...content.hero, ctaLink: e.target.value } });
                }}
              />
            </div>
            <div>
              <Label>Image Hero</Label>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    setContent({ ...content, hero: { ...content.hero, image: res[0].url } });
                    setIsUploading(false);
                    toast.success("Image uploadée!");
                  }
                }}
                onUploadError={(error: Error) => {
                  setIsUploading(false);
                  toast.error(`Erreur: ${error.message}`);
                }}
                onUploadBegin={() => {
                  setIsUploading(true);
                }}
              />
              {content.hero.image && (
                <img
                  src={content.hero.image}
                  alt="Hero"
                  className="mt-4 w-64 h-32 object-cover rounded"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle>Section À propos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="aboutExcerpt">Extrait</Label>
              <Input
                id="aboutExcerpt"
                value={content.about.excerpt}
                onChange={(e) => {
                  setContent({ ...content, about: { ...content.about, excerpt: e.target.value } });
                }}
              />
            </div>
            <div>
              <Label htmlFor="aboutDescription">Description complète</Label>
              <Textarea
                id="aboutDescription"
                value={content.about.description}
                onChange={(e) => {
                  setContent({ ...content, about: { ...content.about, description: e.target.value } });
                }}
                rows={8}
              />
            </div>
          </CardContent>
        </Card>

        {/* Advantages */}
        <Card>
          <CardHeader>
            <CardTitle>Avantages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.advantages.map((advantage, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Avantage {index + 1}</span>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeAdvantage(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Titre"
                  value={advantage.title}
                  onChange={(e) => {
                    const newAdvantages = [...content.advantages];
                    newAdvantages[index].title = e.target.value;
                    setContent({ ...content, advantages: newAdvantages });
                  }}
                />
                <Textarea
                  placeholder="Description"
                  value={advantage.description}
                  onChange={(e) => {
                    const newAdvantages = [...content.advantages];
                    newAdvantages[index].description = e.target.value;
                    setContent({ ...content, advantages: newAdvantages });
                  }}
                  rows={3}
                />
              </div>
            ))}
            <Button variant="outline" onClick={addAdvantage}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un avantage
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de contact (Footer)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="footerEmail">Email</Label>
              <Input
                id="footerEmail"
                type="email"
                value={content.footer.email}
                onChange={(e) => {
                  setContent({ ...content, footer: { ...content.footer, email: e.target.value } });
                }}
              />
            </div>
            <div>
              <Label htmlFor="footerPhone">Téléphone</Label>
              <Input
                id="footerPhone"
                value={content.footer.phone}
                onChange={(e) => {
                  setContent({ ...content, footer: { ...content.footer, phone: e.target.value } });
                }}
              />
            </div>
            <div>
              <Label htmlFor="footerHours">Horaires</Label>
              <Input
                id="footerHours"
                value={content.footer.hours}
                onChange={(e) => {
                  setContent({ ...content, footer: { ...content.footer, hours: e.target.value } });
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Site Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images du site</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res[0]) {
                  setContent({
                    ...content,
                    siteImages: [...content.siteImages, res[0].url],
                  });
                  setIsUploading(false);
                  toast.success("Image ajoutée!");
                }
              }}
              onUploadError={(error: Error) => {
                setIsUploading(false);
                toast.error(`Erreur: ${error.message}`);
              }}
              onUploadBegin={() => {
                setIsUploading(true);
              }}
            />
            <div className="grid grid-cols-4 gap-4 mt-4">
              {content.siteImages.map((url, index) => (
                <div key={index} className="relative group">
                  <img src={url} alt={`Site image ${index + 1}`} className="w-full h-32 object-cover rounded" />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setContent({
                        ...content,
                        siteImages: content.siteImages.filter((_, i) => i !== index),
                      });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
