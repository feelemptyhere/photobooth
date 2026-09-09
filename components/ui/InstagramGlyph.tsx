/**
 * <InstagramGlyph /> — an original camera-shaped glyph (rounded square + lens +
 * viewfinder dot), used on the gradient Share button. This is NOT the Instagram
 * trademark or wordmark — it's a generic camera icon to avoid trademark issues
 * (docs/04 Screen 08, AGENTS rule 8). Uses currentColor so it inherits the
 * button text color.
 */
export function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}
