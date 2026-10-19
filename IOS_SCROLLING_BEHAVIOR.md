# iOS Scrolling Behavior - Key Learnings

## The Problem
Getting a web app to scroll naturally on iOS Safari, where content flows under the transparent status bar (like a native app), while maintaining a fixed bottom navigation.

## The Solution

### Critical Discovery: The 8px Threshold
For iOS Safari to treat your web app as a **scrollable webpage** (allowing content to scroll under the browser UI) rather than an **app-like fixed layout**, any fixed elements at the bottom must be positioned **at least 8px from the bottom edge**.

**This 8px measurement includes:**
- The element itself
- Any shadows or visual effects that extend beyond the element's bounds
- Any `padding-bottom` values

### Example
If you have a navigation with:
- A `box-shadow` that extends 2px below the element
- You need `paddingBottom: calc(var(--safe-bottom) + 10px)`

Why 10px? Because the shadow extends the visual bounds by ~2px, so you need 8px + 2px = 10px to maintain the minimum 8px clearance.

## Implementation Details

### HTML Meta Tags
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="theme-color" content="#6C7254" />
```

### CSS Variables for Safe Areas
```css
:root {
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}
```

### Fixed Navigation Positioning
```css
.navigation {
  position: fixed;
  bottom: 0;
  left: 1.25rem;
  right: 1.25rem;
  padding-bottom: calc(var(--safe-bottom) + 10px);
  /* 10px = 8px minimum + 2px for shadow clearance */
}
```

### What Breaks the Behavior
❌ **Don't use:**
- `position: fixed` with `bottom: 0` and no padding
- `position: sticky` on fixed elements
- `left: 0` and `right: 0` without margins (makes Safari think it's an app bar)
- Less than 8px total clearance from the bottom
- **Animations that slide elements below the 8px threshold** (e.g., `y: '100%'` or `y: 200`)

✅ **Do use:**
- `position: fixed` with proper bottom spacing (8px minimum)
- Margins on left/right to avoid edge-to-edge layout
- Safe area insets for iOS notch/home indicator
- Account for shadows and visual effects in spacing calculations
- **Fade/scale animations instead of slide animations** for elements near the bottom

## Testing Checklist
1. Open in iOS Safari (not standalone/home screen mode)
2. Scroll the page - status bar should be transparent with content behind it
3. Content should scroll smoothly without the browser UI interfering
4. Navigation should stay fixed at bottom with proper spacing
5. Check on devices with and without home indicators (iPhone X+ vs older models)

## Animations and the 8px Threshold

### Critical Discovery: Animations Trigger Viewport Resizing
iOS Safari monitors the **entire lifecycle** of fixed elements, including their animations. If an element animates below the 8px threshold at any point (even during enter/exit animations), it will trigger viewport resizing.

### The Problem
```jsx
// ❌ BAD: Slides from below viewport - triggers resize
<motion.div 
  initial={{ y: '100%' }}  // Starts below viewport
  animate={{ y: 0 }}
  exit={{ y: '100%' }}     // Exits below viewport
/>

// ❌ BAD: Slides from below - triggers resize
<motion.div 
  initial={{ y: 200 }}     // Starts 200px below position
  animate={{ y: 0 }}
  exit={{ y: 200 }}        // Exits 200px below position
/>
```

### The Solution
```jsx
// ✅ GOOD: Fades and scales in place - no resize
<motion.div 
  initial={{ opacity: 0, scale: 0.95, y: 20 }}  // Small upward shift only
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95, y: 20 }}
/>
```

### Drag Interactions
When implementing drag-to-dismiss, ensure the element cannot be dragged below the safe zone:

```jsx
// ✅ GOOD: Constrained drag with no elastic beyond safe zone
<motion.div
  drag="y"
  dragConstraints={{ top: 0, bottom: 60 }}  // Max 60px down
  dragElastic={0}  // No elastic bounce beyond constraints
  style={{ bottom: '88px' }}  // 88px - 60px = 28px (safe!)
