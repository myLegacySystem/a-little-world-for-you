/**
 * Every word she sees lives here — and only here.
 *
 * Change a value and the website changes; no other file needs editing.
 *
 * Two small formatting conventions, both optional:
 *   \n        a designed line break   ("There is\nsomething about\nyour eyes.")
 *   *words*   set in italics           ("It's your *soul.*")
 *
 * A trailing 🩷 is drawn as a small soft pink heart so it looks the same on
 * every phone. (At the very end, that heart also appears beside the title.)
 */
export const TEXT = {
  // ── Page ────────────────────────────────────────────────────────────────
  PAGE_TITLE: 'A little world, made for you',
  /** Shown only if JavaScript is switched off. */
  NO_JAVASCRIPT: 'This little world needs JavaScript to come alive.',

  // ── Threshold (before the experience begins) ─────────────────────────────
  INTRO_TITLE: 'A little world,\nmade for *you.*',
  INTRO_SUBTITLE: "Put your headphones on if you'd like.",
  INTRO_BUTTON: 'Enter',
  SCROLL_HINT: 'scroll, slowly',

  // ── Opening: the quiet, colorless world ──────────────────────────────────
  OPENING_01: 'There was a time when everything\nfelt a little *quiet.*',
  OPENING_02: 'Not necessarily sad.',
  OPENING_03: 'Just… *colorless.*',
  OPENING_04: 'And then you came\ninto my life.',

  // ── Color arrives ───────────────────────────────────────────────────────
  COLOR_01: "You probably don't realize\nwhat you changed.",
  COLOR_02: "You brought *color*\ninto places I didn't know\nwere dull.",

  // ── Memories (the first photographs) ─────────────────────────────────────
  MEMORIES_01: 'Some moments\nstay with me.',
  MEMORIES_CAPTION_01: 'i.',
  MEMORIES_CAPTION_02: 'ii.',

  // ── Her eyes → the sea ──────────────────────────────────────────────────
  EYES_01: 'There is\nsomething about\n*your eyes.*',
  EYES_02: 'Whenever you\nlook into mine…',
  EYES_03: "I forget where\nI'm supposed to look.",
  EYES_04: "It's like being pulled\ninto the *sea.*",

  // ── Falling deeper ──────────────────────────────────────────────────────
  FALL_01: "You don't fight it.",
  FALL_02: 'You just let\nyourself *fall.*',

  // ── A quiet literary moment ─────────────────────────────────────────────
  QUOTE_01: 'She was beautiful, but not like those girls in magazines.',
  QUOTE_02: 'She was beautiful, for the way she thought.',
  QUOTE_03: 'She was beautiful, for the sparkle in her eyes when she talked about something she loved.',
  QUOTE_04: 'She was beautiful, for her ability to make other people smile, even if she was sad.',
  QUOTE_05: "No, she wasn't beautiful for something as temporary as her looks.",
  QUOTE_06: 'She was beautiful, deep down to her soul.',
  QUOTE_07: 'She is beautiful.',
  QUOTE_AUTHOR: 'Natalie Newman',
  QUOTE_SOURCE: 'Butterflies and Bullshit',
  QUOTE_YEAR: '2011',

  QUOTE_AFTER_01: 'And when I read this,\nI thought of you.',
  QUOTE_AFTER_02: "Not because you're beautiful.",
  QUOTE_AFTER_03: "But because you're beautiful\nin all the ways that\nactually matter to me.",
  QUOTE_AFTER_04: 'Your eyes caught mine.',
  QUOTE_AFTER_05: 'But your soul is what made\na place in my *heart.*',

  // ── Stars, dreams ───────────────────────────────────────────────────────
  DREAMS_01: 'And because today\nis about you…',
  DREAMS_02: 'There are a few things\nI want for you.',
  WISH_01: 'I hope you chase\nevery dream you have.',
  WISH_02: 'I hope you *succeed.*',
  WISH_03: 'I hope life is\nkind to you.',

  // ── Her soul (warm light, petals) ───────────────────────────────────────
  SOUL_01: "It's not just how you look.",
  SOUL_02: "It's the way *you are.*",
  SOUL_03: 'The way you make things feel lighter.',
  SOUL_04: "The little things you probably\ndon't even notice about yourself.",
  SOUL_05: 'The way your presence can change\nan ordinary moment.',
  SOUL_06: "You're beautiful.",
  SOUL_07: "But somehow, that's not even the thing\nI find most beautiful about you.",
  SOUL_08: "It's your *soul.*",

  // ── The personal wish ───────────────────────────────────────────────────
  PERSONAL_01: "And then there's one thing\nI selfishly wish for myself.",
  PERSONAL_02: 'I hope life keeps you\nclose to me.',
  PERSONAL_03: 'For as long as it allows.',
  PERSONAL_04: 'I hope there are many more birthdays\nwhere I get to be somewhere close to you.',
  PERSONAL_05: 'I hope you stay in my life.',
  PERSONAL_06: 'And somehow,\nsomewhere along the way…',
  PERSONAL_07: 'you stay close\nto my *heart* too.',

  // ── Birthday ────────────────────────────────────────────────────────────
  /** Small line above the title. Leave empty ('') to hide it. */
  BIRTHDAY_EYEBROW: '',
  BIRTHDAY_TITLE: 'Happy Birthday',
  /**
   * The names I call her. They take turns after the title, flipping from one
   * to the next ("Happy Birthday" stays). Add, remove or reorder freely; with
   * a single name it simply stays; with none, the title stands alone.
   */
  BIRTHDAY_NAMES: ['MadamJi', 'Purnpoli', 'Ukdicha Modak', 'Kaju Katli'],
  BIRTHDAY_INTRO_01: "Today isn't just another day.",
  BIRTHDAY_INTRO_02: "It's the day someone very special to me\ncame into this world.",
  BIRTHDAY_01: 'I hope this year is kind to you.',
  BIRTHDAY_02: 'I hope you grow.',
  BIRTHDAY_03: 'I hope you succeed.',
  BIRTHDAY_04: 'I hope you laugh a lot.',
  BIRTHDAY_05: 'I hope you discover beautiful things.',
  BIRTHDAY_06: 'And I hope I get to be around\nfor a lot of them.',
  FINAL: 'Thank you for bringing\ncolor into my world.',

  // ── Photo descriptions (read aloud by screen readers) ───────────────────
  PHOTO_01_ALT: 'A memory of her',
  PHOTO_02_ALT: 'Another memory of her',
  PHOTO_04_ALT: 'Her, in warm light',
  PHOTO_05_ALT: 'Her, on her birthday',

  // ── Music control ───────────────────────────────────────────────────────
  MUSIC_OPEN: 'Music',
  MUSIC_PLAY: 'Play music',
  MUSIC_PAUSE: 'Pause music',
  MUSIC_NEXT: 'Next song',
  MUSIC_PREVIOUS: 'Previous song',
  MUSIC_NOW_PLAYING: 'Now playing',

  // ── Story controls (the story plays by itself) ─────────────────────────
  /** Shown for a few seconds above the controls when the story begins. */
  STORY_HINT: 'it plays by itself',
  STORY_CONTROLS: 'Story',
  STORY_PLAY: 'Play the story',
  STORY_PAUSE: 'Pause the story',
  STORY_PREVIOUS: 'Previous line',
  STORY_NEXT: 'Next line',

  // ── Names of each part, for screen readers ──────────────────────────────
  LABEL_OPENING: 'Before',
  LABEL_COLOR: 'Color',
  LABEL_HEART: 'A heart',
  LABEL_MEMORIES: 'Memories',
  LABEL_EYES: 'Your eyes',
  LABEL_FALL: 'The sea',
  LABEL_QUOTE: 'A quote',
  LABEL_RESPONSE: 'What I thought',
  LABEL_DREAMS: 'Dreams',
  LABEL_SOUL: 'Your soul',
  LABEL_PERSONAL: 'One wish',
  LABEL_BIRTHDAY: 'Happy birthday',
} as const;

export type TextKey = keyof typeof TEXT;
