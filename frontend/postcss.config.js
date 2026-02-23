import tailwindcss from '@tailwindcss/postcss'

export default {
  plugins: [
    tailwindcss({
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
    }),
  ],
}
