type AuthShellProps = {
  title: string;
  summary: string;
  footerLink: {
    href: string;
    label: string;
  };
  children: React.ReactNode;
};

export function AuthShell({ title, summary, footerLink, children }: AuthShellProps) {
  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <a className="brand" href="/">
          <span className="mark" aria-hidden="true" />
          AgentPay Passport
        </a>
        <div>
          <p className="eyebrow">Email access</p>
          <h1>{title}</h1>
          <p>{summary}</p>
        </div>
        {children}
        <a className="auth-footer-link" href={footerLink.href}>
          {footerLink.label}
        </a>
      </section>
    </main>
  );
}
