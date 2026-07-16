export interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

export interface CompetitorRow {
  name: string;
  us: boolean;
  features: string[]; // e.g., ["Feature A", "Feature B", "Feature C"]
}

export interface MetricItem {
  label: string;
  value: string;
}

export interface Slide {
  id: string;
  title: string;
  subtitle: string;
  bullets: string[];
  layoutType: 'text_only' | 'two_column' | 'metrics_grid' | 'chart_line' | 'chart_bar' | 'competitor_matrix' | 'team_grid' | 'timeline';
  metrics?: MetricItem[];
  competitors?: CompetitorRow[];
  teamMembers?: TeamMember[];
}

export interface PitchDeck {
  companyName: string;
  tagline: string;
  slides: Slide[];
}

export type ThemeId = 'midnight' | 'emerald' | 'cyberpunk' | 'royal';

export interface VisualTheme {
  id: ThemeId;
  name: string;
  bgClass: string;          // Main background of the deck app
  slideBgClass: string;     // Background specifically for the slides
  borderClass: string;      // Border coloring
  accentColor: string;      // Primary accent color (tailwinds) e.g., "sky" or "emerald"
  accentHex: string;        // Hex color for Recharts charts
  secondaryHex: string;     // Secondary hex color for charts
  textTitleClass: string;   // Slide title typography
  textSubtitleClass: string; // Slide subtitle typography
  textBodyClass: string;     // Slide body bullet typography
  fontFamily: string;       // Font style class e.g., "font-sans", "font-serif", "font-mono"
  badgeClass: string;       // Design badges
  accentBg: string;         // Accent background
  glowEffect?: string;      // Glow class (e.g. for cyberpunk shadow-neon)
}
