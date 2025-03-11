/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        '4/3': '4 / 3',
      },
      fontFamily: {
        writing: ["WritingObjects"],
        headerh1: ["IBMMonoBoldItalic"],
        normal: ["IBMSansRegular"],
        headermedium: ["IBMSansMedium"],
        headermbold: ["IBMMonoBold"],
        headermsemibold: ["IBMMonoSemiBold"],
        headermregular: ["IBMMono"],
        headersanssemiitalic: ["IBMSansSemiBoldItaltic"],
        headersanslight: ["IBMSansLight"],
        ibm_mono_medium: ["IBMMonoMedium"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        '3xl': '1860px'
      },
      colors: {
        'toa': {
          'orange': '#FF5B1C',
          'yellow': '#FEA30C',
          'violet': '#AC05F1',
          'red': '#800020',
          'blue': '#84A6FF',
          'black': '#000000'
        },
        
      }
    },
  },
  plugins: [],
};
