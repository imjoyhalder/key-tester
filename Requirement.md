This is a comprehensive **Full-Stack MVP Specification** designed specifically for Claude (or any advanced LLM). It focuses on high-performance event handling for the keyboard tester and a robust analytics dashboard for the administrator, all while being "AdSense Ready."

---

### **System Prompt for Claude**

> **Role:** Senior Full-Stack Developer (Next.js 15, TypeScript, Prisma, PostgreSQL).
> **Task:** Build a production-ready "Keyboard Tester" MVP with a public testing interface and a private Admin Dashboard.
> **Tech Stack:** > - **Frontend:** Next.js (App Router), Tailwind CSS v4, Lucide Icons.
> * **State Management:** Zustand (for zero-lag key event tracking).
> * **Backend:** Next.js Server Actions + Prisma ORM.
> * **Database:** PostgreSQL.
> * **Auth:** NextAuth.js (Role-based: Admin only).
> 
> 

---

### **Module 1: Public Keyboard Tester (Frontend)**

* **Zero-Lag Engine:** Implement a global event listener using `keydown` and `keyup`. Use `e.code` to map hardware keys to the virtual UI.
* **Visual States:**
* `Default`: Subtle border, dark gray bg.
* `Active (Pressed)`: Cyan glow (`#22d3ee`) with shadow.
* `Verified (Released)`: Green border/text to show the key works.
* `Ghosting/Error`: Amber highlight if simultaneous key limits are hit.


* **Analytics Overlay:** Real-time calculation of **Avg Latency** (ms) and **Max Rollover** (N-Key).
* **Sound Engine:** Integration of `use-sound` for different mechanical switch profiles (Blue, Red, Brown).

---

### **Module 2: Administrator Dashboard (Private)**

Build a protected route `/admin` with the following features:

* **Visitor Insights:** * Total Unique Visitors (Count).
* Top Browser/OS used by testers.
* Geographic distribution (simple country-level tracking).


* **Keyboard Health Stats:**
* "Most Failed Key" leaderboard (e.g., "The 'Space' key fails for 12% of users").
* Average hardware latency across all sessions.


* **Ad Management:** * A toggle switch to enable/disable **Google AdSense** script injection across the site.
* Fields to update "Affiliate Keyboard Links" dynamically on the homepage.



---

### **Module 3: Database & Backend (Data Model)**

**Prisma Schema Requirements:**

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed for Admin access
  role      String   @default("USER") // ADMIN or USER
}

model TestSession {
  id              String   @id @default(cuid())
  createdAt       DateTime @default(now())
  failedKeys      String[] // Array of key codes like ["KeyQ", "Space"]
  maxRollover     Int
  avgLatency      Float
  userAgent       String?  // Browser/OS info
}

model GlobalConfig {
  id            Int     @id @default(1)
  isAdsEnabled  Boolean @default(false)
  adClientCode  String? // For Google AdSense ID
}

```

---

### **Module 4: Production & AdSense Readiness**

* **SEO Optimization:** Implement `metadata` in `layout.tsx` for keywords: "Keyboard Tester," "Mechanical Keyboard Diagnostic," "Online NKRO Test."
* **AdSense Integration Logic:** * Create a `<GoogleAd>` component that conditionally renders based on the `GlobalConfig` status from the database.
* Reserve fixed-height slots (e.g., `min-h-[250px]`) for ads in the sidebar and footer to prevent Layout Shift (CLS), which is critical for Google ranking.


* **Performance:** Use Next.js **Dynamic Imports** for the keyboard sound files and the Latency Graph to ensure the initial page load is under 1 second.

---

### **Instructions for Execution:**

1. **Phase 1:** Build the core `Keyboard` component and Zustand store for real-time interaction.
2. **Phase 2:** Setup Prisma and PostgreSQL connection for session logging.
3. **Phase 3:** Create the Admin UI using `shadcn/ui` components for the charts and tables.
4. **Phase 4:** Finalize the "Ad-Ready" layout by placing the AdSense placeholders.

**Final Tip:** Claude, ensure the code is modular so I can easily update the Keyboard SVG layout from ANSI to ISO in the future.