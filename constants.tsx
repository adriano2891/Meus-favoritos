
import React from 'react';
import { 
  Bot, Armchair, Shirt, Utensils, Trophy, Book, Heart, Leaf, Gamepad2, Wrench, Music, Dog, Globe, MessageCircle, Send, Facebook, Instagram, Youtube, Mail, Star, Cpu, GraduationCap, Megaphone, Building2, MoreHorizontal, LayoutGrid, Languages, X, Sparkles, Zap, MessageSquare, Search,
  Hash, Calculator, List, Video, Trash2, Image, HardDrive, HelpCircle, Cloud, Monitor, ShoppingCart, Lock
} from 'lucide-react';
import { Category } from './types';

// Ícones Oficiais em SVG de Alta Fidelidade (Vetoriais Puros)
const OfficialIcons = {
  Google: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  ),
  Translate: () => (
    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-1.5">
      <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
    </svg>
  ),
  WhatsApp: () => (
    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-1.5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  Telegram: () => (
    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-1.5">
      <path d="M11.944 0C5.346 0 0 5.346 0 11.944s5.346 11.944 11.944 11.944 11.944-5.346 11.944-11.944S18.542 0 11.944 0zm5.83 8.125l-2.023 9.544c-.15.674-.551.841-1.116.523l-3.085-2.274-1.488 1.432c-.165.165-.303.303-.62.303l.221-3.136 5.711-5.159c.248-.221-.054-.344-.383-.125l-7.058 4.444-3.04-.95c-.66-.206-.673-.66.138-.976l11.883-4.579c.55-.206 1.031.125.855.976z"/>
    </svg>
  ),
  Discord: () => (
    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-1.5">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.68 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  ),
  AIStudio: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full p-1">
      <path fill="#4285F4" d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
    </svg>
  ),
  Instagram: () => (
    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-1.5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.355 2.618 6.778 6.98 6.978 1.28.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  TikTok: () => (
    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-1.5">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.58-1.01V15.5c0 1.63-.44 3.27-1.33 4.63-.89 1.36-2.26 2.41-3.8 2.87-1.54.46-3.24.41-4.75-.15-1.51-.56-2.81-1.66-3.56-3.08-.75-1.42-1-3.08-.71-4.67.29-1.59 1.11-3.03 2.33-4.08 1.22-1.05 2.8-1.66 4.41-1.73v4.08c-.96.04-1.92.35-2.69.93-.77.58-1.31 1.44-1.5 2.39-.19.95-.03 1.96.44 2.81.47.85 1.25 1.5 2.16 1.83.91.33 1.92.33 2.83 0 .91-.33 1.69-.98 2.16-1.83.47-.85.63-1.86.44-2.81V0z"/>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-2">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644z"/>
    </svg>
  ),
  YouTube: () => (
    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-1.5">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  Gmail: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <g>
        <path fill="#4285F4" d="M3 18V6l9 6.75V18h-6c-1.65 0-3-1.35-3-3z"/>
        <path fill="#34A853" d="M21 18v-12l-9 6.75V18h6c1.65 0 3-1.35 3-3z"/>
        <path fill="#EA4335" d="M3 6l9 6.75L21 6v-1c0-1.65-1.35-3-3-3H6C4.35 2 3 3.35 3 5v1z"/>
        <path fill="#FBBC04" d="M12 12.75L3 6v1l9 6.75L21 7V6l-9 6.75z"/>
      </g>
    </svg>
  ),
  Outlook: () => (
    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-1.5">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
    </svg>
  ),
  ChatGPT: () => (
    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-1.5">
      <path d="M22.28 9.82a5.98 5.98 0 0 0-.51-4.9 6.05 6.05 0 0 0-4.39-3.11 5.99 5.99 0 0 0-5.28 1.72 5.98 5.98 0 0 0-4.9-.52 6.05 6.05 0 0 0-3.11 4.39 5.99 5.99 0 0 0 1.72 5.28 5.98 5.98 0 0 0 .51 4.9 6.05 6.05 0 0 0 4.39 3.11 5.99 5.99 0 0 0 5.28-1.72 5.98 5.98 0 0 0 4.9.52 6.05 6.05 0 0 0 3.11-4.39 5.99 5.99 0 0 0-1.72-5.28zm-1.12 4.76a4.57 4.57 0 0 1-2.35 3.31l-.46.25v-3.46l4.41-2.54a4.51 4.51 0 0 1-1.6 2.44zM19.62 6.83l-4.41 2.54V4.29a4.51 4.51 0 0 1 3.99 1.44 4.51 4.51 0 0 1 .42 1.1zm-7.62-3.41v5.08l-4.41-2.54a4.51 4.51 0 0 1 4.41-2.54zm-5.39 5.14l4.41 2.54v5.09a4.51 4.51 0 0 1-4.41-2.54 4.51 4.51 0 0 1 0-5.09zM7.73 15.95a4.57 4.57 0 0 1 2.35-3.31l.46-.25v3.46l-4.41 2.54a4.51 4.51 0 0 1 1.6-2.44zm1.54 7.75l4.41-2.54v5.08a4.51 4.51 0 0 1-4.41-2.54zM16.89 21.14v-5.08l4.41 2.54a4.51 4.51 0 0 1-4.41 2.54z"/>
    </svg>
  ),
  Gemini: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <defs>
        <linearGradient id="gemini_sparkle_grad" x1="5.28" y1="12" x2="18.72" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4285F4"/>
          <stop offset="1" stopColor="#9B72F3"/>
        </linearGradient>
      </defs>
      <path fill="url(#gemini_sparkle_grad)" d="M12 21.6C12 21.6 12.016 14.864 18.72 12C12.016 9.136 12 2.4 12 2.4C12 2.4 11.984 9.136 5.28 12C11.984 14.864 12 21.6 12 21.6Z"/>
    </svg>
  )
};

