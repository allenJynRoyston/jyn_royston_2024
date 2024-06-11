/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: [
    {
      pattern: /text-(blue|green|red|purple|neutral|slate|orange)-(50|100|200|300|400|500|600|700)/,
    },    
  ],  
  theme: {
    extend: {
      colors:{
        'soundcloud': '#f5f5f5',
      },      
      transitionProperty: {
        'flex': 'flex',
        'opacity': 'opacity',
      },
      transitionDuration: {
        '500': '500ms',
      },
      transitionTimingFunction: {
        'ease': 'ease',
      },
    },
  },
  plugins: [],
}

