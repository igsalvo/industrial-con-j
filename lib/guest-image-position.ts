type GuestImagePosition = {
  slug: string;
  profilePositionX?: string | null;
  profilePositionY?: string | null;
};

const guestImagePositionOverrides: Record<string, string> = {
  "salomon-suwalsky": "center center"
};

const guestImageFitOverrides: Record<string, "object-cover" | "object-contain"> = {
  "salomon-suwalsky": "object-contain"
};

export function getGuestImagePosition(guest: GuestImagePosition) {
  return guestImagePositionOverrides[guest.slug] ?? `${guest.profilePositionX || "center"} ${guest.profilePositionY || "center"}`;
}

export function getGuestImageFit(guest: GuestImagePosition) {
  return guestImageFitOverrides[guest.slug] ?? "object-cover";
}
