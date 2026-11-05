export type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  image: string;
  gallery: string[];
  amenities: string[];
  overview: string;
  rating: number;
  reviews: { name: string; rating: number; comment: string }[];
  ownerName: string;
  ownerEmail: string;
};