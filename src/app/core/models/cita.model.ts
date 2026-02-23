export interface Cita {
  id: string;              // uuid o timestamp
  date: string;            // YYYY-MM-DD
  time: string;            // HH:mm
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  email: string;
  birthDate: string;       // YYYY-MM-DD
  notes?: string;
  status: 'pending' | 'confirmed'; // puedes empezar con 'pending'
}