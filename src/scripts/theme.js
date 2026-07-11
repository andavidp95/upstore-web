// /src/scripts/theme.js
// Tema light-only para UPStore
export const preventFOUC = `
(function() {
  const html = document.documentElement;
  html.classList.remove('dark', 'light');
})();
`;

if (typeof window !== 'undefined') {
  const html = document.documentElement;
  html.classList.remove('dark', 'light');
}
