# Cart Dispatch

Two pages, one shared Firebase Realtime Database (`golf-cart-dispatch` project).

- **`index.html`** — staff-facing request form (this is the simple link you hand out — it's the site root). Staff can submit a request, see the current waiting list, how long each has been waiting, and an estimated wait time per request. No direct delete — instead a "Remove" button asks for a reason and sends a removal *request* that you approve or deny. Also blocks a duplicate request for a location that's already active.
- **`dispatch.html`** — full dispatcher dashboard (you, password-protected). Categories, live ETA, elapsed timers, Done/Undo/Delete, approve/deny staff removal requests, CSV export, Clear all.

Note the swap from earlier: the root URL used to be the dashboard and `/request.html` was the staff link. It's now flipped so the link you share is as short as possible, and the dashboard lives at a less obvious path.

Both read/write the same `requests` node, so anything staff submit on `index.html` shows up instantly on `dispatch.html`, and anything you mark Done there disappears from the staff view.

Estimated wait time is the rolling average of the last 5 completed requests of that type (from `requestedAt` to when you press Done) — no added buffer. It's the same number on both pages, computed from the same data.

## Note on the staff restrictions
The restrictions on `index.html` (no direct delete, no duplicate requests) are enforced in the page itself. Location matching for duplicates is normalized (case, whitespace, leading zeros, and a trailing A/B sub-cabin letter are ignored) so "B5", "B5A", and "B05A" are all treated as the same spot. Since the Firebase rules are currently open (`.read`/`.write`: true for anyone), this is a UI-level restriction, not a hard permission wall — someone who deliberately dug into the raw database URL could still see or change data directly. For a one-day event with people using the page normally, this is a reasonable tradeoff. If you ever want a real access wall, that needs Firebase Authentication, which is a bigger addition — just let me know if that becomes worth it.

## Removal requests
Staff can't delete a request outright — the "Remove" button on `index.html` opens a small form asking why, then writes `removalRequested`, `removalReason`, and `removalRequestedAt` onto that request in Firebase (the request stays on the waiting list, marked "waiting on dispatcher"). On `dispatch.html`, that request gets a red-bordered card showing the reason with **Approve removal** (deletes it — same confirmation prompt as the manual ✕ delete) and **Deny** (clears the removal fields, back to normal). Note: any delete — via ✕ or an approved removal — is permanent. There's no soft-delete or undo once it's gone; if you delete a request you meant to keep, the only fix is to log it again by hand.

## Note on the dashboard password
`dispatch.html` (your dashboard) is gated by a password prompt (client-side, same tradeoff as above — it's a deterrent, not real security, since the password is visible in the page source to anyone who looks). Once entered correctly it's remembered in that browser via `localStorage`, so you won't be asked again on that device. `index.html` (the staff link) is intentionally left open since that's the one you hand out.

## Deploying
This repo is connected to Vercel project `cartdispatch`, live at `https://fwfcart.vercel.app/`. `vercel.json` enables clean URLs, so the `.html` extension isn't needed on either link:
- `https://fwfcart.vercel.app/` → `index.html` (staff — share this link)
- `https://fwfcart.vercel.app/dispatch` → `dispatch.html` (you, password-protected)

Any future changes: push to `main` on GitHub and Vercel redeploys automatically.
