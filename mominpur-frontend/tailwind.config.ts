import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // এখানে ফন্ট ফ্যামিলি যোগ করা হলো
      fontFamily: {
        sans: ['SolaimanLipi', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;