/>
```

**Important**: Even with drag constraints, iOS monitors the visual position. Calculate your constraints to ensure:
```
(element bottom position) - (max drag distance) - (shadow size) >= 8px
```

Example:
- Element at `bottom: 88px`
- Max drag: `60px`
- Shadow extends: `4px`
- Final position: `88px - 60px - 4px = 24px` ✅ (well above 8px threshold)

## Standalone Web App Mode (Add to Home Screen)

### Key Difference: No Safari UI Restrictions
**Important**: In standalone mode (PWA), the iOS scrolling limitations described above **DO NOT APPLY**. There is no Safari UI (address bar, toolbar, search bar) to flow content under, so:
- ✅ You don't need to extend content beyond the viewport (`100vh` is sufficient)
- ✅ You don't need negative margins to pull content up
- ✅ Fixed elements can be positioned normally without the 8px threshold concerns
- ✅ The viewport is stable and doesn't resize based on Safari UI visibility

The viewport in standalone mode is simply the entire screen (minus system UI like status bar and home indicator).

### The Problem
When a user adds your web app to their iOS home screen, it runs in standalone mode with different behavior:
- The status bar becomes part of your app's viewport
- `safe-area-inset-top` is added to account for the status bar
- If you add `padding-top: var(--safe-top)` to the body, it pushes all content down, creating unwanted spacing

### The Solution
To allow content to flow naturally under the translucent status bar in standalone mode:

```html
<!-- Use black-translucent for status bar -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

```css
body {
  /* ❌ DON'T add top padding - this pushes content down */
  /* padding-top: var(--safe-top); */
  
  /* ✅ DO keep bottom padding for home indicator */
  padding-bottom: var(--safe-bottom);
  background-color: #6C7254; /* Your brand color */
}
```

```html
<!-- ❌ DON'T add a fixed safe-area-top div -->
<!-- <div class="safe-area-top"></div> -->

<!-- ✅ DO let content flow naturally -->
<body>
  <div id="root"></div>
</body>
```

### Why This Works
- `black-translucent` makes the status bar overlay your content with a translucent background
- No top padding allows your content to start at the very top of the viewport
- The status bar text remains visible over your content
- Your brand color (set in `theme-color` and body background) shows through the translucent status bar

### Testing
1. Add the web app to your home screen
2. Open it - the status bar should show your brand color
3. Content should flow up under the status bar naturally
4. Scroll should work smoothly without extra spacing at the top

## Key Takeaway

### Browser Mode (Safari)
iOS Safari distinguishes between "webpage" and "app" based on subtle layout cues. Keep at least 8px clearance at the bottom (including shadows) and avoid full-width edge-to-edge layouts to maintain natural scrolling behavior.

**For animations**: Use fade/scale effects instead of sliding below the viewport. The 8px rule applies to the entire animation lifecycle, not just the final resting position.

**For content overflow**: Extend content beyond the viewport (`calc(100vh + 200px)`) with negative margins to allow it to flow under Safari's dynamic UI (address bar, toolbar, search bar).

### Standalone Mode (PWA/Add to Home Screen)
None of the Safari UI restrictions apply! The viewport is stable and equals the screen size. Use standard layout techniques:
- `100vh` height is sufficient (no need for extensions)
- No negative margins needed
- No 8px threshold restrictions
- Position fixed elements normally

**For status bar**: Use `black-translucent` status bar style and avoid adding top padding to let content flow naturally under the status bar.

### Summary
Detect standalone mode in JavaScript and apply different layout strategies:
```javascript
const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                     (window.navigator as any).standalone === true;

// Apply different heights, margins, and positioning based on isStandalone
```

## Multi-Tab Apps with Persistent Views

### The Problem
When building a tabbed app where some views need to stay mounted (e.g., to keep a 3D canvas loaded), scrolling on one tab can affect the scroll position of hidden tabs. When you switch back to the original tab, it may have scrolled up or down.

