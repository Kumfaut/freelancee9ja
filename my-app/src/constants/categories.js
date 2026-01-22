// src/constants/categories.js
import { Code, Palette, PenTool, Megaphone, Camera, Music, BarChart3, Smartphone } from 'lucide-react';

export const APP_CATEGORIES = [
  { id: 'web-development', name: 'Web Development', icon: Code, color: 'bg-blue-100 text-blue-600' },
  { id: 'design', name: 'UI/UX Design', icon: Palette, color: 'bg-purple-100 text-purple-600' },
  { id: 'writing', name: 'Content Writing', icon: PenTool, color: 'bg-green-100 text-green-600' },
  { id: 'marketing', name: 'Digital Marketing', icon: Megaphone, color: 'bg-red-100 text-red-600' },
  { id: 'photography', name: 'Photography', icon: Camera, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'audio', name: 'Audio & Music', icon: Music, color: 'bg-pink-100 text-pink-600' },
  { id: 'data', name: 'Data Analysis', icon: BarChart3, color: 'bg-indigo-100 text-indigo-600' },
  { id: 'mobile', name: 'Mobile Apps', icon: Smartphone, color: 'bg-teal-100 text-teal-600' }
];