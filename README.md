# LEXORA

> **Understand the fine print. Keep the human in control.**

LEXORA is an AI-powered legal document intelligence workspace that transforms difficult legal documents into understandable, navigable, evidence-backed information. Built for individuals, freelancers, and small businesses who need to understand what they are signing without replacing professional legal advice.

![LEXORA Workspace Demo Preview](https://via.placeholder.com/1200x630/141618/1a9bcc?text=LEXORA+Legal+Intelligence+Workspace)

## Features

- **Legal Clarity Map**: A multi-dimensional dashboard summarizing risks, obligations, deadlines, and monetary terms.
- **Clause Explorer**: Browse identified clauses by category, risk level, and plain-language translations.
- **Attention Radar**: Visual breakdown of risk dimensions — financial exposure, termination constraints, IP, and more.
- **Grounded Q&A**: Ask questions about your document and get answers that explicitly cite the source section.
- **Document Comparison**: Compare two versions of a document to instantly see what changed, what it means, and why it matters.
- **Action Center**: Automatically generated checklist of things to do before signing, and questions to ask counsel.
- **Lawyer Brief Export**: One-click export of a structured summary ready for a professional consultation.
- **Privacy First**: Files are parsed locally/server-side and are not permanently stored.

## Architecture

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4, Framer Motion
- **Document Processing**: `pdf-parse`, `mammoth` (DOCX), Markdown/Text parsing
- **AI Integration**: Google Gemini 2.0 Flash via `@google/generative-ai`
- **Validation**: Zod (for strict JSON schema enforcement)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- (Optional) Google Gemini API Key for live AI analysis. The app works fully in **Demo Mode** without an API key using pre-computed analysis data.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd lexora
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
   *(Note: `--legacy-peer-deps` is used to resolve React 19 rc conflicts with some PDF/document parser libraries)*

3. Set up environment variables (optional for demo):
   ```bash
   cp .env.example .env.local
   ```
   Add your `GEMINI_API_KEY` to `.env.local` if you want to test with real documents.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Using the Demo

LEXORA includes a fully functional offline demo mode that requires no API keys.
Simply click **"Try the demo"** on the landing page, or click on any of the sample documents (Freelance Agreement, Residential Lease, Employment Offer) to explore the workspace, clause highlighting, and grounded Q&A.

## Design Philosophy

LEXORA is designed with an **Editorial + Enterprise Intelligence** aesthetic. It uses a sophisticated dark mode palette, typography emphasizing readability, and restrained micro-animations to create a premium, trustworthy experience.

Crucially, LEXORA embraces **Responsible AI**:
- **Evidence-backed**: Every claim cites its source in the document.
- **Explicit uncertainty**: If an answer isn't in the document, LEXORA says so instead of hallucinating.
- **Human-in-the-loop**: Features like the "Lawyer Brief" and "Questions for Counsel" reinforce that the AI is an assistant, not a replacement for a legal professional.

## License

MIT
