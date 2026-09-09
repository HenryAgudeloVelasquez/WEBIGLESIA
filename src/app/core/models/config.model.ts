export interface PageSeoConfig {
  page: string;         // 'home', 'eventos', 'evangelio', 'coro', 'servicios', 'kids'
  title: string;        // <title>
  description: string;  // <meta name="description">
  keywords: string;     // <meta name="keywords">
  ogImage?: string;     // <meta property="og:image">
  canonicalUrl?: string;// <link rel="canonical">
  ogType?: string;      // 'website' | 'article'
}

export interface PageWhatsAppConfig {
  page: string;           // 'home', 'eventos', 'evangelio', 'coro', 'servicios', 'kids', 'general'
  phone: string;          // '573001234567'
  label: string;          // 'Atención General', 'Inscripciones de Eventos', etc.
  defaultMessage: string; // Mensaje predeterminado para el enlace
}

export interface PastoralContactConfig {
  address: string;
  phone: string;
  email: string;
  prayerLine: string;
  officeHours?: string;
}

export interface ChurchScheduleConfig {
  day: string;       // 'Domingos', 'Miércoles', 'Sábados'
  title: string;     // 'Culto de Celebración Familiar'
  time: string;      // '10:00 AM - 12:30 PM'
  subtitle?: string; // 'Con Escuela Gracia Kids'
  badge?: string;    // 'Semanal', 'Intercesión', 'Jóvenes'
}
