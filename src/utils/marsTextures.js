// Create a noise function for more realistic terrain
const createNoise = (amplitude, frequency) => {
  return (x, y) => {
    const noise = Math.sin(x * frequency) * Math.cos(y * frequency) * amplitude;
    return noise;
  };
};

// Generate Mars-like colors
const generateMarsColor = (baseColor, variation) => {
  const r = baseColor.r + (Math.random() * variation * 2 - variation);
  const g = baseColor.g + (Math.random() * variation * 2 - variation);
  const b = baseColor.b + (Math.random() * variation * 2 - variation);
  return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
};

// Create crater effect
const createCrater = (ctx, x, y, radius) => {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, 'rgba(80, 40, 20, 0.8)');
  gradient.addColorStop(0.8, 'rgba(139, 69, 19, 0.3)');
  gradient.addColorStop(1, 'rgba(139, 69, 19, 0)');
  return gradient;
};

export const generateMarsTexture = (ctx, width, height) => {
  // Base colors for Mars surface
  const baseColor = { r: 139, g: 69, b: 19 }; // Saddle brown
  const darkColor = { r: 120, g: 50, b: 15 };
  const lightColor = { r: 160, g: 85, b: 25 };

  // Create noise functions for terrain
  const terrainNoise = createNoise(20, 0.02);
  const detailNoise = createNoise(10, 0.1);

  // Fill base texture
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const noise = terrainNoise(x, y) + detailNoise(x, y);
      const color = noise > 0 ? lightColor : darkColor;
      ctx.fillStyle = generateMarsColor(color, 10);
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Add craters
  const numCraters = Math.floor((width * height) / 40000); // Adjust density as needed
  for (let i = 0; i < numCraters; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 20 + 5;
    ctx.fillStyle = createCrater(ctx, x, y, radius);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add dust and small details
  ctx.globalCompositeOperation = 'overlay';
  for (let i = 0; i < width * height / 100; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 2 + 1;
    ctx.fillStyle = `rgba(255, 240, 220, ${Math.random() * 0.1})`;
    ctx.fillRect(x, y, size, size);
  }
  ctx.globalCompositeOperation = 'source-over';
};
