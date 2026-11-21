export const site = {
  name: "Alikhanye Properties",
  slogan: "Homes in Blue Downs and nearby suburbs",
  description:
    "Estate agency in Blue Downs, Cape Town. We help people buy, sell and get a valuation in Blue Downs, Eerste River, Kuils River and the suburbs around them.",
  phoneDisplay: "073 752 9766",
  phoneTel: "+27737529766",
  whatsapp: "27737529766",
  email: "admin@alikhanye.com",
  address: "16 Lilly Kate Crescent, Blue Downs, 7100",
  registration: "2026/253356/07",
  principal: "Wendy Landiswa Madikazi",
  ffc: "1233579",
  /**
   * FFC expiry, once you have it (for example "31 March 2027").
   * Leave this empty until it is confirmed. Empty values are not shown.
   */
  ffcExpiry: "" as string,
  /** Stable sitemap date for pages that are not listings. Update when the copy changes. */
  staticContentUpdated: "2026-10-29",
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
        "Help with buying and selling houses in Blue Downs, Eerste River, Kuils River and nearby suburbs.",
    },
    {
      title: "Property Valuations",
      description:
        "A straight valuation before you list a house or put in an offer.",
    },
    {
      title: "First-Time Home Buyer Assistance",
      description:
        "Help from working out what you can afford, through to the offer and transfer.",
    },
    {
      title: "Property Marketing",
      description:
        "A clear listing and follow-up with people who enquire about your home.",
    },
    {
      title: "Investment Property Guidance",
      description:
        "Practical input if you are looking at a place to rent out or hold onto.",
    },
  ],
} as const;

export type SiteConfig = typeof site;

export function complianceLines(): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [
    { label: "Principal", value: site.principal },
    { label: "Address", value: site.address },
    { label: "Registration", value: site.registration },
    { label: "FFC", value: site.ffc },
    { label: "FFC expiry", value: site.ffcExpiry },
  ];

  return rows.filter((row) => row.value.trim().length > 0);
}
