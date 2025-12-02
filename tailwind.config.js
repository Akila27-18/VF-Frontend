module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // enables toggling via a 'dark' class
  theme: {
    extend: {
      colors: {
        orangeAccent: '#FF6A00',
        warmGray: '#F7F7F7'
      },
      fontFamily: {
        poppins: ['Poppins', 'Inter', 'sans-serif']
      }
    }
  },
  plugins: [],
}
