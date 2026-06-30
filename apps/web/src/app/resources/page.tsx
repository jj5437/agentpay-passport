import { ProductFrame } from "../components/ProductFrame";

const resources = [
  ["Judge walkthrough", "A three-minute story: invoice, agent reasoning, policy gate, escrow evidence."],
  ["Architecture map", "Frontend, API, database, email codes, policy engine, and future contracts."],
  ["Submission evidence", "Routes, test output, health endpoint, and adapter-mode notes."]
];

export default function ResourcesPage() {
  return (
    <ProductFrame>
      <section className="content-hero compact">
        <p className="eyebrow">Review package</p>
        <h1>Resources</h1>
        <p>Materials that make the project easy to evaluate and easy to extend after the hackathon.</p>
      </section>
      <section className="resource-grid">
        {resources.map(([title, body]) => (
          <article key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
            <a href="/docs">Open docs</a>
          </article>
        ))}
      </section>
    </ProductFrame>
  );
}