### The Solution
Reset the scroll position when a tab becomes active:

```javascript
// In the view component
useEffect(() => {
  if (isActive) {
    window.scrollTo(0, 0);
  }
}, [isActive]);
```

**Important**: Don't use `position: fixed` on the main content container to prevent scroll inheritance - this breaks the Safari UI flow-under behavior we worked hard to achieve. Always use `position: relative` with scroll resets instead.

## Standalone Mode UI Adaptations (November 2024)

### The Problem: Black Translucent Status Bar
As of iOS 18+ (November 2024), when using `black-translucent` status bar style in standalone mode, iOS applies a semi-transparent black overlay over the status bar area. This is intentional iOS behavior and cannot be avoided if you want content to flow under the status bar.

**The only options are:**
1. **`default`** - Solid white status bar (in Light Mode) or solid black status bar (in Dark Mode), content does NOT flow under it
2. **`black`** - Solid black status bar with white text
3. **`black-translucent`** - Content flows under the status bar, but iOS adds a black translucent overlay

There is no way to have content flow under the status bar WITHOUT the black overlay.

### The Solution: Embrace the Black Overlay with Intentional Design

Since we cannot remove the black translucent overlay, we adapted the UI design specifically for standalone mode to make it look intentional rather than broken:

#### Status Bar Area (Top)
```html
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="theme-color" content="#6C7254" />
```

```json
// manifest.json
{
  "background_color": "#6C7254",
  "theme_color": "#6C7254"
}
```

```css
/* Body background shows through the translucent status bar */
@media (display-mode: standalone) {
  body {
    background-color: #6C7254; /* Brand color */
  }
}
```

**Result**: The brand color shows through the black-translucent overlay, creating a darker, muted version of the brand color in the status bar area.

#### Header Adaptation
In standalone mode, remove the top border and make the header edge-to-edge to blend with the status bar:

```javascript
// Header.tsx
const [isStandalone, setIsStandalone] = useState(false);

useEffect(() => {
  const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                    (window.navigator as any).standalone === true;
  setIsStandalone(standalone);
}, []);

// In JSX
<div style={{
  left: isStandalone ? "0" : "0.5rem",
  right: isStandalone ? "0" : "0.5rem",
}}>
  <a style={{
    borderTop: isStandalone ? "none" : `9px solid ${brandColor}`,
    borderLeft: isStandalone ? "none" : "1px solid white",
    borderRadius: isStandalone ? "0" : "0.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Keep semi-transparent white
  }}>
    <Logo />
  </a>
</div>
```

**Why**: Removing the brand-colored top border and stretching edge-to-edge makes the header look like a native iOS component that naturally belongs under the status bar, rather than a web element awkwardly squeezed below it.

#### Navigation Adaptation
Similarly, adapt the bottom navigation for standalone mode:

```javascript
// Navigation.tsx
<div style={{
  left: isStandalone ? "0" : "1.25rem",
  right: isStandalone ? "0" : "1.25rem",
}}>
  <div style={{
    borderTop: isStandalone ? "none" : "1px solid white",
    borderLeft: isStandalone ? "none" : "1px solid white",
    borderRadius: isStandalone ? "0" : "0.5rem",
  }}>
    <div style={{
      paddingBottom: isStandalone ? "15px" : "0",
    }}>
      {/* Menu items */}
    </div>
    
    {/* Active indicator */}
    <div style={{
      bottom: isStandalone ? "auto" : 0,
      top: isStandalone ? 0 : "auto", // Move to top in standalone
    }} />
  </div>
</div>
```

**Why**: 
- **Edge-to-edge layout**: Makes it feel like a native iOS tab bar
- **Active indicator at top**: Creates visual separation from the bottom edge and matches iOS design patterns
- **Extra padding**: Provides comfortable spacing above the home indicator

#### White Background Layer
To prevent the brand color from showing in the content area:

