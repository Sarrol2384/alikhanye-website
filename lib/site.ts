export const site = {
  name: "Alikhanye Properties",
  slogan: "Lighting the way to your dream home",
  description:
    "Proudly South African real estate agency in Blue Downs, Cape Town — helping you buy, sell, and invest with integrity.",
  phoneDisplay: "073 752 9766",
  phoneTel: "+27737529766",
  whatsapp: "27737529766",
  email: "admin@alikhanye.com",
  address: "16 Lilly Kate Crescent, Blue Downs, 7100",
  registration: "2026/253356/07",
  principal: "Wendy Landiswa Madikazi",
  ffc: "1233579",
  locale: "en_ZA",
  areaServed: [
    "Blue Downs",
    "Mfuleni",
    "Eerste River",
    "Blackheath",
    "Kuils River",
    "Bellville South",
    "Delft",
    "Mitchells Plain",
    "Khayelitsha",
    "Greater Cape Town",
  ],
  services: [
    {
      title: "Residential Property Sales",
      description:
        "Guided buying and selling support for homes across Blue Downs and the greater Cape Town area.",
    },
    {
      title: "Property Valuations",
      description:
        "Clear, market-informed valuations so you know where you stand before you list or offer.",
    },
    {
      title: "First-Time Home Buyer Assistance",
      description:
        "Step-by-step help for first-time buyers — from affordability to offer and transfer.",
    },
    {
      title: "Property Marketing",
      description:
        "Professional presentation and promotion that puts your property in front of serious buyers.",
    },
    {
      title: "Investment Property Guidance",
      description:
        "Practical advice for investors seeking opportunities with long-term growth potential.",
    },
  ],
} as const;

export type SiteConfig = typeof site;
