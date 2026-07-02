import type { Metadata } from "next"
import { PageHeader } from "@/components/layout/page-header"
import { PageFooter } from "@/components/layout/page-footer"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "KeyTester.io Terms of Service — acceptable use, disclaimers, and governing terms.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/terms" },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader />

      <main className="max-w-[900px] mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold font-mono mb-1">Terms of Service</h1>
        <p className="text-xs text-muted-foreground font-mono mb-8">Last updated: May 2025</p>

        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using KeyTester.io (&ldquo;the Site&rdquo;), you agree to be bound by
              these Terms of Service. If you do not agree, please do not use the Site.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">2. Description of Service</h2>
            <p>
              KeyTester.io provides a free, browser-based tool that allows users to test the
              functionality of their keyboard keys, including key detection, N-Key Rollover testing,
              and input latency measurement. The service is provided &ldquo;as is&rdquo; at no cost.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">3. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Attempt to reverse-engineer, scrape, or disrupt the service</li>
              <li>Use automated scripts to generate fake traffic or ad impressions</li>
              <li>Use the site for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any systems connected to the site</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Intellectual Property</h2>
            <p>
              All content, branding, and code on KeyTester.io is the property of KeyTester.io unless
              otherwise stated. You may not reproduce, distribute, or create derivative works without
              written permission.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">5. Disclaimer of Warranties</h2>
            <p>
              The Site is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without any warranties,
              express or implied. We do not warrant that the service will be error-free, uninterrupted,
              or suitable for any particular purpose. Keyboard testing results are indicative and
              should not be the sole basis for hardware repair or replacement decisions.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, KeyTester.io and its operators shall not be
              liable for any indirect, incidental, special, or consequential damages arising from
              your use of, or inability to use, the Site.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">7. Third-Party Advertising</h2>
            <p>
              The Site may display advertisements served by Google AdSense or other third-party
              networks. We are not responsible for the content of third-party advertisements. Clicking
              on advertisements is entirely at your own discretion.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">8. Modifications to Terms</h2>
            <p>
              We reserve the right to update these Terms at any time. Continued use of the Site after
              changes are posted constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">9. Governing Law</h2>
            <p>
              These Terms are governed by applicable law. Any disputes shall be resolved through
              good-faith negotiation before pursuing formal legal channels.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">10. Contact</h2>
            <p>
              For questions about these Terms, please contact us through the site.
            </p>
          </section>
        </div>

      </main>

      <PageFooter />
    </div>
  )
}
