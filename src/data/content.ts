/**
 * All of the words (and which photograph goes where) live here.
 *
 * Edit freely — none of the animation code depends on the exact wording.
 * Keep sentences short: the visuals carry the rest.
 *
 * Photos are referenced by key (see `photos` below). Swap the files in
 * /public/assets/images/ or change `file` to point elsewhere.
 */

export interface PhotoRef {
  /** File name inside the photo storage folder (local now, Supabase later). */
  file: string;
  /** Short, private description — used as alt text. */
  alt: string;
}

export const person = {
  name: '[Name]',
  /** Shown softly above the birthday title. Free-form text. */
  birthday: 'October 2',
};

export const photos = {
  /** Appears inside the first light — the moment colour arrives. */
  arrival: { file: 'photo-01.jpg', alt: 'Her, in the first light' },
  /** Dissolved into the deep water of the eyes scene. Ideally a close, soft portrait. */
  eyes: { file: 'photo-02.jpg', alt: 'Her eyes' },
  /** Warm, candid, sunlit — the soul scene. */
  soul: { file: 'photo-03.jpg', alt: 'Her, laughing in warm light' },
  /** Shown when "I thought of you." */
  thought: { file: 'photo-04.jpg', alt: 'Her, lost in thought' },
  /** The final photograph that stays with the birthday message. */
  finale: { file: 'photo-05.jpg', alt: 'Her, on her birthday' },
} satisfies Record<string, PhotoRef>;

export const content = {
  intro: {
    quiet: [
      'There was a time when everything felt a little… quiet.',
      'Not necessarily sad.',
      'Just… colorless.',
    ],
    arrival: 'And then you came into my life.',
  },

  color: {
    first: "You probably don't realize what you changed.",
    second: "You brought color into places I didn't know were dull.",
  },

  ocean: {
    lines: [
      'There is something about your eyes.',
      'Whenever you look into mine…',
      "I forget where I'm supposed to look.",
      "It's like being pulled into the sea.",
    ],
    fall: ["You don't fight it.", 'You just let yourself fall.'],
  },

  quote: {
    /** Each inner array is revealed together; lines appear one at a time. */
    stanzas: [
      ['She was beautiful, but not like those girls in magazines.', 'She was beautiful, for the way she thought.'],
      ['She was beautiful, for the sparkle in her eyes when she talked about something she loved.'],
      ['She was beautiful, for her ability to make other people smile, even if she was sad.'],
      [
        "No, she wasn't beautiful for something as temporary as her looks.",
        'She was beautiful, deep down to her soul.',
      ],
      ['She is beautiful.'],
    ],
    /** Which stanza gets the "stars reflected on water" shimmer (0-based). */
    sparkleStanza: 1,
    author: 'Natalie Newman',
    source: 'Butterflies and Bullshit',
    year: '2011',
    afterword: {
      thought: 'And when I read this, I thought of you.',
      notBecause: ["Not because you're beautiful.", "But because you're beautiful in all the ways that actually matter to me."],
      eyesSoul: ['Your eyes caught mine.', 'But your soul is what made a place in my heart.'],
    },
  },

  soul: {
    opening: ["It's not just how you look.", "It's the way you are."],
    thoughts: [
      'The way you make things feel lighter.',
      "The little things you probably don't even notice about yourself.",
      'The way your presence can change an ordinary moment.',
    ],
    beautiful: ["You're beautiful.", "But somehow, that's not even the thing I find most beautiful about you."],
    soul: "It's your soul.",
  },

  wishes: {
    opening: ['And because today is about you…', 'There are a few things I want for you.'],
    /** Each wish lights one star. Keep them short. */
    list: [
      { title: 'Your dreams', text: "I hope you achieve everything you've been quietly working toward." },
      { title: 'Your happiness', text: 'I hope you always have reasons to smile.' },
      { title: 'Your success', text: 'I want to see you go further than you ever imagined.' },
      { title: 'Your courage', text: 'I hope you never become smaller just because the world asks you to.' },
      { title: 'Your life', text: 'I hope it becomes everything you want it to be.' },
    ],
  },

  personal: {
    opening: "And then there's one thing I selfishly wish for myself.",
    close: ['I hope life keeps you close to me.', 'For as long as it allows.'],
    birthdays: 'I hope there are many more birthdays where I get to be somewhere close to you.',
    stay: 'I hope you stay in my life.',
    heart: ['And somehow, somewhere along the way…', 'you stay close to my heart too.'],
  },

  finale: {
    /** `{name}` is replaced with person.name. */
    title: 'Happy Birthday, {name}',
    notJustADay: ["Today isn't just another day.", "It's the day someone very special to me came into this world."],
    hopes: [
      'I hope this year is kind to you.',
      'I hope you grow.',
      'I hope you succeed.',
      'I hope you laugh a lot.',
      'I hope you discover beautiful things.',
      'And I hope I get to be around for a lot of them.',
    ],
    thanks: 'Thank you for bringing color into my world.',
    /** A trailing ❤️ is rendered as a soft glowing heart rather than an emoji. */
    last: 'Happy Birthday. ❤️',
  },

  ui: {
    scrollHint: 'scroll slowly',
    soundHint: 'tap anywhere for music',
  },
};

export type Content = typeof content;
