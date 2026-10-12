# Logo motion and lockup assets

Draft brand assets for tutorials and videos, built from the website's own sources so they match it exactly.

| File | What it is |
|---|---|
| `pc-lockup.svg`, `pc-lockup-white.svg` | Mark (resting frame) + "product connect" wordmark, light and dark |
| `pc-wordmark.svg`, `pc-wordmark-white.svg` | Wordmark only, outlined |
| `PC_Logo_Motion.aep` | After Effects 2026 project (comps below) |
| `PC_Tutorial_Graphics.prproj` | Premiere Pro 2026 project with the templates and audio on a timeline |
| `mogrt/` | The four tutorial graphics exported as Motion Graphics Templates |
| `audio/` | Audio used by both projects |
| `build-logo-assets.mjs` | Regenerates the SVGs and JSON (not the Adobe projects or templates) |
| `logo-motion.json`, `wordmark-ae.json` | Data the AE project reads |

`.aep`, `.prproj`, `.mogrt` and `.wav` files are stored with Git LFS. Run `git lfs install` once before cloning so they arrive as real files.

To use the templates in Premiere, open Essential Graphics → Browse → ⋯ → Manage Additional Folders and add `mogrt/`. The templates are 1920 x 1080, so use a 1080p sequence; in a 4K sequence they sit small in the centre.

Colours follow the logo files: `#000` + `#6F7DCE` on light, `#fff` + `#D6EF8C` on dark. The wordmark is Inter 4 at weight 550, set exactly as the site header sets it (17px, line-height .98, letter-spacing -.7px, 12px gap, centred on the 34px mark), shaped with HarfBuzz and outlined, so no font is needed to open the files.

## After Effects comps

- **PC Logo Mark - Light / Dark**: the mark on transparency. One lap every 3 s, like the website. `Logo Controller` holds `Phase` (laps; `time / 3` by default) and the `Ink` and `Dot` colours.
- **PC Logo Lockup - Light / Dark**: mark + wordmark on transparency, playing the website's hover. Set `Hover Start` and `Hover End` (seconds) on the `PC Logo Mark` layer; after Hover End it eases to the resting logo with the site's own curve.
- **PC Logo Hover - Light / Dark**: 1920 x 1080 demo of the hover on a background.
- **PC_DPM_Gravity**: an earlier, unrelated motion study of the Dynamic Product Model.

## Tutorial graphics

1920 x 1080, 30 fps, each with Essential Graphics fields and a **Dark theme** switch (colours from the site: ink `#101A2A` / paper `#F7F8FB`, data blue `#697CF5`, lime `#D6EF8C`, Inter).

- **Tutorial Intro** (6 s): label, title and optional subtitle beside the animated mark, on a plain background. Leave the subtitle empty and the block re-centres. At the end the background lifts away, so it can sit on top of the first shot.
- **Section Breaker** (2.6 s, transparent): a circle opens from the centre to fill the frame behind an accent ring, shows the section label and title, then closes again. Place it over the cut between two sections.
- **End Credits** (8 s): the closing screen. Starts fully transparent, the background rises over the last shot, then the lockup (top left), "Thank you for watching", a fine rule and the copyright and "learn more" lines spring in. It holds to the end (no exit).
- **Lower Third** (5 s, transparent): a card in the bottom left with the mark, a name and an optional role. The card sizes itself to the longest line.

Motion: every value is a damped spring (no keyframes), in the spirit of Material 3 Expressive motion: position and size overshoot slightly, opacity never does. Each text block moves as one piece. Animations play in from the start of the comp and out at its end, so change the comp duration (or the clip length in Premiere) and the timing follows. The `Motion` guide layer in each comp holds the controls: `In Start`, `Out Lead` (seconds before the end that the exit begins), `Spring Stiffness` / `Spring Damping` (higher damping = less bounce), and the same for the exit.

The motion is not keyframed by hand: the hidden `Logo Data` text layer holds the 72-step-per-lap data from `src/components/PcLogoAnimated.astro`, and every shape reads from it.

## When the website logo changes

```bash
node Drafts/logo-motion/build-logo-assets.mjs
```

This needs `hb-shape` (HarfBuzz) on the PATH and `InterVariable.ttf` (Inter 4) in `~/Library/Fonts`, or set `INTER_VARIABLE` to the path. It checks the font against `public/fonts/inter-latin.woff2` before writing. Then paste `logo-motion.json` into the `Logo Data` text layer of both mark comps. If the wordmark changed, rebuild the `Wordmark` layer from `wordmark-ae.json`.
