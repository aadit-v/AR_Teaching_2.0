# DNM 8Z100A — WebAR Faceplate Guide

Point a phone at the 90's Boombox sticker on the MUSIC VOL knob. MindAR locks onto the
sticker, 15 pins appear over the physical controls, and tapping a pin opens a bottom sheet
explaining what that control does.

## Run it

```bash
npm install
npm run dev      # serves over https on your LAN so a real phone can open it
```

Open the printed `https://192.168.x.x:5173` address on the phone and accept the self-signed
certificate warning. Camera access will not work over plain `http` on anything but
`localhost` — that is a browser rule, not a bug in this app.

## The one thing you must supply: `public/targets/boombox.mind`

MindAR tracks a compiled target file, not a raw image. It is not in this repo because it has
to be built from your actual sticker.

1. Photograph the sticker flat-on, evenly lit, cropped tight to its edges. Aim for ~1000 px
   on the long side, no glare, no perspective skew.
2. Open the MindAR image target compiler (`https://hiukim.github.io/mind-ar-js-doc/tools/compile`),
   drop the image in, and download `targets.mind`.
3. Rename it `boombox.mind` and drop it in `public/targets/`.

The compiler shows a feature-point preview. A retro boombox graphic with dense linework and
high contrast should score well; if the preview looks sparse, the sticker is too glossy or
too low-contrast and tracking will drift.

## Calibrating the pin positions

`src/data/controlsData.js` holds the registry exactly as specified. Coordinates are in
**target units, where 1.0 on X equals the full width of the tracked sticker.**

That matters more than it sounds. The supplied X offsets span 0.55 to −3.1, so the leftmost
pin (power switch) sits 3.1 sticker-widths to the left of the anchor. If your sticker is,
say, 25 mm wide, that puts the power switch ~78 mm from the knob centre. Measure the real
faceplate, and if it does not match, scale every X and Y by the same factor rather than
adjusting pins individually — the relative spacing in the registry is internally consistent.

Two practical notes on tracking at this range:

- Pins this far from the anchor amplify any angular error in the pose estimate. Keep the
  phone roughly square to the panel; a 5° tilt that looks fine on the sticker can push the
  leftmost pin off its knob by a visible margin.
- If the far-left pins jitter, raise `filterMinCF` in `src/main.js` (steadier, laggier) or
  consider adding a second sticker near the Zone 1 knob as a separate anchor.

## Structure

```
index.html                  shell, entry gate, HUD, fallback list
src/main.js                 MindAR lifecycle, tap → raycast routing
src/data/controlsData.js    the control registry + per-type icon/tint map
src/ar/hotspots.js          canvas-textured pin meshes, idle motion, picking
src/ui/drawer.js            frosted bottom sheet, drag-to-dismiss
src/styles/app.css          all styling
public/targets/             put boombox.mind here
```

## Deploying

```bash
npm run build     # → dist/
```

Serve `dist/` from any static host with HTTPS (Netlify, Vercel, Cloudflare Pages, GitHub
Pages). `base` is set to `./` so it works from a subdirectory. Nothing runs server-side.

## Design decisions worth knowing

- **Pins are numbered discs, not icons.** At arm's length on a phone, a 24 px glyph over a
  moving camera feed is unreadable. Colour encodes the control family (amber knobs, teal
  ports, blue button clusters, red power, green display); the icon appears in the drawer
  where there is room for it.
- **The camera starts on a tap.** iOS Safari refuses `getUserMedia` outside a user gesture,
  so the entry gate is functional, not decorative.
- **There is a no-camera fallback.** If permission is denied or the context is insecure, the
  same registry renders as a tappable list with the same drawer. The content is useful even
  when the AR is not.
