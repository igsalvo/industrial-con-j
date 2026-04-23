export function ThemeScript() {
  const script = `
    try {
      const saved = localStorage.getItem('industrial-con-j-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
      }
    } catch (error) {
      console.warn('Theme bootstrap failed', error);
    }
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
