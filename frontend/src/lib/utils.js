import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getAvatarUrl(avatar) {
  if (!avatar) return null;

  // If avatar is an object (new Cloudinary structure)
  if (typeof avatar === 'object' && avatar.url) {
    return avatar.url;
  }

  // If avatar is a string (legacy local path or direct URL)
  if (typeof avatar === 'string') {
    if (avatar.startsWith('http')) {
      return avatar;
    }
    // Handle local uploads if any remain
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';
    return `${backendUrl}${avatar.startsWith('/') ? '' : '/'}${avatar}`;
  }

  return null;
}
