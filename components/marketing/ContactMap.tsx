type ContactMapProps = {
  address: string;
};

export function ContactMap({ address }: ContactMapProps) {
  const query = encodeURIComponent(address);
  const embedUrl = `https://maps.google.com/maps?q=${query}&z=15&output=embed`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border bg-card">
        <iframe
          title={`Map showing ${address}`}
          src={embedUrl}
          className="aspect-[16/9] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary"
        >
          Open in Google Maps
        </a>
      </p>
    </div>
  );
}
