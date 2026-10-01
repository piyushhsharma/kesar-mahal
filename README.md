# Kesar Mahal (fictional lake palace) — cinematic scene site

Static site. No build step.

## Deploy on Vercel
1. Push this folder to GitHub, then Vercel > Add New > Project > import it (Framework: Other, no build command).
   Or run `npx vercel` inside this folder.

## Add your AI visuals (all optional, site works without them)
Drop files in `assets/`. Any missing file falls back to the built-in code-made scene.
Videos: `assets/videos/<name>.mp4`  (5-8s, 16:9, under ~8 MB, H.264)
Images: `assets/images/<name>.jpg` (1920x1080, shown if no video)

| Name | What to generate |
|---|---|
| lake | Sunset over a lake in Udaipur, small wooden boat, hills, slow forward drift |
| arrival | White heritage palace gate with arched doorway and steps, camera slowly walking in |
| reception | Palace reception with an arched window, a smiling concierge in a beige jacket standing centered, warm light |
| rooms | Same reception frame (reuse the reception file) |
| room-royal / room-heritage / room-garden / room-lake | Slow walk-through of a heritage suite, carved wooden bed, warm lamps |
| enquiry | Top-down on a marble desk with a cream paper letter, soft light |
| seal | Cream envelope on marble, hand pressing a red wax seal |

Tip: use one style line in every prompt, e.g. "warm golden-hour light, cinematic, shallow depth of field, 35mm".
Keep the first frame of each video close to the matching image so crossfades feel seamless.

## Enquiries by email
Create a free form at formspree.io, paste its URL into `CONFIG.formEndpoint` at the top of `app.js`.
