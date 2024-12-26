import { lazy } from 'react';

// Lazy load main content pages
export const ClientQuotes = lazy(() => import('@/pages/ClientQuotes'));
export const Authors = lazy(() => import('@/pages/Authors'));
export const Categories = lazy(() => import('@/pages/Categories'));
export const AuthorDetail = lazy(() => import('@/pages/AuthorDetail'));
export const CategoryDetail = lazy(() => import('@/pages/CategoryDetail'));
export const Quote = lazy(() => import('@/pages/Quote'));

// Lazy load admin pages
export const Dashboard = lazy(() => import('@/pages/Dashboard'));
export const Quotes = lazy(() => import('@/pages/Quotes'));
export const Settings = lazy(() => import('@/pages/Settings'));
export const Subscribers = lazy(() => import('@/pages/Subscribers'));
export const WhatsappTemplates = lazy(() => import('@/pages/WhatsappTemplates'));

// Lazy load footer management components
export const FooterManagement = lazy(() => import('@/pages/content/FooterManagement'));
export const FeedManagement = lazy(() => import('@/pages/content/FeedManagement'));
export const PagesManagement = lazy(() => import('@/pages/content/PagesManagement'));