```javascript
// App.tsx
{isStandalone && (
  <div className="fixed inset-0 bg-white -z-10" />
)}
```

**Why**: With the body set to brand color (for status bar), we need a white layer behind the content. This only applies in standalone mode to avoid breaking browser scrolling behavior.

### Key Takeaway

**Don't fight iOS behavior - design around it.** The black-translucent overlay is unavoidable if you want content to flow under the status bar. Instead:

1. Use your brand color to show through the overlay (makes it look intentional)
2. Adapt your UI components to edge-to-edge layouts in standalone mode
3. Make it look like a native iOS app rather than a web app squeezed into standalone mode

**Browser vs Standalone Summary:**

| Feature | Browser (Safari) | Standalone (Home Screen) |
|---------|-----------------|-------------------------|
| Status Bar | No control | Black-translucent overlay |
| Header | Rounded, margins, border | Edge-to-edge, no border |
| Navigation | Rounded, margins, indicator bottom | Edge-to-edge, indicator top |
| Background | White | Brand color (top area) + white layer |
| Body background | White | Brand color (shows through status bar) |

This creates a cohesive native-like experience that embraces iOS design language rather than fighting against platform constraints.



## iOS 26 Safari: Toolbar Colour Under Pinned Scroll Stories (October 2026)

Learned on the Product Connect website (`xbuild.com/productconnect`), whose pages have pinned scroll stories: `position: sticky` panels one screen tall that change background colour chapter by chapter. Tested on an iPhone with iOS 26 Safari (floating, glass-style toolbar).

### The Problem
At the top of the page the content flowed nicely under Safari's bottom toolbar. As soon as a pinned story filled the screen, the area under the toolbar turned into a solid band: first white, later stuck on the first chapter's colour while the story moved through chapters of other colours.

### What We Found
1. **The 8px rule applies to `position: sticky` too.** A sticky panel whose bottom edge sits on the screen's bottom edge (a full-height panel) puts Safari in app mode: it stops flowing the page under the toolbar and fills that area with a colour of its own. Anything the sticky element *paints* below its box counts too (we had extended its background with pseudo-elements). End sticky panels at least 8px above the bottom; we use 10px (`height: calc(100svh - 10px)`), with nothing painted below.
2. **Extending the panel past the bottom does not help.** We tried `100lvh` plus an extra 120px below the screen: still a solid band.
3. **The page background, `html` background and `theme-color` are read once, at page load.** Changing them while scrolling has no effect; reloading the page picks up the new colour (that is how we noticed).
4. **Safari follows a solid `position: fixed` element on the bottom edge, live.** When such an element's `background-color` changes, the area under the toolbar changes with it, immediately.
   - It must be **at least 12px tall**. 2px and 8px strips are ignored.
   - It must be a **`background-color`**. A gradient `background-image` is ignored.
   - It must be **visible**. A fixed element behind the page (`z-index: -1`) or under an opaque panel is ignored.
   - **Recolouring a sticky element is ignored**, and so are removing and re-inserting fixed elements or sliding them off the edge and back.
5. **A fixed element on the bottom edge takes the bottom bar over.** While it is there, the page does not flow under the toolbar; the bar shows that element's colour instead.
6. **Removing that element is not enough to give the bar back.** If you simply remove it (`display: none`), Safari keeps the bar solid in its last colour, so the page no longer flows under the toolbar, even after you scroll back to the top where it did on first load. Scrolling, the header sliding in and out, un-sticking the pinned panels, changing the page background, rewriting the viewport tag and changing the URL hash all leave it stuck. What releases it: **show the fixed element in the colour of the content now at that edge, keep it about 300ms, then remove it.** Safari then lets the page flow under the toolbar again.
7. **That handover has to happen where the page has settled.** Scrolling slowly, the element switches off while the story's own colour is still at the edge, so the handover uses the wrong colour and the bar stays solid further on. Keep handing over until it has been removed over plain page content: follow the colour at the edge, remove the element once that colour has held for 300ms, and show it once more whenever the colour changes before then.
8. **The same works at the top edge.** A solid 12px fixed element on the top edge colours the status bar area, and follows its colour changes.
9. **Take only fully opaque colours.** A semi-transparent card or overlay at the edge would hand Safari a colour that is not what you see there.
10. **`html { overflow-x: clip }` does not stop sideways panning on iOS.** If any element sticks out past the screen edge, iOS still lets you pan into it and shows white beside the page. Clip the overflow on the element's own container (`overflow: clip`) instead.

