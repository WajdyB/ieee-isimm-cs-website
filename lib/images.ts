// Images configuration for the CS ISIMM website
export const aboutImages = {
  // Mission & Vision section image
  mission: {
    src: "/images/about/about-image.png",
    alt: "CS ISIMM Mission and Vision",
    width: 400,
    height: 350,
    className: "relative rounded-3xl shadow-2xl object-contain w-full h-auto",
  },
} as const

// Excom members are now managed dynamically via the admin dashboard.
// See /api/excom and the Excom tab in the admin panel.