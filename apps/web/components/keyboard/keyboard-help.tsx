import Link from "next/link"

const faqs = [
  [
    "How do I test my keyboard?",
    "Keep this page focused and press each physical key once. A blue key is being pressed; green means the browser received the key. Use Reset test to start again. You do not need to install an app or create an account.",
  ],
  [
    "Does it work with my language or keyboard?",
    "The tester reads physical key codes, while the diagram shows US QWERTY labels. On AZERTY, QWERTZ, and other language layouts, the printed letters may differ. Extra regional keys may not appear in this diagram. Use a physical keyboard; a phone’s on-screen keyboard may not send the same events.",
  ],
  [
    "Why does the Windows key open the Start menu?",
    "Windows, Command, and some function-key shortcuts are handled by your operating system or browser. This page cannot always prevent those actions or receive those keys. An unlit key alone does not prove that your keyboard is broken.",
  ],
  [
    "Can I check multiple keys at once?",
    "Hold a small combination, such as A, S, and D, and watch which keys light up together. Release and try another combination. Browser shortcuts can interfere, so this is a practical check of received key events, not a hardware certification.",
  ],
  [
    "What if a key does not light up?",
    "Click an empty area of the tester and try again. Check the connection, try another USB port, and test in a text editor or another browser. If the key fails in multiple apps, follow the troubleshooting guide below.",
  ],
]

export function KeyboardHelp() {
  return (
    <section
      aria-labelledby="keyboard-help"
      className="mx-auto mt-10 max-w-4xl"
    >
      <div className="mb-7">
        <p className="text-sm font-semibold text-teal-700 dark:text-teal-400">
          A quick check, before you replace it
        </p>
        <h2
          id="keyboard-help"
          className="mt-2 text-2xl font-semibold tracking-tight"
        >
          Make sense of your keyboard test
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Check letters, numbers, modifiers, arrow keys, and the number pad
          directly in your browser. The display shows the events your browser
          receives, helping you spot keys that need a closer look.
        </p>
      </div>
      <div className="divide-y divide-border border-y border-border">
        {faqs.map(([question, answer]) => (
          <details key={question} className="group py-5">
            <summary className="cursor-pointer text-base font-medium focus-visible:outline-2 focus-visible:outline-offset-4">
              {question}
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
              {answer}
            </p>
          </details>
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          [
            "/blog/keyboard-not-working",
            "A key is not working",
            "Follow a step-by-step troubleshooting guide.",
          ],
          [
            "/blog/keyboard-ghosting-explained",
            "Missing key combinations",
            "Understand ghosting and blocked key presses.",
          ],
          [
            "/blog/what-is-nkro",
            "Understand key rollover",
            "Learn what simultaneous key detection means.",
          ],
        ].map(([href, title, description]) => (
          <Link
            key={href}
            href={href!}
            className="rounded-xl border border-border p-5 transition-colors hover:bg-muted"
          >
            <h3 className="font-semibold">
              {title} <span aria-hidden="true">→</span>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
