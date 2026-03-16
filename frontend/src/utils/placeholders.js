// Placeholder image utility
export const generatePlaceholder = (width, height, text = 'Placeholder', color = '6366f1') => {
  // Using picsum.photos as a more reliable alternative
  return `https://picsum.photos/${width}/${height}?random=${Math.random().toString(36).substring(7)}`;
};

export const generateAvatar = (size = 100, seed = null) => {
  // Using dicebear for avatars
  const seedValue = seed || Math.random().toString(36).substring(7);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seedValue}`;
};

// Fallback to data URI if external services fail
export const getFallbackImage = (width = 400, height = 225, text = 'Image') => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#6366f1');
  gradient.addColorStop(1, '#8b5cf6');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add text
  ctx.fillStyle = 'white';
  ctx.font = `${Math.min(width / 10, 20)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  return canvas.toDataURL();
};

// Common placeholder sizes
export const PLACEHOLDERS = {
  THUMBNAIL: () => generatePlaceholder(400, 225, 'Course'),
  CARD: () => generatePlaceholder(300, 200, 'Preview'),
  AVATAR: (seed) => generateAvatar(100, seed),
  SMALL_AVATAR: (seed) => generateAvatar(40, seed),
  LARGE: () => generatePlaceholder(800, 450, 'Banner'),
};
