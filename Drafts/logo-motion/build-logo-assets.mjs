// Builds the Product Connect lockup assets (mark + "product connect" wordmark) and the data the After Effects
// project PC_Logo_Motion.aep reads, from the website's own sources:
//   - the mark and its motion: src/components/PcLogoAnimated.astro (72 steps per 3 s lap, REST frame)
//   - the wordmark: SiteHeader.astro's .site-brand - Inter weight 550, 17px, line-height .98,
//     letter-spacing -.7px, 12px gap, two lines centred on the 34px mark
// Text is shaped with HarfBuzz (hb-shape, the shaper Chrome uses, so kerning matches) and outlined from
// InterVariable.ttf at opsz 14 / wght 550 - the instance the site's static-opsz inter-latin.woff2 carries.
// Glyph advances are checked against that woff2 before anything is written.
//
// Run: node Drafts/logo-motion/build-logo-assets.mjs   (needs hb-shape on PATH and InterVariable.ttf)
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { create } from 'fontkitten';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '../..');
const fontFile = process.env.INTER_VARIABLE ?? join(homedir(), 'Library/Fonts/InterVariable.ttf');
const webFont = create(readFileSync(join(root, 'public/fonts/inter-latin.woff2')));
const font = create(readFileSync(fontFile));
const instance = font.getVariation({ wght: 550, opsz: 14 });

// Header CSS, in px. The mark is 34px tall; its viewBox is 458 x 464 logo units.
const css = { markHeight: 34, gap: 12, fontSize: 17, lineHeight: 0.98, letterSpacing: -0.7 };
const unit = 464 / css.markHeight; // logo units per px
const markWidth = 458; // logo units
const upm = font.unitsPerEm;
const k = (css.fontSize / upm) * unit; // logo units per font unit

// Same metrics in both files, so the browser's line boxes can be reproduced exactly.
for (const key of ['unitsPerEm', 'ascent', 'descent']) {
  if (webFont[key] !== font[key]) throw new Error(`${key} differs from the website font`);
}

const shape = (text) =>
  JSON.parse(
    execFileSync('hb-shape', ['--variations=wght=550,opsz=14', '--no-glyph-names', '--output-format=json', fontFile, text], {
      encoding: 'utf8',
    }),
  );

// Website-font check: default-instance advances must match glyph for glyph.
for (const word of ['product', 'connect']) {
  for (const ch of word) {
    const a = webFont.glyphsForString(ch)[0].advanceWidth;
    const b = font.glyphsForString(ch)[0].advanceWidth;
    if (a !== b) throw new Error(`advance of "${ch}" differs from the website font (${a} vs ${b})`);
  }
}

// CSS line boxes: line-height .98 with typo metrics, the two-line block centred on the mark (align-items:center).
const lineBox = css.lineHeight * css.fontSize;
const content = ((font.ascent - font.descent) / upm) * css.fontSize;
const halfLeading = (lineBox - content) / 2;
const blockTop = (css.markHeight - 2 * lineBox) / 2;
const baselines = [0, 1].map((n) => (blockTop + n * lineBox + halfLeading + (font.ascent / upm) * css.fontSize) * unit);
const textX = markWidth + css.gap * unit;

const r = (v) => Math.round(v * 1000) / 1000;
const lines = ['product', 'connect'].map((word, n) => {
  let pen = 0;
  const contours = [];
  let d = '';
  for (const g of shape(word)) {
    const ox = textX + (pen + g.dx) * k;
    const oy = baselines[n] - g.dy * k;
    const P = (x, y) => [r(ox + x * k), r(oy - y * k)];
    let cur = null;
    for (const c of instance.getGlyph(g.g).path.commands) {
      const a = c.args;
      if (c.command === 'moveTo') {
        cur = { vertices: [P(a[0], a[1])], inTangents: [[0, 0]], outTangents: [[0, 0]] };
        contours.push(cur);
        d += `M${P(a[0], a[1]).join(' ')}`;
      } else if (c.command === 'lineTo') {
        cur.vertices.push(P(a[0], a[1]));
        cur.inTangents.push([0, 0]);
        cur.outTangents.push([0, 0]);
        d += `L${P(a[0], a[1]).join(' ')}`;
      } else if (c.command === 'quadraticCurveTo' || c.command === 'bezierCurveTo') {
        const p0 = cur.vertices.at(-1);
        const end = P(a.at(-2), a.at(-1));
        let c1;
        let c2;
        if (c.command === 'quadraticCurveTo') {
          const q = P(a[0], a[1]); // quadratic -> cubic: controls 2/3 of the way to the quad control
          c1 = [p0[0] + (2 / 3) * (q[0] - p0[0]), p0[1] + (2 / 3) * (q[1] - p0[1])];
          c2 = [end[0] + (2 / 3) * (q[0] - end[0]), end[1] + (2 / 3) * (q[1] - end[1])];
          d += `Q${q.join(' ')} ${end.join(' ')}`;
        } else {
          c1 = P(a[0], a[1]);
          c2 = P(a[2], a[3]);
          d += `C${c1.join(' ')} ${c2.join(' ')} ${end.join(' ')}`;
        }
        cur.outTangents[cur.outTangents.length - 1] = [r(c1[0] - p0[0]), r(c1[1] - p0[1])];
        cur.vertices.push(end);
        cur.inTangents.push([r(c2[0] - end[0]), r(c2[1] - end[1])]);
        cur.outTangents.push([0, 0]);
      } else if (c.command === 'closePath') {
        // A closing point that repeats the first one becomes the first vertex's in-tangent.
        const v = cur.vertices;
        if (v.length > 1 && v.at(-1)[0] === v[0][0] && v.at(-1)[1] === v[0][1]) {
          cur.inTangents[0] = cur.inTangents.pop();
          v.pop();
          cur.outTangents.pop();
        }
        d += 'Z';
      }
    }
    pen += g.ax + (css.letterSpacing / css.fontSize) * upm; // letter-spacing follows every character
  }
  return { word, d, contours, width: pen * k };
});

