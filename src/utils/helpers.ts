import { BASE_URL, PLACEHOLDER_IMAGE, PLACEHOLDER_AUDIO } from "./constants";

export const getMediaUrl = (mediaPath: string | undefined, type: "image" | "voice"): string => {
  if (!mediaPath) return type === "image" ? PLACEHOLDER_IMAGE : PLACEHOLDER_AUDIO;
  return mediaPath.startsWith("http") ? mediaPath : `${BASE_URL}${mediaPath}`;
};