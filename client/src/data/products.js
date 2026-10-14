export const categories = [
  { id: 'all', name: 'All Programs' },
  { id: 'lip-care', name: 'Lip Makeup' },
  { id: 'sun-care', name: 'Sun Care' },
  { id: 'face-cleanser', name: 'Face Cleanser' },
];

export const productGroups = [
  { title: 'Lip Makeup', description: 'OEM/ODM lipstick programs covering classic finishes, reactive color, custom shades and bespoke packaging.', categories: ['lip-care'] },
  { title: 'Sun Care', description: 'OEM/ODM sunscreen spray, gel, cream, lotion and stick programs developed around texture, testing and target-market requirements.', categories: ['sun-care'] },
  { title: 'Face Cleanser', description: 'OEM/ODM gel, cream, foam, oil and micellar cleansing programs developed around skin feel, removal performance and packaging.', categories: ['face-cleanser'] },
];

export const categoryNames = Object.fromEntries(categories.filter(({ id }) => id !== 'all').map(({ id, name }) => [id, name]));

export const categoryThemes = {
  all: { accent: '#21343a', dark: '#16272d', soft: '#eef1ef', surface: '#f8f6f1', highlight: '#c49a45' },
  'lip-care': { accent: '#b42346', dark: '#761a33', soft: '#fbe8ed', surface: '#fff8f9', highlight: '#c99b45' },
  'sun-care': { accent: '#146f9c', dark: '#0d4d6d', soft: '#e6f3f8', surface: '#f8fcfd', highlight: '#e9aa25' },
  'face-cleanser': { accent: '#237a6b', dark: '#155247', soft: '#e5f3ef', surface: '#f7fcfa', highlight: '#d6a65c' },
};

export const getCategoryTheme = (category = 'all') => categoryThemes[category] || categoryThemes.all;
export const categoryThemeStyle = (category = 'all') => {
  const theme = getCategoryTheme(category);
  return {
    '--category-accent': theme.accent,
    '--category-dark': theme.dark,
    '--category-soft': theme.soft,
    '--category-surface': theme.surface,
    '--category-highlight': theme.highlight,
  };
};