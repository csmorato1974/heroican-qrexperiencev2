import heroicanLogo from "@/assets/heroican-logo.png.asset.json";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/70 border-b border-border/50">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <a href="/" aria-label="Heroican" className="flex items-center">
          <img
            src={heroicanLogo.url}
            alt="Heroican"
            className="h-10 w-auto select-none"
            loading="eager"
          />
        </a>
      </div>
    </header>
  );
}
