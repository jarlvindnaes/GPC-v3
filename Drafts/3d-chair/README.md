# TAKT Cross Chair — 3D viewer (draft)

A standalone Three.js viewer for the **TAKT Cross Chair (oak, matt lacquer)** — the realism + interaction spike before wiring it into the site. Reference: https://taktcph.com/products/cross-chair/#/oak-matt-lacquer/none

**Final files:** `cross-chair-03.html` (viewer) · `cross-chair-03.glb` (model, from Blender) · `studio.hdr` (lighting).
(Earlier iterations — the `.dae` viewer, `cross-chair-01/02` — and the raw TAKT downloads in `~/Desktop/TAKT 3D` are left out of the repo.)

## Run it
Needs a local server + internet (Three.js loads from a CDN):
```
cd Drafts/3d-chair
python3 -m http.server 8777
# open http://localhost:8777/cross-chair-03.html
```

## Interactions
- **Orbit** — drag to rotate, scroll to zoom (auto-rotates until you interact).
- **Select** — click a part → blue **outline** (OutlinePass) + blue **overlay tint** + the part name. Parts are the named Blender meshes: `seat · Back · Cross · leg-front/back-left/right · fastners`.
- **Explode** — slider separates the parts along Y (proportional to height from centre).

## The look — recipe (carry this into the production R3F build)
- **Model:** `cross-chair-03.glb` — named meshes, embedded oak base-color + (seat/back) normal & roughness maps. *(Still TODO from Blender: tangents on export, normal/roughness on the legs material, Opaque blend mode + JPG color maps.)*
- **Lighting:** HDRI `studio_small_03_1k.hdr` (same as the leather chair) · exposure **0.65** · oak `envMapIntensity` **0.4** · warm key `#fff8f0` (0.5) + warm fill `#ffe9d5` (0.25), no cool light.
- **Material:** matte (roughness **0.85**) + warm honey tint **`#ffe6c6`** (corrects a green/cool cast; the matte stops the seat mirroring the bright studio).
- **Shadow:** soft neutral-grey contact "blob" (radial-gradient plane) — **currently off** (`scene.add(blob)` commented). No long directional drop.
- **Anti-aliasing:** MSAA **8×** multisampled render target + **SMAA** pass (the EffectComposer bypasses the renderer's built-in AA).

## Production notes
- Mount `cross-chair-03.glb` as a `@react-three/fiber` island like `west_elm_slope_leather_chair.glb`; it inherits the site's shared `<Environment>` + `ContactShadows`.
- Selection → drei `<Selection>`/`<Outline>` + an emissive override; AA → `gl={{ antialias: true }}` + `@react-three/postprocessing`.
- Per-component selection is the hook for the **component-level DPP** story (click a part → its CO₂ / material / supplier).
