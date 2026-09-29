# Build Brief — Interactive Birthday Experience

## 1. Project Intent

Build a beautiful, emotionally expressive, interactive birthday website for someone extremely special to me.

This is **not** a generic birthday website.

It should not feel like:

* a portfolio
* a photo gallery
* a Pinterest clone
* a birthday template
* a slideshow
* a game
* a digital greeting card
* a long online letter

It should feel like entering a **small living world created specifically for one person**.

The website should communicate, primarily through visuals, animation, transitions, typography, music, and carefully placed words:

* She is deeply special to me.
* She has a very special place in my heart.
* Before she came into my life, things felt dull and colorless.
* Her presence brought color into my life.
* She is beautiful, but her beauty is much more than her appearance.
* She has a beautiful soul.
* Her eyes have a particularly strong effect on me.
* When she looks into my eyes, I feel drawn into hers like being drawn into the sea.
* I want her to succeed and achieve everything she wants.
* I hope she remains close to me for a long time.
* I hope she remains close to my heart.
* Most importantly, this is her birthday, and I genuinely want her to feel celebrated and special.

The experience should communicate these feelings without becoming excessively dramatic or cheesy.

---

# 2. Core Creative Concept

The central visual metaphor is:

## "You brought color into my world."

The experience begins in a muted, almost colorless world.

As the experience progresses, color gradually enters the environment.

The emotional progression should be approximately:

```text
QUIET
  ↓
DULL / COLORLESS
  ↓
A LITTLE LIGHT
  ↓
HER
  ↓
COLOR
  ↓
HER EYES / OCEAN
  ↓
HER SOUL
  ↓
HER FUTURE / DREAMS
  ↓
MY WISH FOR HER
  ↓
BIRTHDAY
  ↓
COLORFUL, WARM, ALIVE
```

This progression should happen visually rather than through huge amounts of text.

---

# 3. Important Design Principle

## Do not make the website feel like a collection of sections.

It should feel like **one continuous experience**.

Avoid:

```text
Hero
About
Gallery
Playlist
Message
Contact
```

That would make it look like a normal website.

Instead, the page should transform as the user scrolls.

Think:

```text
Scene 1
   ↓
Scene 2
   ↓
Scene 3
   ↓
Scene 4
   ↓
Scene 5
   ↓
Final scene
```

Each scene should visually transition into the next.

The user should feel like they are moving through a story.

---

# 4. Opening Scene — Before Her

The first screen should be extremely minimal.

Use a dark, muted palette.

Almost monochromatic.

Very subtle particles can slowly move in the background.

Do not immediately show photographs.

Display:

> There was a time when everything felt a little... quiet.

Then after a short delay:

> Not necessarily sad.

Then:

> Just... colorless.

Allow a pause.

Then:

> And then you came into my life.

At this point, introduce the first tiny source of color/light.

The color should slowly spread through the environment.

Think of:

* ink spreading through water
* sunlight entering a dark room
* a tiny glowing particle becoming a larger field of light

Do not use a cheap fade-to-rainbow effect.

It must feel organic and cinematic.

---

# 5. The Color Scene

As color begins entering the environment, introduce the first photograph.

Only use one photo at this point.

The photo should not appear as a rectangular card.

Instead, integrate it into the environment.

Possible techniques:

* soft mask
* floating image plane
* subtle depth
* particles surrounding it
* very slow movement
* light reacting to the image

Text:

> You probably don't realize what you changed.

Then:

> You brought color into places I didn't know were dull.

Allow the scene to breathe.

Do not immediately scroll into the next section.

---

# 6. Photography Philosophy

There will eventually be only around **4–5 real photographs**.

This is intentional.

Do NOT build a large photo gallery.

The photographs should feel rare and meaningful.

Each photograph should appear as part of the story.

A photograph may be reused later in a different visual context.

For development, create:

```text
/public/assets/images/
```

and use placeholder/dummy images.

Example:

```text
photo-01.jpg
photo-02.jpg
photo-03.jpg
photo-04.jpg
photo-05.jpg
```

Make the system easy to replace these later without changing application code.

---

# 7. Eyes / Ocean Scene

This is one of the most important scenes.

The user has described her eyes in this way:

> When she looks into my eyes, my eyes get drawn into hers like we are drawn into the sea.

Visualize this.

The environment should transition from the previous colorful world into a deep blue ocean-like environment.

Use WebGL / Three.js if appropriate.

