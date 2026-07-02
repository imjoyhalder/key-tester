import type { Metadata } from "next"
import { PageHeader } from "@/components/layout/page-header"
import { PageFooter } from "@/components/layout/page-footer"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "KeyTester.io Privacy Policy — how we handle your data.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/privacy" },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader />

      <main className="max-w-[900px] mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold font-mono mb-1">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground font-mono mb-8">Last updated: May 2025</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">1. Overview</h2>
            <p>
              KeyTester.io (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Site&rdquo;) is a free online keyboard
              diagnostic tool. We are committed to protecting your privacy. This policy explains what
              information is collected, how it is used, and your rights.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">2. Information We Collect</h2>
            <h3 className="text-sm font-semibold text-foreground mb-1">2a. Keyboard Test Data</h3>
            <p>
              When you use the keyboard tester, your keystrokes are processed <strong>entirely in
              your browser</strong>. Individual key codes are temporarily held in browser memory during
              testing and are never transmitted to our servers. No keylogger functionality exists.
            </p>
            <h3 className="text-sm font-semibold text-foreground mt-3 mb-1">2b. Anonymous Session Analytics</h3>
            <p>
              We may collect anonymised, non-personally identifiable session data (e.g., browser
              type, country, number of keys tested) to understand how the tool is used and to improve
              it. This data cannot be used to identify you.
            </p>
            <h3 className="text-sm font-semibold text-foreground mt-3 mb-1">2c. Cookies</h3>
            <p>
              We use essential cookies to maintain your session preferences (e.g., dark/light theme).
              If Google AdSense is enabled, Google may set third-party advertising cookies. See
              Section 5 for details.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">3. How We Use Information</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>To operate and improve the keyboard testing tool</li>
              <li>To display aggregate usage statistics (no personal data)</li>
              <li>To serve relevant advertisements (if ads are enabled)</li>
              <li>To prevent abuse and maintain service security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Data Sharing</h2>
            <p>
              We do not sell, rent, or trade your personal information to any third parties.
              Anonymised, aggregated analytics data may be reviewed internally to improve the site.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">5. Google AdSense &amp; Third-Party Advertising</h2>
            <p>
              KeyTester.io may display advertisements served by Google AdSense. Google, as a
              third-party vendor, uses cookies (including the DoubleClick cookie) to serve ads based
              on your prior visits to this website and other sites on the internet.
            </p>
            <p className="mt-2">
              You may opt out of personalised advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-500 underline"
              >
                Google Ads Settings
              </a>{" "}
              or by visiting{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-500 underline"
              >
                www.aboutads.info
              </a>
              .
            </p>
            <p className="mt-2">
              Google&apos;s use of advertising cookies is governed by{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-500 underline"
              >
                Google&apos;s Advertising Policies
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">6. Children&apos;s Privacy (COPPA)</h2>
            <p>
              KeyTester.io is not directed at children under the age of 13. We do not knowingly
              collect personal information from children. If you believe a child has submitted
              personal information through this site, please contact us so we can delete it.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">7. Data Security</h2>
            <p>
              We implement industry-standard security measures. Since individual keystroke data never
              leaves your browser, the risk of keystroke data interception is zero for the testing
              functionality.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">8. Your Rights (GDPR)</h2>
            <p>
              If you are a resident of the European Economic Area (EEA), you have the right to
              access, correct, or delete any personal data we hold about you. Because we collect
              only anonymised data, there is typically no personal data to act upon. For questions,
              contact us at the address below.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this
              page with an updated &ldquo;Last updated&rdquo; date. Continued use of the site after
              changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">10. Contact</h2>
            <p>
              For privacy-related questions, please open an issue or contact us through the site.
            </p>
          </section>
        </div>

      </main>

      <PageFooter />
    </div>
  )
}
