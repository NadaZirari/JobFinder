export interface Job {
  id: string; // offerId dans les modèles de suivi
  title: string;
  company: string;
  location: string;
  description: string; // Description courte pour la liste
  fullDescription?: string; // Optionnel si disponible
  url: string; // Lien vers l'offre complète
  salary?: string;
  postedAt: string | Date;
  apiSource?: string; // Source de l'API (adzuna, mock, etc.)
}
