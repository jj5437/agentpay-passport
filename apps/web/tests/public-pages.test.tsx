import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "../src/app/page";
import AppPage from "../src/app/app/page";
import DocsPage from "../src/app/docs/page";
import FAQPage from "../src/app/faq/page";
import DisclaimerPage from "../src/app/legal/disclaimer/page";
import LoginPage from "../src/app/login/page";
import PlatformPage from "../src/app/platform/page";
import PrivacyPage from "../src/app/privacy/page";
import RegisterPage from "../src/app/register/page";
import ResourcesPage from "../src/app/resources/page";
import TermsPage from "../src/app/terms/page";

describe("public pages", () => {
  it("renders the website homepage with the confirmed product positioning", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "Regulated Command Center" })).toBeInTheDocument();
    expect(screen.getByText(/policy, KYC, escrow, and receipts/i)).toBeInTheDocument();
    expect(screen.getByText("Payment Control")).toBeInTheDocument();
    expect(screen.getAllByText("Vendor KYC").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Escrow").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Evidence").length).toBeGreaterThan(0);
    expect(screen.getByText("Agent Reasoning")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Create account" })).toHaveAttribute("href", "/register");
    expect(screen.getByRole("link", { name: "Open live demo" })).toHaveAttribute("href", "/app");
    expect(screen.getAllByText(/PaymentEvidenceRegistry/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/0xfaa5...66ce/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Docs" })[0]).toHaveAttribute("href", "/docs");
    expect(screen.getAllByRole("link", { name: "FAQ" })[0]).toHaveAttribute("href", "/faq");
  });

  it("renders legal pages required before registration opens", () => {
    render(<TermsPage />);
    expect(screen.getByRole("heading", { name: "Terms of Service" })).toBeInTheDocument();

    render(<PrivacyPage />);
    expect(screen.getByRole("heading", { name: "Privacy Policy" })).toBeInTheDocument();

    render(<DisclaimerPage />);
    expect(screen.getByRole("heading", { name: "Prototype Disclaimer" })).toBeInTheDocument();
  });

  it("renders authentication entry pages without enabling real auth yet", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("heading", { name: "Create your account" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
    expect(screen.getByText(/verification code/i)).toBeInTheDocument();

    cleanup();
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
  });

  it("renders docs, FAQ, platform, resources, and product workspace pages", () => {
    render(<DocsPage />);
    expect(screen.getByRole("heading", { name: "Documentation" })).toBeInTheDocument();
    expect(screen.getAllByText(/Payment Intent Card/i).length).toBeGreaterThan(0);

    cleanup();
    render(<FAQPage />);
    expect(screen.getByRole("heading", { name: "FAQ" })).toBeInTheDocument();
    expect(screen.getByText(/Is this a marketplace/i)).toBeInTheDocument();
    expect(screen.getByText(/0xfaa5505f61a61cbb4f11463d6eeb4f3393ac66ce/i)).toBeInTheDocument();

    cleanup();
    render(<PlatformPage />);
    expect(screen.getByRole("heading", { name: "Platform" })).toBeInTheDocument();
    expect(screen.getByText(/Policy Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/0xfaa5...66ce/i)).toBeInTheDocument();

    cleanup();
    render(<ResourcesPage />);
    expect(screen.getByRole("heading", { name: "Resources" })).toBeInTheDocument();
    expect(screen.getByText(/Judge walkthrough/i)).toBeInTheDocument();

    cleanup();
    render(<AppPage />);
    expect(screen.getByRole("heading", { name: "Live Payment Evaluation" })).toBeInTheDocument();
    expect(screen.getAllByText(/Evidence Bundle/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /Payment Control/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Vendor KYC/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Evidence/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Evidence/i }));
    expect(screen.getByText(/View deployment on explorer/i)).toBeInTheDocument();
  });
});
