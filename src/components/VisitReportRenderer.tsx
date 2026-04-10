"use client";

import Markdown from "react-markdown";
import {
  Sparkles,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

/**
 * Rendu stylisé d'un compte-rendu de visite formaté par Gemini.
 *
 * Détecte les headings Markdown `## En bref`, `## Éléments clés`, etc.
 * et applique une icône + couleur spécifiques à chaque section.
 * Les autres headings sont rendus normalement.
 */

type SectionStyle = {
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  borderColor: string;
};

const SECTION_STYLES: Record<string, SectionStyle> = {
  "en bref": {
    icon: Sparkles,
    iconColor: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
  },
  "éléments clés": {
    icon: BarChart3,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  "ce qui a plu": {
    icon: CheckCircle2,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  "points d'attention soulevés": {
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  "points d'attention": {
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  "prochaines étapes": {
    icon: ArrowRight,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
};

function getSectionStyle(heading: string): SectionStyle | null {
  const key = heading.toLowerCase().trim();
  for (const [pattern, style] of Object.entries(SECTION_STYLES)) {
    if (key.includes(pattern)) return style;
  }
  return null;
}

/**
 * Extrait le "Niveau d'intérêt" du markdown s'il existe dans la section
 * "Éléments clés" (ex: "- **Niveau d'intérêt ressenti** : Fort").
 */
function extractInterestLevel(
  markdown: string,
): "fort" | "modéré" | "faible" | null {
  const match = markdown.match(
    /niveau\s+d['']intérêt[^:]*:\s*(fort|modéré|faible)/i,
  );
  if (!match) return null;
  return match[1].toLowerCase() as "fort" | "modéré" | "faible";
}

const INTEREST_BADGE: Record<
  string,
  { label: string; className: string }
> = {
  fort: {
    label: "Intérêt fort",
    className: "bg-green-100 text-green-700 border-green-300",
  },
  modéré: {
    label: "Intérêt modéré",
    className: "bg-amber-100 text-amber-700 border-amber-300",
  },
  faible: {
    label: "Intérêt faible",
    className: "bg-red-100 text-red-700 border-red-300",
  },
};

export function VisitReportRenderer({ markdown }: { markdown: string }) {
  const interest = extractInterestLevel(markdown);

  // Split le markdown par sections ## pour pouvoir wrapper chaque section
  // dans une card stylisée. On traite "## X\ncontent" comme des blocs.
  const sections = splitBySections(markdown);

  return (
    <div className="space-y-4">
      {/* Badge d'intérêt */}
      {interest && (
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${INTEREST_BADGE[interest].className}`}
          >
            {INTEREST_BADGE[interest].label}
          </span>
        </div>
      )}

      {/* Sections */}
      {sections.map((section, i) => {
        if (section.heading) {
          const style = getSectionStyle(section.heading);
          if (style) {
            const Icon = style.icon;
            return (
              <div
                key={i}
                className={`rounded-xl border p-4 ${style.bgColor} ${style.borderColor}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${style.iconColor}`} />
                  <h3
                    className={`text-sm font-bold ${style.iconColor.replace("text-", "text-")}`}
                  >
                    {section.heading}
                  </h3>
                </div>
                <div className="text-sm text-slate-700 leading-relaxed prose-sm">
                  <Markdown
                    components={{
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-4 space-y-1 mb-2">
                          {children}
                        </ul>
                      ),
                      li: ({ children }) => (
                        <li className="text-sm text-slate-700">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-[#1C1F25]">
                          {children}
                        </strong>
                      ),
                    }}
                  >
                    {section.content}
                  </Markdown>
                </div>
              </div>
            );
          }
        }

        // Contenu sans heading reconnu ou pré-heading
        if (section.content.trim()) {
          return (
            <div key={i} className="text-sm text-slate-700 leading-relaxed">
              <Markdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-base font-bold text-[#1C1F25] mb-2 mt-4">
                      {children}
                    </h2>
                  ),
                  p: ({ children }) => (
                    <p className="mb-2 last:mb-0">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-4 space-y-1 mb-2">
                      {children}
                    </ul>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-[#1C1F25]">
                      {children}
                    </strong>
                  ),
                }}
              >
                {section.heading ? `## ${section.heading}\n\n${section.content}` : section.content}
              </Markdown>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

// ============================================================================
// Helpers
// ============================================================================

type Section = {
  heading: string | null;
  content: string;
};

/**
 * Découpe un markdown en blocs par `## heading`.
 * Le texte avant le premier `##` est retourné comme premier bloc sans heading.
 */
function splitBySections(md: string): Section[] {
  const lines = md.split("\n");
  const sections: Section[] = [];
  let currentHeading: string | null = null;
  let currentLines: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      // Flush previous section
      if (currentLines.length > 0 || currentHeading !== null) {
        sections.push({
          heading: currentHeading,
          content: currentLines.join("\n").trim(),
        });
      }
      currentHeading = headingMatch[1].trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  // Flush last section
  if (currentLines.length > 0 || currentHeading !== null) {
    sections.push({
      heading: currentHeading,
      content: currentLines.join("\n").trim(),
    });
  }

  return sections;
}
