export function AppFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-card border-t py-8 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground">&copy; {currentYear} OptiScan AI. All rights reserved.</p>
        <p className="text-xs text-muted-foreground mt-1">
          Effortless image-to-text conversion and AI-powered refinement, right in your browser.
        </p>
      </div>
    </footer>
  );
}
