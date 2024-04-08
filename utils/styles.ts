export function generateColorVariations(baseColor: string) {
  const hslBase = rgbToHsl(baseColor);

  const variations = {
    '50': hslToHex({ h: hslBase.h, s: hslBase.s, l: hslBase.l + 0.1 }),
    '100': hslToHex({ h: hslBase.h, s: hslBase.s, l: hslBase.l + 0.2 }),
    '200': hslToHex({ h: hslBase.h, s: hslBase.s, l: hslBase.l + 0.3 }),
    '300': hslToHex({ h: hslBase.h, s: hslBase.s, l: hslBase.l + 0.4 }),
    '400': hslToHex({ h: hslBase.h, s: hslBase.s, l: hslBase.l + 0.5 }),
    '500': hslToHex({ h: hslBase.h, s: hslBase.s, l: hslBase.l }),
    '600': hslToHex({ h: hslBase.h, s: hslBase.s, l: hslBase.l - 0.1 }),
    '700': hslToHex({ h: hslBase.h, s: hslBase.s, l: hslBase.l - 0.2 }),
    '800': hslToHex({ h: hslBase.h, s: hslBase.s, l: hslBase.l - 0.3 }),
    '900': hslToHex({ h: hslBase.h, s: hslBase.s, l: hslBase.l - 0.4 }),
    '950': hslToHex({ h: hslBase.h, s: hslBase.s, l: hslBase.l - 0.5 }),
  };

  return variations;
}

function rgbToHsl(rgb: string) {
  const r = parseInt(rgb.substring(1, 3), 16) / 255;
  const g = parseInt(rgb.substring(3, 5), 16) / 255;
  const b = parseInt(rgb.substring(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    if (!h) throw new Error('h is undefined');

    h /= 6;
  }

  return { h: h, s: s, l: l };
}

function hslToHex(hsl: { h: number; s: number; l: number }) {
  const h = hsl.h * 360;
  const s = hsl.s * 100 + '%';
  const l = hsl.l * 100 + '%';

  return `hsl(${h}, ${s}, ${l})`;
}
