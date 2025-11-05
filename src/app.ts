export const SEO_CONFIG = {
  description:
    "The MaM Water Project improves access to safe water for families across Kenya through affordable rainwater harvesting tanks paired with 8-layer purification systems. Flexible payment plans available nationwide.",
  fullName: "The MaM Water Project",
  name: "The MaM Water Project",
  slogan: "Clean Water for Every Home",
};

export const SYSTEM_CONFIG = {
  redirectAfterSignIn: "/dashboard/orders",
  redirectAfterSignUp: "/dashboard/orders",
  repoName: "mam-water-project",
  repoOwner: "mam-water",
  repoStars: false,
};

export const ADMIN_CONFIG = {
  displayEmails: false,
};

export const DB_DEV_LOGGER = false;

// Payment plan configurations for water tanks
export const PAYMENT_PLANS = {
  "3000L": {
    cashPrice: 19500,
    deposit: 5000,
    monthlyInstallment: 1300,
    period: 18, // months
  },
  "5000L": {
    cashPrice: 25000,
    deposit: 7000,
    monthlyInstallment: 1500,
    period: 18, // months
  },
  "10000L": {
    cashPrice: 49500,
    deposit: 8000,
    monthlyInstallment: 3000,
    period: 18, // months
  },
} as const;

// Product features - FDA approved tanks
export const TANK_FEATURES = {
  description: "One-piece, seamless tanks molded from 100% Food and Drug Administration (FDA) approved material",
  features: [
    "100% FDA approved material",
    "Will not rust or impart any taste",
    "Corrugated body for durability",
    "Stands upright for easy use",
    "One-piece seamless construction",
  ],
} as const;

// Service areas - All Kenyan Counties
export const SERVICE_AREAS = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet",
  "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
  "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga",
  "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia",
  "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit",
  "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi",
  "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua",
  "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River",
  "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga",
  "Wajir", "West Pokot",
] as const;

// Contact information
export const CONTACT_INFO = {
  email: "info@mamwaterproject.org",
  officeAddress: "Kenya - Serving All 47 Counties",
  phone: "+254 XXX XXX XXX", // Update with actual phone number
  supportHours: "Monday - Saturday, 8:00 AM - 6:00 PM EAT",
  whatsapp: "+254 XXX XXX XXX", // Update with actual WhatsApp number
} as const;