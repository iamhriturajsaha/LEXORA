# Lexora ⚖️✨

Lexora is an ultra-premium, AI-powered legal document intelligence platform. Designed with a stunning "Cyber-Passion / Ethereal Dawn" aesthetic, Lexora transforms dense, complex legal contracts into interactive, easily digestible insights. 

It doesn't just read contracts; it analyzes risks, extracts deadlines, answers contextual questions, and even auto-redlines clauses in real-time.

![Lexora Platform](./public/window.svg) <!-- Replace with actual screenshot later -->

## 🚀 Key Features

* **🧠 Context-Aware Intelligence Panel**
  As you scroll through a contract, Lexora's intelligence panel intelligently tracks your viewport, automatically highlighting relevant clauses, risks, and plain-language translations in sync with your reading.
* **✍️ AI Auto-Redlining**
  Click on any clause to generate instant "Pro-Client" and "Market Standard" alternative drafts. Copy them to your clipboard with a single click to drop right into your negotiations.
* **📊 Market Standard Benchmarking**
  Stop guessing if a clause is fair. Lexora visually plots specific risks (like IP assignments or non-competes) on a benchmark gauge to show exactly how favorable or unfavorable they are compared to industry standards.
* **⏱️ Chronos Engine (Calendar Sync)**
  Lexora's timeline engine extracts every deadline, milestone, and recurring commitment from a document and plots them chronologically. Export them directly to an `.ics` file to sync with Google Calendar or Outlook.
* **💬 Ask the Document**
  Query the contract using natural language. Ask "Who owns the IP?" or "What happens if I terminate early?" and Lexora will find the exact clause and provide an AI-generated answer.
* **⚡ Premium Micro-Interactions**
  Built with Framer Motion, the platform features buttery-smooth transitions, magnetic buttons, custom cursors, and glassmorphic UI elements that make legal review actually feel *enjoyable*.

## 🛠️ Tech Stack

* **Framework**: [Next.js](https://nextjs.org/) 16 (App Router)
* **Library**: [React](https://react.dev/) 19
* **Language**: TypeScript
* **Styling**: Custom CSS / Tailwind CSS v4
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **State Management**: React Context / Redux pattern (`useApp`)

## 💻 Getting Started

This project is completely **Vercel-ready**. You can deploy it instantly or run it locally.

### Prerequisites
* Node.js 18+
* npm or pnpm

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/iamhriturajsaha/LEXORA.git
   cd LEXORA
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file in the root directory and add your AI provider API keys (if actively testing live AI routing):
   ```env
   OPENAI_API_KEY=your_api_key_here
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:8010](http://localhost:8010) with your browser to see the platform.

### Vercel Deployment

Lexora is pre-configured for seamless Vercel deployment.
1. Push your code to GitHub.
2. Log into [Vercel](https://vercel.com).
3. Click **Add New Project** and import the `LEXORA` repository.
4. Add your Environment Variables in the Vercel dashboard.
5. Hit **Deploy**. 

## 📂 Project Structure

```text
lexora/
├── public/                 # Static assets
├── sample_docs/            # Sample legal TXT files for the demo
├── src/
│   ├── app/                # Next.js App Router pages and API routes
│   ├── components/         # React components
│   │   ├── landing/        # Landing page components
│   │   ├── ui/             # Reusable UI elements (MagneticButton, CustomCursor)
│   │   └── workspace/      # Core application interface (Tabs, DocumentReader)
│   ├── data/               # Mock data for demonstration purposes
│   ├── lib/                # Utility functions, AI providers, and global Store
│   └── types/              # TypeScript definitions
└── ...config files
```

## 🎨 Design Philosophy

Lexora deviates from traditional, boring B2B SaaS aesthetics. It embraces a "Desert Mirage" and "Ethereal Dawn" palette:
- **Deep Backgrounds**: `#050505` ensuring high contrast.
- **Accent Colors**: Jade (`#10b981`), Amber (`#f59e0b`), and striking Ruby/Rose risk indicators.
- **Typography**: `Inter` and `Outfit` for a modern, highly legible reading experience.
- **Glassmorphism**: Heavy use of semi-transparent panels with background blurs to create depth and hierarchy.

## 📄 License

This project is licensed under the MIT License.
