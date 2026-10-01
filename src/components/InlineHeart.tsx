/** The 🩷 at the end of a line, drawn as a small soft pink heart. */
export function InlineHeart() {
  return (
    <svg className="inline-heart" viewBox="0 0 32 30" aria-hidden>
      <defs>
        <linearGradient id="inline-heart-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFD6E2" />
          <stop offset="0.55" stopColor="#FFB6C9" />
          <stop offset="1" stopColor="#EFA9C0" />
        </linearGradient>
      </defs>
      <path
        fill="url(#inline-heart-fill)"
        d="M16 28.5C9.2 23.4 2 17.7 2 10.4 2 5.9 5.5 2.5 9.7 2.5c2.6 0 4.9 1.3 6.3 3.4 1.4-2.1 3.7-3.4 6.3-3.4 4.2 0 7.7 3.4 7.7 7.9 0 7.3-7.2 13-14 18.1z"
      />
    </svg>
  );
}