### Our Solution
On touch screens only (`(hover: none) and (pointer: coarse)`), one script in the site header handles every pinned story and the footer.

**While a pinned story fills the bottom of the screen**
- **Bottom band:** a 12px solid band, `position: fixed; bottom: 0`, in the colour currently at the bottom of the screen. Safari takes the toolbar colour from it and follows every chapter change.
- **Fade:** above the band, a fade into the same colour, at `z-index: 1`.
  - It blends in over 72px, then stays solid over the strip the toolbar frees when it shrinks (`calc(100lvh - 100svh + 72px)`). The stories end 10px above the bottom of the smaller screen, so this keeps their section from showing below them.
  - Menus, story text and progress dots (`z-index: 2` and up) pass over it; globes and canvases fade into it.
  - Its top stays 80px below the story's own top, so it never covers the section and menu above while the story scrolls in.
  - No fade on a story or footer whose content runs close to the bottom; they get only the band.
- **Top band:** a matching 12px band on the top edge colours the status bar area. It is left off where a white menu sits at the top of the story, since there the status bar should stay white.

**Getting the colour right**
- The colour comes from whatever is at that edge of the screen: the story's colour layer, or the first fully opaque background under that point.
- Where a canvas draws the visible surface (our sphere), the script that draws it publishes its exact colour at the bottom edge (`data-bottom-colour`), and that is used instead.

**When the story ends:** the bands are handed over as in findings 6 and 7, not just removed. After that the page flows under the toolbar again, also when scrolling back to the top.

```js
const band = document.createElement("div");
band.style.cssText = "position:fixed;left:0;right:0;bottom:0;height:12px;z-index:1;pointer-events:none;display:none";
document.body.append(band);

// after a story: follow the colour at the edge, remove once it has held 300ms, show again if it changes before that,
// and stop once it has been removed over plain page content
let pending = false, colour = "", timer = 0;
function setBand(inStoryNow, colourAtEdge, edgeIsInStory) {
  if (inStoryNow) { clearTimeout(timer); band.style.display = "block"; pending = true; colour = ""; return; }
  if (!pending || colourAtEdge === colour) return;
  colour = colourAtEdge;
  band.style.backgroundColor = colourAtEdge;
  band.style.display = "block";
  clearTimeout(timer);
  timer = setTimeout(() => { band.style.display = "none"; if (!edgeIsInStory) pending = false; }, 300);
}
// on scroll (requestAnimationFrame): while in a story, also set band.style.backgroundColor to the story's colour
```

Desktop keeps the stories at full height with no band. There is no toolbar to account for there.

### How We Found It: A Test Page on the Phone
Guessing one fix per deploy was slow. What worked was a throwaway test page on the dev server, opened on the iPhone over the local network (`astro dev --host`, then `http://<mac-ip>:<port>/`):

- Make the layout match the real case. Our first test page let content flow under the toolbar, so it could not show the problem. Use a full-screen panel like the real stories.
- Give one button per technique, each moving to the next colour. Each button must recolour the element it is testing; ours first only recoloured the panel, which hid that the bottom element was the one in control.
- Record per technique: does the bar follow, is it solid or see-through, and with the toolbar expanded or shrunk.
- For a "stuck" state, rebuild the path that causes it (here: a hero, a pinned story, back up to the hero) and put one reset per button where you end up. One reset (flashing the band in the hero's colour) worked every time; that became finding 6.
