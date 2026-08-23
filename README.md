# Cart Dispatch

Two pages, one shared Firebase Realtime Database (`golf-cart-dispatch` project).

- **`index.html`** — full dispatcher dashboard (you). Categories, live ETA, elapsed timers, Done/Undo/Delete, CSV export, Clear all.
- **`request.html`** — staff-facing request form. Staff can submit a request and see the current waiting list along with an estimated wait time per request. No delete capability, and it blocks a duplicate request for a location that's already active.

Both read/write the same `requests` node, so anything staff submit on `request.html` shows up instantly on `index.html`, and anything you mark Done there disappears from the staff view.

## Note on the staff restrictions
The restrictions on `request.html` (no delete, no duplicate requests) are enforced in the page itself — there's no delete button, and a duplicate submission for an already-active location is blocked client-side. Since the Firebase rules are currently open (`.read`/`.write`: true for anyone), this is a UI-level restriction, not a hard permission wall — someone who deliberately dug into the raw database URL could still see or change data directly. For a one-day event with people using the page normally, this is a reasonable tradeoff. If you ever want a real access wall, that needs Firebase Authentication, which is a bigger addition — just let me know if that becomes worth it.

## Deploying
Import this repo into Vercel with default settings (no framework, no build step). You'll get one URL with two pages:
- `https://your-project.vercel.app/` → `index.html` (you)
- `https://your-project.vercel.app/request.html` → staff

Any future changes: edit the file on GitHub (or push from your machine) and Vercel redeploys automatically — no more dragging files into vercel.com/drop.
