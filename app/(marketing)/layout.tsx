import { Footer } from "@/components/marketing/Footer";
import { Header } from "@/components/marketing/Header";
import { WhatsAppFloat } from "@/components/marketing/WhatsAppFloat";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-1 overflow-x-clip">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
