export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  isActive: boolean;
  createdAt: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  photo: string;
  description: string;
  isActive: boolean;
  schedule: Record<string, { start: string; end: string }>;
}

export interface Booking {
  id: number;
  patientName: string;
  phone: string;
  doctorId: number;
  serviceId: number;
  date: string;
  time: string;
  comment: string;
  consentGiven: boolean;
  status: "new" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface PortfolioItem {
  id: number;
  title?: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  doctorId?: number;
}

export interface Stats {
  totalBookings: number;
  newBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  popularServices: unknown[];
  bookingsByMonth: unknown[];
}
