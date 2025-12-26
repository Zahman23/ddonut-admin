// src/components/user-avatar.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function getInitials(name?: string | null, email?: string | null) {
  const src = (name && name.trim()) || (email && email.split("@")[0]) || "";
  if (!src) return "US";
  const parts = src.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  const s = parts[0];
  return (s[0] + (s[1] || "")).toUpperCase();
}

export default function UserAvatar({
  name,
  email,
  src,
  className,
}: {
  name?: string | null;
  email?: string | null;
  src?: string | null; // jika nanti kamu simpan URL avatar
  className?: string;
}) {
  const initials = getInitials(name, email);
  return (
    <Avatar className={className}>
      {/* kalau punya URL avatar, taruh di sini */}
      {src ? <AvatarImage src={src} alt={name || email || initials} /> : null}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
