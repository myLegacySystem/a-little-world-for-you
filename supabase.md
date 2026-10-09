# Going live with Supabase

The real photos and songs live in Supabase, not in this repository. The site reads two small tables to know which files to show and play, and loads the files from a Storage bucket.

```text
Storage bucket  birthday-assets  (public)
├── photos/   photo-01.jpg … photo-05.jpg
└── songs/    perfect.mp3, i-wanna-be-yours.mp3

Table photos   sort_order = the photo's place in the story (1–5), file_path = its file in the bucket
Table songs    the playlist, in sort_order
```

Without the two Supabase settings (see step 3), or if Supabase can't be reached within 5 seconds, the site uses the placeholder files in `public/` instead, so it never breaks.

---

## 1. Set up the project (once)

In the Supabase dashboard: **SQL Editor → New query**, paste all of [`supabase/setup.sql`](supabase/setup.sql), **Run**.

It is safe to run again, and it works whether or not you already created the bucket or tables. It:

- creates the `birthday-assets` bucket, or makes the existing one **public**;
- creates the `photos` and `songs` tables if they don't exist;
- turns on row level security, so the site's key can **read active rows and change nothing**;
- adds one row for each of the five photo places and each of the two songs, skipping any place or song that already has a row.

## 2. Upload the files

**Storage → birthday-assets**: create the folders `photos` and `songs`, then upload:

| Place | sort_order | Upload as | Best kind of photo |
|---|---|---|---|
| Memories, the larger print | 1 | `photos/photo-01.jpg` | Any photo you love |
| Memories, the smaller print | 2 | `photos/photo-02.jpg` | A second moment |
| Her eyes, seen through water | 3 | `photos/photo-03.jpg` | A close portrait, eyes near the centre |
| Her soul, warm light and petals | 4 | `photos/photo-04.jpg` | Warm, candid, sunlit |
| The birthday, the last one she sees | 5 | `photos/photo-05.jpg` | The one she should see last |

Songs: `songs/perfect.mp3` and `songs/i-wanna-be-yours.mp3`.

Other file names are fine: just change `file_path` in the row to match (Table Editor → photos / songs). Portrait 4:5 photos about 1200–1600px on the long edge, JPEG quality ~80, keep the page quick. If a crop cuts off the important part, adjust `focus` for that photo in `src/content/photos.ts`.

## 3. Connect the site (done)

The Project URL and the **publishable** key (`sb_publishable_…`) are in [`.env.production`](.env.production), which every build reads. Both are public by design. To point the site at another project, change those two lines (Supabase: **Project Settings → API Keys**, and **Data API** for the URL).

Never put the **secret** (`sb_secret_…`) / **service_role** key or the database password in this repository or the site. They can change and delete everything.

## 4. Deploy

Push or merge to `main`, or run **Deploy to GitHub Pages** from the **Actions** tab. The site is at `https://<user>.github.io/<repo-name>/`.

Then open it, step in and scroll to the end: every photo should be hers, and the ♪ drawer should show "Perfect". If something still shows a placeholder, open the browser console: a line starting with `Supabase` names what couldn't be read, and a failed request names the file that's missing.

---

## Changing things later

No code change or redeploy needed; the next visit picks it up.

- **Swap a photo:** upload the new file, then set `file_path` on that place's row. If two active rows share a place, the newer one is shown.
- **Hide something:** set `active` to false.
- **Add or reorder songs:** upload the MP3, add a row in `songs` with `title`, `artist`, `file_path`; songs play in `sort_order`. A song whose file is missing is skipped.

Prefer a new file name over re-uploading under the same name: browsers and Supabase's CDN may keep showing the old file for a while.

The `caption` column isn't used. Every word on the page, including photo captions and alt text, lives in `src/content/text.ts`.

## Running it locally with Supabase

`npm run build && npm run preview` uses Supabase (it reads `.env.production`). `npm run dev` uses the placeholders in `public/`; to use Supabase there too, copy `.env.production` to `.env.local` (git-ignored).

## Privacy, honestly

- The publishable key is meant to be seen: it ends up in the page's JavaScript, so committing it hides nothing that the site doesn't already show. Row level security (step 1) is what keeps it read-only.
- The bucket is public: anyone who opens the site can see the photos, and anyone with a file's exact URL can open it. Nobody can list the bucket or upload to it. A private bucket would not add privacy here: the site would need a read policy that lets anyone with the page's key list and download every file.
- If only she should be able to open it, that needs a passcode or sign-in in front of the photos (for example a Supabase Edge Function that checks a passcode and hands out signed URLs). That isn't built.
- While this repository is public, the words in `src/content/text.ts` can be read on GitHub.
