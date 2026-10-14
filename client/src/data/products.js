export const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'lip-care', name: 'Lip Care' },
  { id: 'sun-care', name: 'Sun Care' },
  { id: 'protective-products', name: 'Protective Products' },
];

export const productGroups = [
  { title: 'Protective Care', description: 'Hand hygiene and protective-care formats for retail, travel, workplace and private-label programs.', categories: ['protective-products'] },
  { title: 'Lip Care', description: 'Customizable lipstick formats covering classic finishes, reactive color and bespoke packaging programs.', categories: ['lip-care'] },
  { title: 'Sun Care', description: 'Custom sunscreen spray, gel, cream, lotion and stick formats developed around texture, application, testing and target-market requirements.', categories: ['sun-care'] },
];

export const categoryNames = Object.fromEntries(categories.filter(({ id }) => id !== 'all').map(({ id, name }) => [id, name]));

export const categoryThemes = {
  all: {
    accent: '#21343a',
    dark: '#16272d',
    soft: '#eef1ef',
    surface: '#f8f6f1',
    highlight: '#c49a45',
  },
  'lip-care': {
    accent: '#b42346',
    dark: '#761a33',
    soft: '#fbe8ed',
    surface: '#fff8f9',
    highlight: '#c99b45',
  },
  'sun-care': {
    accent: '#146f9c',
    dark: '#0d4d6d',
    soft: '#e6f3f8',
    surface: '#f8fcfd',
    highlight: '#e9aa25',
  },
  'protective-products': {
    accent: '#527f92',
    dark: '#315767',
    soft: '#e8f1f4',
    surface: '#f7fbfc',
    highlight: '#c3aa66',
  },
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