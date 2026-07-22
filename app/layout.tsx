import type { Metadata } from "next";
import { headers } from "next/headers";
import {
  chatGPTSignInPath,
  chatGPTSignOutPath,
  getChatGPTUser,
} from "./chatgpt-auth";
import AmbientPlayer from "./components/AmbientPlayer";
import CustomCursor from "./components/CustomCursor";
import "./globals.css";
import "./experiences.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "orbital-26-lab.vdavidenko2006.chatgpt.site";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    title: "ORBITAL/26 — Digital Gravity",
    description: "Independent creative lab shaping digital worlds with gravity.",
    metadataBase: new URL(origin),
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "ORBITAL/26 — Digital Gravity",
      description: "Independent creative lab shaping digital worlds with gravity.",
      images: [{ url: "/og.png", width: 1536, height: 1024, alt: "ORBITAL/26 — Digital Gravity" }],
    },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
  };
}

function AccessPortal() {
  const signInPath = chatGPTSignInPath("/");

  return (
    <main className="access-portal">
      <div className="access-grain" aria-hidden="true" />
      <header className="access-header">
        <div className="access-brand"><span>O/</span> ORBITAL SYSTEMS</div>
        <div className="access-status"><i /> SECURE SIGNAL</div>
      </header>

      <div className="access-orb" aria-hidden="true">
        <div className="access-orb-core" />
      </div>

      <section className="access-card">
        <div className="access-index">( ACCESS / 001 )</div>
        <p className="access-kicker">ENTER THE DIGITAL ORBIT</p>
        <h1>YOUR<br /><em>SIGNAL</em><br />IS WELCOME</h1>
        <p className="access-copy">
          Sign in or create an account with your email. Authentication is handled
          securely by OpenAI — your password is never shared with this site.
        </p>
        <a className="access-primary" href={signInPath}>
          <span>CONTINUE WITH EMAIL</span><b>↗</b>
        </a>
        <div className="access-footnote">
          <span>NEW HERE? CREATE YOUR ACCOUNT ON THE NEXT STEP</span>
          <span>ENCRYPTED / 2026</span>
        </div>
      </section>
    </main>
  );
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getChatGPTUser();
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "";
  const isLocalPreview = /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(host);

  if (!user && !isLocalPreview) {
    return <html lang="en"><body><AccessPortal /><CustomCursor /></body></html>;
  }

  return (
    <html lang="en">
      <body>
        {user && (
          <div className="auth-account">
            <span className="auth-dot" />
            <span className="auth-email">{user.email}</span>
            <a href={chatGPTSignOutPath("/")}>SIGN OUT</a>
          </div>
        )}
        {children}
        <AmbientPlayer />
        <CustomCursor />
      </body>
    </html>
  );
}
