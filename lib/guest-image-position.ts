type GuestImagePosition = {
  slug: string;
  profilePositionX?: string | null;
  profilePositionY?: string | null;
};

const guestImagePositionOverrides: Record<string, string> = {
  "salomon-suwalsky": "center 88%"
};

export function getGuestImagePosition(guest: GuestImagePosition) {
  return guestImagePositionOverrides[guest.slug] ?? `${guest.profilePositionX || "center"} ${guest.profilePositionY || "center"}`;
}
