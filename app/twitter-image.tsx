import { defaultShareImage, ogContentType, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — homes in Blue Downs and nearby suburbs`;
export const size = ogSize;
export const contentType = ogContentType;

export default function TwitterImage() {
  return defaultShareImage();
}
