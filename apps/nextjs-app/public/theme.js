(function initTheme() {
  const savedTheme = localStorage.getItem('UI-THEME') || 'system';
  const isDark =
    savedTheme === 'dark' || (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.add(isDark ? 'dark' : 'light');
  console.log('theme registered', isDark);
})();
