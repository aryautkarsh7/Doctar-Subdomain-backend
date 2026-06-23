export interface IHospital {
  slug: string;
  name: string;
  type?: string;
  city?: string;
  state?: string;
  address?: string;
  phone?: string;
  image?: string;
  rating?: number;
  specialties?: string[];
}

export interface IDoctor {
  slug: string;
  name: string;
  specialty?: string;
  city?: string;
  experience?: number;
  image?: string;
  rating?: number;
}

export interface ICategory {
  slug: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface IBooking {
  name: string;
  phone: string;
  email?: string;
  treatmentSlug?: string;
  doctorSlug?: string;
  date?: string;
  time?: string;
  status?: string;
}
