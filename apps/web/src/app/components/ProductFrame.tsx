type ProductFrameProps = {
  children: React.ReactNode;
};

export function ProductFrame({ children }: ProductFrameProps) {
  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="mark" aria-hidden="true" />
          AgentPay Passport
        </a>
        <nav aria-label="Primary navigation">
          <a href="/platform">Platform</a>
          <a href="/docs">Docs</a>
          <a href="/resources">Resources</a>
          <a href="/faq">FAQ</a>
          <a className="nav-cta" href="/login">
            Login
          </a>
        </nav>
      </header>
      {children}
    </main>
  );
}
