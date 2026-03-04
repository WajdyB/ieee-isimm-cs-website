// Logo configuration for the CS ISIMM website
export const logos = {
  cs: {
    src: "/logos/ieee-cs-logo.png",
    alt: "CS ISIMM Logo",
    width: 180,
    height: 75,
    className: "h-16 w-auto",
  },
  csWhite: {
    src: "/logos/logo-cs-isimm-white.png",
    alt: "CS ISIMM Logo (white)",
    width: 180,
    height: 75,
    className: "h-16 w-auto",
  },
  ieeeIsimmSb: {
    src: "/logos/logo-isimm-sb.png",
    alt: "IEEE ISIMM Student Branch",
    width: 180,
    height: 75,
    className: "h-16 w-auto",
  },
  ieeeIsimmSbMobile: {
    src: "/logos/logo-isimm-sb.png",
    alt: "IEEE ISIMM Student Branch",
    width: 140,
    height: 60,
    className: "h-12 w-auto",
  },
} as const

// Logo component props type
export type LogoProps = {
  type: keyof typeof logos
  className?: string
}

// Helper function to get logo configuration
export const getLogoConfig = (type: keyof typeof logos) => {
  return logos[type]
} 