export const QUICK_ACCESS_LINKS = [
  { name: 'Google', icon: <OfficialIcons.Google />, url: 'https://google.com', color: 'bg-white' },
  { name: 'Translate', icon: <OfficialIcons.Translate />, url: 'https://translate.google.com', color: 'bg-[#4285f4]' },
  { name: 'WhatsApp', icon: <OfficialIcons.WhatsApp />, url: 'https://web.whatsapp.com', color: 'bg-[#25d366]' },
  { name: 'Telegram', icon: <OfficialIcons.Telegram />, url: 'https://web.telegram.org', color: 'bg-[#0088cc]' },
  { name: 'Discord', icon: <OfficialIcons.Discord />, url: 'https://discord.com', color: 'bg-[#5865f2]' },
  { name: 'Instagram', icon: <OfficialIcons.Instagram />, url: 'https://instagram.com', color: 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]' },
  { name: 'TikTok', icon: <OfficialIcons.TikTok />, url: 'https://tiktok.com', color: 'bg-black' },
  { name: 'X', icon: <OfficialIcons.X />, url: 'https://twitter.com', color: 'bg-black' },
  { name: 'YouTube', icon: <OfficialIcons.YouTube />, url: 'https://youtube.com', color: 'bg-[#ff0000]' },
  { name: 'Gmail', icon: <OfficialIcons.Gmail />, url: 'https://mail.google.com', color: 'bg-white' },
  { name: 'Outlook', icon: <OfficialIcons.Outlook />, url: 'https://outlook.com', color: 'bg-[#0078d4]' },
  { name: 'ChatGPT', icon: <OfficialIcons.ChatGPT />, url: 'https://chat.openai.com', color: 'bg-[#10a37f]' },
  { name: 'Gemini', icon: <OfficialIcons.Gemini />, url: 'https://gemini.google.com', color: 'bg-white' },
  { name: 'AI Studio', icon: <OfficialIcons.AIStudio />, url: 'https://aistudio.google.com/apps', color: 'bg-white' },
];