Possible visual elements:

* animated water
* subtle waves
* floating particles
* light rays
* depth
* underwater particles
* slow camera movement

Do not make it look like a video game.

It should feel calm, dreamy and immersive.

Text should appear slowly:

> There is something about your eyes.

Pause.

> Whenever you look into mine...

Pause.

> I forget where I'm supposed to look.

Then:

> It's like being pulled into the sea.

Then:

> You don't fight it.

Then:

> You just let yourself fall.

Keep the typography elegant and restrained.

---

# 8. Quote Scene

Introduce the following quotation as a separate emotional moment.

The quotation is from the 2011 memoir/self-help book:

**Butterflies and Bullshit — Natalie Newman**

Use proper attribution.

Do not dump the entire quotation onto the screen at once.

Reveal it line-by-line with generous spacing.

The quotation:

> She was beautiful, but not like those girls in magazines.
>
> She was beautiful, for the way she thought.
>
> She was beautiful, for the sparkle in her eyes when she talked about something she loved.
>
> She was beautiful, for her ability to make other people smile, even if she was sad.
>
> No, she wasn't beautiful for something as temporary as her looks.
>
> She was beautiful, deep down to her soul.
>
> She is beautiful.

The exact quotation should be displayed respectfully and attributed.

During:

> "the sparkle in her eyes..."

introduce subtle light/particle effects inspired by stars reflected on water.

The visual language should connect the quote with the previous ocean/eyes scene.

After the quote, transition into the user's own words:

> And when I read this, I thought of you.

Then:

> Not because you're beautiful.

Pause.

> But because you're beautiful in all the ways that actually matter to me.

Then:

> Your eyes caught mine.
>
> But your soul is what made a place in my heart.

Do not overanimate this section.

Let the words breathe.

---

# 9. Her Soul

The next scene should become warmer.

Move away from deep ocean blues into warm, gentle light.

Possible visual metaphor:

* warm sunlight
* floating dust particles
* soft glowing particles
* gentle movement
* subtle bokeh
* slowly moving light

Text:

> It's not just how you look.

Then:

> It's the way you are.

Then build with short thoughts:

> The way you make things feel lighter.

> The little things you probably don't even notice about yourself.

> The way your presence can change an ordinary moment.

Then:

> You're beautiful.

Pause.

> But somehow, that's not even the thing I find most beautiful about you.

Then:

> It's your soul.

This section should feel intimate rather than grand.

---

# 10. Music

Music is an important part of the experience.

For development, do NOT use Supabase yet.

Create a local dummy music system:

```text
/public/assets/music/
```

Example:

```text
song-01.mp3
song-02.mp3
song-03.mp3
song-04.mp3
```

Use placeholder audio files or clearly documented dummy paths.

The final version will receive real songs later.

The playlist will contain only soft songs.

Do not fetch songs from external APIs.

Do not embed YouTube.

Do not use Spotify embeds.

Build a clean local audio player abstraction so that later Supabase Storage URLs can replace local paths.

The music player should be subtle.

It should NOT dominate the UI.

Possible UI:

```text
♫ Song Name
───────────────
◀   ▶   🔊
```

or a small floating music control.

Allow:

* play/pause
* previous
* next
* progress
* volume
* playlist selection

The player should persist between scenes.

When the visual scene changes, the music should not abruptly stop unless intentionally designed.

Use smooth volume transitions when changing tracks.

---

# 11. Her Future

The experience should eventually turn toward what I wish for her.

Transition from the warm scene into a night sky.

Stars slowly appear.

Text:

> And because today is about you...

Then:

> There are a few things I want for you.

Each star can represent one wish.

Keep these short.

Examples:

### Your dreams

> I hope you achieve everything you've been quietly working toward.

### Your happiness

> I hope you always have reasons to smile.

### Your success

> I want to see you go further than you ever imagined.

### Your courage

> I hope you never become smaller just because the world asks you to.

### Your life

> I hope it becomes everything you want it to be.

These should not feel like clickable game mechanics.

The stars can simply illuminate as the user scrolls.

---

# 12. The Personal Wish

After the wishes for her, make the scene quieter.

One star remains.

This is the most personal part.

Text:

> And then there's one thing I selfishly wish for myself.

Then:

> I hope life keeps you close to me.

Then:

> For as long as it allows.

Then:

> I hope there are many more birthdays where I get to be somewhere close to you.

Then:

> I hope you stay in my life.

And finally:

