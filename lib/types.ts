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

export type Booking = {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  ownerEmail: string;
  userName: string;
  userEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  guests: number;
  notes: string;
  hourlyRate: number;
  totalPrice: number;
  securityDeposit: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
};