import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/format";
import { site } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl(
        site.whatsapp,
        "Hi Alikhanye Properties, I'd like to enquire about your services.",
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="cta-lift fixed right-4 bottom-4 z-50 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition-transform hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}
