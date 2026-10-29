import { listingShareImage, ogContentType, ogSize } from "@/lib/og";

export const alt = "Property for sale with Alikhanye Properties";
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 300;

type ImageProps = {
  params: Promise<{ id: string }>;
};

export default async function ListingOpenGraphImage({ params }: ImageProps) {
  const { id } = await params;
  return listingShareImage(id);
}