> And somehow, somewhere along the way...
>
> you stay close to my heart too.

This should be one of the most visually restrained moments in the website.

No huge effects.

Just stars, subtle movement and typography.

---

# 13. Birthday Finale

The entire visual world should gradually come together.

Bring back:

* the colors from the beginning
* subtle stars
* warm light
* particles
* perhaps faint ocean-like movement
* the music

Do not make it look like a birthday template.

No balloons.

No cartoon cakes.

No confetti explosion.

No generic "Happy Birthday!!!" animation.

Instead, make it elegant.

Show one final photograph.

Then:

# Happy Birthday, [NAME]

Below:

> Today isn't just another day.

Then:

> It's the day someone very special to me came into this world.

Then:

> I hope this year is kind to you.

> I hope you grow.

> I hope you succeed.

> I hope you laugh a lot.

> I hope you discover beautiful things.

> And I hope I get to be around for a lot of them.

Then the final message:

> Thank you for bringing color into my world.

Then:

# Happy Birthday. ❤️

Leave the scene alive.

Do not immediately navigate away.

Let the music continue.

Let the particles continue moving.

Let the photograph remain.

---

# 14. Interaction Model

This should primarily be a **scroll-driven cinematic experience**.

Use:

* scroll-triggered animation
* smooth transitions
* parallax
* WebGL where it genuinely improves the scene
* subtle cursor interaction
* particle systems
* depth
* blur
* light
* camera movement

Do NOT turn it into:

* a game
* a quiz
* a scavenger hunt
* a collection of buttons
* a complicated navigation system

The user should mostly just:

**open → scroll → experience**

---

# 15. Three.js

Three.js is encouraged, but only where appropriate.

Potential uses:

### Opening

Particle field that slowly becomes colorful.

### Color transition

Particles/light spreading organically.

### Ocean

WebGL water / underwater particles / depth.

### Stars

Particle-based star field.

### Finale

Combine the visual systems into a subtle living environment.

Do not use Three.js simply to show off technical skills.

The experience should remain fast and emotionally elegant.

---

# 16. Make the Website Feel Alive

This is extremely important.

Avoid static sections.

Everything should have some subtle life:

* particles moving slowly
* background gradients evolving
* photographs gently floating
* light changing
* stars twinkling
* cursor interaction
* subtle depth
* slow camera movement
* text appearing naturally
* transitions that respond to scrolling

But animation must remain **slow and calm**.

Avoid:

* bouncing text
* excessive zooms
* flashy particle explosions
* fast transitions
* excessive blur
* excessive parallax
* gimmicky effects

The overall feeling should be:

**dreamy + intimate + warm + cinematic + alive**

---

# 17. Typography

Typography is extremely important.

Use a combination of:

* elegant serif for emotional statements
* clean sans-serif for supporting text

Do not use too many fonts.

Maximum:

* 1 serif
* 1 sans-serif

Large statements should have lots of whitespace.

Do not put paragraphs inside cards.

Let text exist naturally in the environment.

---

# 18. Color System

The color palette should evolve.

### Beginning

Muted:

```text
#101116
#171923
#252733
```

### Color introduction

Gradually introduce:

* soft blue
* muted violet
* gentle pink
* warm yellow
* subtle green

### Ocean

Deep blues.

### Soul

Warm cream / peach / soft gold.

### Stars

Dark navy + subtle warm light.

### Finale

A harmonious combination of all the colors introduced earlier.

Avoid oversaturated colors.

---

# 19. Responsive Design

The website must work beautifully on:

* desktop
* laptop
* tablet
* mobile

The mobile experience is particularly important because the birthday link will likely be opened on a phone.

Do not simply shrink the desktop version.

Design mobile layouts intentionally.

Touch interactions should replace hover interactions where necessary.

Three.js effects should degrade gracefully on weaker devices.

Respect:

```css
prefers-reduced-motion
```

and provide a reduced-motion experience.

---

# 20. Performance

This is a personal website, but it should still feel professionally built.

Requirements:

* lazy load images
* compress images
* avoid loading all photos immediately
* preload the current/next required image where useful
* don't load all audio files at startup
* use audio streaming/loading appropriately
* clean up Three.js resources
* avoid memory leaks
* pause expensive animations when the section isn't visible
* use IntersectionObserver where appropriate
* keep mobile performance in mind

---

# 21. Technical Architecture

Use a clean component architecture.

Recommended structure:

