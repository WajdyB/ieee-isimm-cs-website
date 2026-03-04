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

// Committee images configuration
export const committeeImages = {
  // Committee member photos - Updated with CS ISIMM 2025-2026 Executive Committee
  members: [
    {
      name: "Yosr Hadj Ali",
      position: "Chairwoman",
      image: "/images/committee/yosr-hadj-ali.png", 
      facebook: "https://www.facebook.com/yosr.hajali.39",
      email: "hadjaliyosr@ieee.org",
      linkedin: "https://www.linkedin.com/in/yosr-hadj-ali-22a18437b/",
    },
    {
      name: "Mariem Ben Nasr",
      position: "Vice Chair",
      image: "/images/committee/mariem-ben-nasr.png", 
      facebook: "https://www.facebook.com/mariem.ben.nasr.937503",
      email: "mariembennsar090@gmail.com",
      linkedin: "https://www.linkedin.com/in/maryem-ben-nasr-3b33b6370/",
    },
    {
      name: "Yessine Choieche",
      position: "Secretary",
      image: "/images/committee/yessine-choieche.png", 
      facebook: "https://www.facebook.com/yessine.chaoiache",
      email: "yessinechaoiache@gmail.com",
      linkedin: "https://www.linkedin.com/in/yessine-ch-543479377/",
    },
    {
      name: "Ahmed Brahem",
      position: "Treasurer",
      image: "/images/committee/ahmed-brahem.png", 
      facebook: "https://www.facebook.com/ahm2d.brahem",
      email: "ahmedbrahem911@gmail.com",
      linkedin: "https://www.linkedin.com/in/ahmed-brahem-7b8258308/",
    },
    {
      name: "Yassine Mansour",
      position: "Webmaster",
      image: "/images/committee/yassine-mansour.png", 
      facebook: "https://www.facebook.com/yassinemansour0",
      email: "yassinemansourr09@gmail.com",
      linkedin: "https://www.linkedin.com/in/yassine-mansour-008341210/",
    },
  ],
  
  // Chairwoman photo for leadership message section
  chair: {
    src: "/images/committee/yosr-hadj-ali.png", 
    alt: "Yosr Hadj Ali - Chairwoman",
    width: 80,
    height: 80,
    className: "w-16 h-16 rounded-full object-cover mr-4",
  },
} as const

// Helper function to get committee members
export const getCommitteeMembers = () => {
  return committeeImages.members.map((member, index) => ({
    ...member,
    // Fallback to placeholder if image doesn't exist
    image: member.image.startsWith('/placeholder') ? member.image : member.image,
  }))
}