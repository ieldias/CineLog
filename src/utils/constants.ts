export const GENRES = [
  'Ação', 'Aventura', 'Comédia', 'Drama', 'Terror', 'Sci-Fi',
  'Romance', 'Thriller', 'Animação', 'Documentário', 'Crime',
  'Fantasia', 'Suspense', 'Biografia', 'Outro',
];

export const STATUS_CONFIG = {
  watched: { label: 'Assistido', cls: 'status-watched' },
  watching: { label: 'Assistindo', cls: 'status-watching' },
  wishlist: { label: 'Vou Assistir', cls: 'status-wishlist' },
} as const;
