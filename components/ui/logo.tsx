import Image from "next/image"
import { logos, type LogoProps } from "@/lib/logos"

export function Logo({ type, className }: LogoProps) {
  const config = logos[type]
  
  // Add error handling for undefined config
  if (!config) {
    console.error(`Logo type "${type}" not found in logos configuration`)
    return null
  }
  
  return (
    <Image
      src={config.src}
      alt={config.alt}
      width={config.width}
      height={config.height}
      className={className || config.className}
      priority={type === "cs"} // Prioritize loading the main CS logo
    />
  )
} 