```text
src/
  components/
    scenes/
      IntroScene
      ColorScene
      OceanScene
      QuoteScene
      SoulScene
      WishesScene
      BirthdayScene

    audio/
      MusicPlayer
      Playlist

    effects/
      ParticleField
      ColorParticles
      Ocean
      StarField

    ui/
      SceneText
      Photo
      ProgressIndicator

  data/
    content.ts
    playlist.ts

  assets/
```

Keep content separate from components.

For example:

```ts
const content = {
  intro: {...},
  ocean: {...},
  quote: {...},
  soul: {...},
  wishes: [...],
  finale: {...}
}
```

This will make it easy to change the wording later without rewriting the UI.

---

# 22. Dummy Data

Do not wait for real photographs or songs.

Create dummy placeholders.

For images:

```text
photo-01.jpg
photo-02.jpg
photo-03.jpg
photo-04.jpg
photo-05.jpg
```

For music:

```text
song-01.mp3
song-02.mp3
song-03.mp3
song-04.mp3
```

Make the application work with these placeholders.

Later, real assets will replace them.

---

# 23. Future Supabase Integration

DO NOT implement Supabase yet.

However, structure the code so that local assets can later be replaced by Supabase Storage URLs.

Create an abstraction such as:

```ts
getImageUrl(photo)
getSongUrl(song)
```

For now they return local asset paths.

Later they can return:

```text
https://<project>.supabase.co/storage/v1/object/public/...
```

Do not hardcode Supabase URLs into components.

---

# 24. Content Management

Keep all editable content in one place.

For example:

```text
src/data/content.ts
```

The developer should be able to change:

* her name
* birthday
* messages
* quote
* quote attribution
* wishes
* photo paths
* song paths

without touching animation code.

---

# 25. Important Emotional Rule

Do not overdo the writing.

The website should have **short sentences with space between them**.

Bad:

> You are beautiful and amazing and wonderful and you make my life better every single day and I don't know what I would do without you...

Good:

> You brought color into places I didn't know were dull.

Pause.

> Your eyes caught mine.

Pause.

> Your soul made a place in my heart.

The animation and visual environment should carry part of the emotion.

---

# 26. Do Not Add

Do NOT add:

* generic birthday templates
* balloons
* birthday cakes
* confetti
* cheesy heart animations everywhere
* excessive emojis
* countdown timers
* login
* registration
* comments
* social sharing
* contact forms
* unnecessary navigation
* games
* quizzes
* achievements
* fake loading screens
* external APIs
* Spotify API
* YouTube embeds

This is a private personal experience.

Keep it focused.

---

# 27. Development Process

Build the website in phases.

### Phase 1

Build the complete page structure and typography using placeholder content/assets.

### Phase 2

Implement scroll-driven scene transitions.

### Phase 3

Implement visual effects.

### Phase 4

Implement Three.js:

* particles
* ocean
* stars

### Phase 5

Implement music player.

### Phase 6

Responsive/mobile refinement.

### Phase 7

Performance optimization.

### Phase 8

Final emotional polish.

Do not stop after creating a technically functional page.

The final pass should focus heavily on:

**Does this feel alive?**

**Does the transition from dullness to color feel emotional?**

**Does the ocean scene actually feel like being drawn into something?**

**Does the final birthday scene feel earned?**

---

# 28. Final Acceptance Criteria

The website is successful if:

1. The first screen feels quiet and intriguing.
2. The transition from dull → colorful is beautiful.
3. The photos feel like memories rather than gallery items.
4. The ocean scene genuinely feels immersive.
5. The quote feels like part of the story rather than pasted text.
6. The music enhances the experience rather than distracting from it.
7. The website feels alive even when the user isn't interacting.
8. The wishes for her feel sincere.
9. The personal wish about keeping her close feels vulnerable, not possessive.
10. The final birthday message feels like the emotional conclusion of everything before it.
11. The website works beautifully on mobile.
12. There are no unnecessary game-like mechanics.
13. The experience feels custom-made rather than template-based.

---

# 29. Start Now

Do not ask for real photos or real songs.

Use dummy assets.

Do not implement Supabase yet.

First build the complete experience with local data.

Once the entire experience is visually polished, stop and provide:

1. a summary of what was built
2. the project structure
3. where real photos should be placed
4. where real songs should be placed
5. what needs to change later for Supabase integration
6. any assets/content still required

Focus first on making the experience **beautiful, alive, emotional and technically clean**.