export const ICON_MAP: Record<string, React.ElementType> = {
  Bot, Armchair, Shirt, Utensils, Trophy, Book, Heart, Leaf, Gamepad2, Wrench, Music, Dog, Globe, MessageCircle, Send, Facebook, Instagram, Youtube, Mail, Star, Cpu, GraduationCap, Megaphone, Building2, MoreHorizontal, LayoutGrid, Languages, X, Sparkles, Zap, MessageSquare, Search, Hash, Calculator, List, Video, Trash2, Image, HardDrive, HelpCircle, Cloud, Monitor, ShoppingCart, Lock
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'mais-usadas',
    name: 'MAIS USADAS',
    icon: 'Star',
    color: '#64ffda',
    subCategories: [
      {
        id: 'mu-geral',
        name: 'Geral',
        color: '#64ffda',
        icon: 'Zap',
        links: [
          { id: '1', name: 'APP GERAR IMAGEM', url: 'https://aistudio.google.com/apps/drive/1k6YQvu5vVIgyh7BzkCCj82RKMMkeiBou' },
          { id: '2', name: 'CANVA', url: 'https://www.canva.com/' },
          { id: '3', name: 'CRIAR MÚSICAS', url: 'https://suno.com/home' },
          { id: '4', name: 'CRIAR PROMPT', url: 'https://www.prompt-genie.com/dashboard' },
          { id: '5', name: 'GEMINI', url: 'https://gemini.google.com/app' },
          { id: '6', name: 'BEMOONAI', url: 'https://bemoonai.com/chat' },
          { id: '7', name: 'META.AI', url: 'https://www.meta.ai/' }
        ]
      }
    ]
  },
  {
    id: 'chat-ais',
    name: 'CHAT & AIS',
    icon: 'MessageSquare',
    color: '#3b82f6',
    subCategories: [
      {
        id: 'chat-assistentes',
        name: 'Assistentes',
        color: '#3b82f6',
        icon: 'Bot',
        links: [
          { id: 'c1', name: 'ChatGPT', url: 'https://chat.openai.com' },
          { id: 'c2', name: 'Claude.ai', url: 'https://claude.ai' },
          { id: 'c3', name: 'DeepSeek', url: 'https://chat.deepseek.com/' },
          { id: 'c4', name: 'Grok', url: 'https://grok.com/' },
          { id: 'c5', name: 'Perplexity', url: 'https://perplexity.ai' }
        ]
      }
    ]
  },
  {
    id: 'gerar-video',
    name: 'GERAR VÍDEOS',
    icon: 'Video',
    color: '#ef4444',
    subCategories: [
      {
        id: 'vid-geradores',
        name: 'Geradores',
        color: '#ef4444',
        icon: 'Sparkles',
        links: [
          { id: 'v1', name: 'Luma Dream Machine', url: 'https://lumalabs.ai/dream-machine' },
          { id: 'v2', name: 'Kling AI', url: 'https://klingai.com' },
          { id: 'v3', name: 'Runway Gen-3', url: 'https://runwayml.com' },
          { id: 'v4', name: 'Pika Labs', url: 'https://pika.art' },
          { id: 'v5', name: 'InVideo AI', url: 'https://ai.invideo.io/' }
        ]
      }
    ]
  },
  {
    id: 'remover-ferramentas',
    name: 'REMOVER',
    icon: 'Trash2',
    color: '#f59e0b',
    subCategories: [
      {
        id: 'rem-fundos',
        name: 'Fundos & Objetos',
        color: '#f59e0b',
        icon: 'Image',
        links: [
          { id: 'r1', name: 'Remove.bg', url: 'https://www.remove.bg/pt-br/upload' },
          { id: 'r2', name: 'ClipDrop Cleanup', url: 'https://clipdrop.co/cleanup' },
          { id: 'r3', name: 'SnapEdit', url: 'https://snapedit.app/pt/remove-object' },
          { id: 'r4', name: 'Unscreen (Vídeo)', url: 'https://www.unscreen.com/upload' }
        ]
      }
    ]
  },
  {
    id: 'prompts-hub',
    name: 'PROMPTS',
    icon: 'List',
    color: '#8b5cf6',
    subCategories: [
      {
        id: 'p-geral',
        name: 'Geral',
        color: '#8b5cf6',
        icon: 'Book',
        links: [
          { id: 'pr1', name: 'Prompt Genie', url: 'https://www.prompt-genie.com/dashboard' },
          { id: 'pr2', name: 'Banana Prompts', url: 'https://bananaprompts.xyz/' },
          { id: 'pr3', name: 'Aistudio Prompts', url: 'https://aistudio.google.com/' }
        ]
      }
    ]
  },
  {
    id: 'sites-gov',
    name: 'SITES GOV',
    icon: 'Building2',
    color: '#64748b',
    subCategories: [
      {
        id: 'gov-servicos',
        name: 'Serviços',
        color: '#64748b',
        icon: 'Lock',
        links: [
          { id: 'g1', name: 'GOV.BR', url: 'https://www.gov.br' },
          { id: 'g2', name: 'Assinador ITI', url: 'https://assinador.iti.br/' },
          { id: 'g3', name: 'Meu INSS', url: 'https://meu.inss.gov.br/' },
          { id: 'g4', name: 'Registrato BC', url: 'https://registrato.bcb.gov.br/' }
        ]
      }
    ]
  },
  {
    id: 'materiais-drive',
    name: 'MATERIAIS DRIVE',
    icon: 'HardDrive',
    color: '#10b981',
    subCategories: [
      {
        id: 'dr-geral',
        name: 'Geral',
        color: '#10b981',
        icon: 'FolderPlus',
        links: [
          { id: 'd1', name: 'Pack Artes', url: 'https://drive.google.com/drive/folders/1GOeL9uYvip5pigoyh0aCJt7vknt73wrJ' },
          { id: 'd2', name: 'Cursos Vendas', url: 'https://drive.google.com/file/d/1txUpNR8wdRqKcrcFSmwsLjKRFbADnrBP/view' }
        ]
      }
    ]
  },
  {
    id: 'escola-icloud',
    name: 'Escola iCloud',
    icon: 'Cloud',
    color: '#0ea5e9',
    subCategories: [
      {
        id: 'icloud-geral',
        name: 'Acesso',
        color: '#0ea5e9',
        icon: 'Globe',
        links: [
          { id: 'ic1', name: 'Painel Kiwify', url: 'https://dashboard.kiwify.com.br/' },
          { id: 'ic2', name: 'Aulas Estilo AI', url: 'https://app.kirvano.com/' }
        ]
      }
    ]
  }
];
