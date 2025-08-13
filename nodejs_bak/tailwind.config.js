module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  future: {
    // Tailwind v3 이상에서 fs 관련 문제 방지용
    hoverOnlyWhenSupported: true,
  }
}
