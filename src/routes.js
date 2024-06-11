export const routes = Object.keys(import.meta.glob('/src/routes/**/*.{svelte,js,ts}'))
  .map((route) => {
    // Remove the /src/routes prefix and the file extension
    return route.replace('/src/routes', '').replace(/\.[^/.]+$/, '');
  });