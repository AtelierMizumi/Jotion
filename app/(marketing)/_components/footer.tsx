import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Github, Facebook } from "lucide-react"
import { Autour_One } from "next/font/google"

export const Footer = () => {
  return (
    <div className="flex items-center w-full p-2 bg-background z-32 dark:bg-[#1F1F1F] relative">
      <div className="flex justify-start items-center gap-x-2 w-full text-muted-foreground"> {/* Ensure buttons are on the left */}
        <a href="https://github.com/AtelierMizumi/Jotion"> 
          <Button variant="ghost" size="icon">
            <Github></Github>
          </Button>
        </a>
        <a href="https://www.facebook.com/2f5436fa4fvbc9/">
        <Button variant="ghost" size="icon">
          
          <Facebook></Facebook>
        </Button>
        </a>
      </div>  
      <Image
        src="/shao-sitting.png"
        loading="lazy"
        width="260"
        height="200"
        alt="Shaolin having a rest"
        className="object-contain absolute bottom-0 right-0" // Add scaling properties
      />
    </div>

  )
}