type LegalPageProps = {
  title: string;
  version: string;
  children: React.ReactNode;
};

export function LegalPage({ title, version, children }: LegalPageProps) {
  return (
    <main className="legal-shell">
      <header className="topbar legal-topbar">
        <a className="brand" href="/">
          <span className="mark" aria-hidden="true" />
          AgentPay Passport
        </a>
        <nav aria-label="Legal navigation">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/legal/disclaimer">Disclaimer</a>
        </nav>
      </header>
      <article className="legal-document">
        <p className="eyebrow">Version {version}</p>
        <h1>{title}</h1>
        <div className="legal-copy">{children}</div>
      </article>
    </main>
  );
}
