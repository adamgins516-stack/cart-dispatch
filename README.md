# Cart Dispatch

Two pages, one shared Firebase Realtime Database (`golf-cart-dispatch` project).

- **`index.html`** — full dispatcher dashboard (you). Categories, live ETA, elapsed timers, Done/Undo/Delete, CSV export, Clear all.
- **`request.html`** — staff-facing request form. Staff can submit a request and see the current waiting list along with an estimated wait time per request. No delete capability, and it blocks a duplicate request for a location that's already active.

Both read/write the same `requests` node, so anything staff submit on `request.html` shows up instantly on `index.html`, and anything you mark Done there disappears from the staff view.

## Note on the staff restrictions
The restrictions on `request.html` (no delete, no duplicate requests) are enforced in the page itself — there's no delete button, and a duplicate submission for an already-active location is blocked client-side. Location matching is normalized (case, whitespace, leading zeros, and a trailing A/B sub-cabin letter are ignored) so "B5", "B5A", and "B05A" are all treated as the same spot. Since the Firebase rules are currently open (`.read`/`.write`: true for anyone), this is a UI-level restriction, not a hard permission wall — someone who deliberately dug into the raw database URL could still see or change data directly. For a one-day event with people using the page normally, this is a reasonable tradeoff. If you ever want a real access wall, that needs Firebase Authentication, which is a bigger addition — just let me know if that becomes worth it.

## Note on the dashboard password
`index.html` (your dashboard) is gated by a password prompt (client-side, same tradeoff as above — it's a deterrent, not real security, since the password is visible in the page source to anyone who looks). Once entered correctly it's remembered in that browser via `localStorage`, so you won't be asked again on that device. `request.html` (the staff link) is intentionally left open since that's the one you hand out.

## Deploying
This repo is connected to Vercel project `cartdispatch`, live at `https://fwfcart.vercel.app/`:
- `https://fwfcart.vercel.app/` → `index.html` (you, password-protected)
- `https://fwfcart.vercel.app/request.html` → staff (share this link)

Any future changes: push to `main` on GitHub and Vercel redeploys automatically.
