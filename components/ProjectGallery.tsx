"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProjectImage } from "@/types";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectGalleryProps {
  images: ProjectImage[];
  mainImage?: string;
}

export default function ProjectGallery({ images, mainImage }: ProjectGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const allImages = mainImage ? [{ imageUrl: mainImage }, ...images] : images;

  useEffect(() => {
    if (selectedImage) {
      const index = allImages.findIndex(
        (img) => (typeof img === "string" ? img : img.imageUrl) === selectedImage
      );
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, [selectedImage, allImages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!selectedImage) return;
    if (e.key === "Escape") {
      setSelectedImage(null);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      navigateImage(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      navigateImage(1);
    }
  };

  const navigateImage = (direction: number) => {
    const newIndex = (currentIndex + direction + allImages.length) % allImages.length;
    const newImage = typeof allImages[newIndex] === "string" 
      ? allImages[newIndex] 
      : (allImages[newIndex] as ProjectImage).imageUrl;
    setSelectedImage(newImage);
  };

  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop() || "image";
    link.click();
  };

  if (allImages.length === 0) {
    return (
      <div className="h-64 w-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground">Aucune image disponible</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allImages.map((img, index) => {
          const url = typeof img === "string" ? img : (typeof img === "object" && "imageUrl" in img ? img.imageUrl : "");
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative h-64 w-full cursor-pointer rounded-lg overflow-hidden group"
              onClick={() => setSelectedImage(url)}
            >
              <Image
                src={url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </motion.div>
          );
        })}
      </div>

      <Dialog 
        open={!!selectedImage} 
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent 
          className="max-w-6xl p-0"
          onKeyDown={handleKeyDown}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {selectedImage && (
            <div className="relative">
              <div className="relative h-[80vh] w-full bg-black">
                <Image
                  src={selectedImage}
                  alt={`Image ${currentIndex + 1} of ${allImages.length}`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              {/* Navigation */}
              <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
                <Button
                  variant="outline"
                  size="icon"
                  className="pointer-events-auto"
                  onClick={() => navigateImage(-1)}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="pointer-events-auto"
                  onClick={() => navigateImage(1)}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>

              {/* Caption and controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm">
                    Image {currentIndex + 1} of {allImages.length}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDownload(selectedImage)}
                    aria-label="Download image"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setSelectedImage(null)}
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

