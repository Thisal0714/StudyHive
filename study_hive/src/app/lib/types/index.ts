// User Types
export interface User {
  id: string;
  name: string;
  password: string;
  email: string;
  city: string;
  role?: string;
  job: string;
  nic: string;
  sex: string;
  phone: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subject?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface Review {
  id: string;
  title: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  progress: number;
  lastReviewed: string;
  nextReview: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  user?: T;
  data?: T;
  success?: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Dashboard Types
export interface DashboardStats {
  totalNotes: number;
  totalReviews: number;
  completedReviews: number;
  averageProgress: number;
  dueReviews: number;
}

export interface RecentActivity {
  notes: Note[];
  reviews: Review[];
}

// Form Types
export interface NoteFormData {
  title: string;
  content: string;
  subject?: string;
}

export interface ReviewFormData {
  title: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface ProfileFormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  university?: string;
  major?: string;
  year?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

// UI Types
export interface DropdownOption {
  label: string;
  value: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

// Component Props Types
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

// State Types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface NotesState {
  notes: Note[];
  selectedNote: Note | null;
  isLoading: boolean;
  error: string | null;
}

export interface ReviewsState {
  reviews: Review[];
  selectedReview: Review | null;
  isLoading: boolean;
  error: string | null;
}

// Utility Types
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type SortOrder = 'asc' | 'desc';

export type FilterType = 'all' | 'notes' | 'reviews' | 'completed' | 'pending';
