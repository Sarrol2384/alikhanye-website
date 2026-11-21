export function whatsappUrl(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function listingEnquiryMessage(property: {
  title: string;
  suburb: string;
  price: string;
}): string {
  return `Hi Alikhanye Properties, I'm interested in "${property.title}" in ${property.suburb}, listed at ${property.price}. Please tell me more.`;
}
