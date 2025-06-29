export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://studyhive-5z2u.onrender.com';

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const APP_CONFIG = {
  name: 'StudyHive',
  version: '1.0.0',
  description: 'AI Powered Study Notes Hub',
  api: {
    baseUrl: API_BASE_URL,
    timeout: 10000,
    endpoints: {
      auth: {
        login: '/auth/login',
        signup: '/auth/register',
        logout: '/auth/logout',
        refresh: '/auth/refresh',
      },
      notes: {
        list: '/notes',
        create: '/notes',
        update: '/notes/:id',
        delete: '/notes/:id',
      },
      reviews: {
        list: '/reviews',
        create: '/reviews',
        update: '/reviews/:id',
        delete: '/reviews/:id',
      },
      profile: {
        get: '/adminuser/get-profile',
        update: '/update/{userId}',
      },
    },
  },
  features: {
    auth: true,
    notes: true,
    reviews: true,
    profile: true,
  },
} as const;

export const { api } = APP_CONFIG; 