// The box ends at the furthest ink (the final "t" overhangs its advance), not at the advance width.
let inkRight = 0;
for (const l of lines) {
  for (const c of l.contours) {
    c.vertices.forEach((v, i) => {
      inkRight = Math.max(inkRight, v[0], v[0] + c.inTangents[i][0], v[0] + c.outTangents[i][0]);
    });
  }
}
const lockupWidth = Math.ceil(Math.max(inkRight, textX + Math.max(...lines.map((l) => l.width))));

// Resting frame of the mark, as public/logo-rest.svg.
const mark = (ink, dot) =>
  `<defs><mask id="gap" maskUnits="userSpaceOnUse" x="0" y="0" width="458" height="464"><rect width="458" height="464" fill="#fff"/><g fill="#000"><circle cx="349.69" cy="61.72" r="72.04"/><circle cx="268.39" cy="174.7" r="49.47"/></g></mask></defs>` +
  `<circle cx="317.7" cy="240.21" r="22.19" fill="${ink}"/><circle cx="380.64" cy="263.42" r="14.16" fill="${ink}"/>` +
  `<circle cx="228.791" cy="235.172" r="205.79" fill="none" stroke="${ink}" stroke-width="46" mask="url(#gap)"/>` +
  `<circle cx="349.69" cy="61.72" r="60.04" fill="${dot}"/><circle cx="268.39" cy="174.7" r="37.47" fill="${ink}"/>`;
const words = (ink) => `<path fill="${ink}" d="${lines.map((l) => l.d).join('')}"/>`;
const svg = (w, x, body, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w - x}" height="464" viewBox="${x} 0 ${w - x} 464" fill="none" role="img" aria-label="${label}">${body}</svg>\n`;

const themes = { '': ['#000', '#6F7DCE'], '-white': ['#fff', '#D6EF8C'] };
for (const [suffix, [ink, dot]] of Object.entries(themes)) {
  writeFileSync(join(here, `pc-lockup${suffix}.svg`), svg(lockupWidth, 0, mark(ink, dot) + words(ink), 'Product Connect'));
  writeFileSync(join(here, `pc-wordmark${suffix}.svg`), svg(lockupWidth, Math.floor(textX), words(ink), 'Product Connect'));
}

// After Effects: wordmark contours in logo units (the mark comps use the same space, offset by [40, 48]).
writeFileSync(
  join(here, 'wordmark-ae.json'),
  JSON.stringify({ textX: r(textX), baselines: baselines.map(r), lockupWidth, lines: lines.map(({ word, contours }) => ({ word, contours })) }),
);

// Mark motion, straight from PcLogoAnimated.astro (paste into the AE "Logo Data" text layer).
const src = readFileSync(join(root, 'src/components/PcLogoAnimated.astro'), 'utf8');
const circles = [...src.slice(src.indexOf('<svg')).matchAll(/<circle[^>]*>((?:<animate[^>]*\/>)+)<\/circle>/g)].map((m) => {
  const anims = {};
  for (const a of m[1].matchAll(/<animate attributeName="(\w+)"[^>]*?values="([^"]+)"/g)) {
    anims[a[1]] = a[2].split(';').map(Number);
  }
  return anims;
});
const gap = circles.slice(0, 4);
const front = circles.slice(8, 12);
const motion = {
  source: 'GPC-v4/src/components/PcLogoAnimated.astro',
  lap: Number(src.match(/seconds = (\d+(?:\.\d+)?)/)[1]),
  rest: Number(src.match(/const REST = ([\d.]+)/)[1]),
  steps: 72,
  dots: front.map((f, i) => ({ X: f.cx, Y: f.cy, R: f.r, O: f.opacity, G: gap[i].r })),
};
writeFileSync(join(here, 'logo-motion.json'), JSON.stringify(motion));

console.log({
  lockupWidth,
  textX: r(textX),
  baselines: baselines.map(r),
  lineWidths: lines.map((l) => r(l.width)),
  contours: lines.map((l) => l.contours.length),
  vertices: lines.map((l) => l.contours.reduce((n, c) => n + c.vertices.length, 0)),
});
