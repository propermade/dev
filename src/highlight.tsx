import type { ReactNode } from "react";

// A small zero-dependency highlighter for the few languages /work shows. It renders spans in React (no raw HTML),
// so it works in the prerender. Each rule is tried in order at every position; text no rule matches stays plain.
type Rule = [cls: string, re: RegExp];

const KW_JS =
  "const|let|var|function|return|if|else|for|while|import|export|from|default|type|interface|new|await|async|true|false|null|undefined|as|of|in";

const rules: Record<string, Rule[]> = {
  sh: [
    ["c", /#.*/y],
    ["s", /"(?:\\.|[^"\\])*"|'[^']*'/y],
    ["f", /(?<![\w-])--?[A-Za-z][\w-]*/y],
    ["v", /\$\{?[\w@#?]+\}?|<[^>\n]+>/y],
    ["n", /\b\d[\d.]*\b/y],
  ],
  json: [
    ["p", /"(?:\\.|[^"\\])*"(?=\s*:)/y],
    ["s", /"(?:\\.|[^"\\])*"/y],
    ["n", /-?\b\d[\d.eE+-]*\b/y],
    ["k", /\b(?:true|false|null)\b/y],
  ],
  yaml: [
    ["c", /#.*/y],
    ["p", /[\w.-]+(?=:(?:\s|$))/y],
    ["s", /"(?:\\.|[^"\\])*"|'[^']*'/y],
    ["n", /\b\d[\d.]*\b/y],
    ["k", /\b(?:true|false|null)\b/y],
    ["v", /\{[\w.]+\}/y],
  ],
  ts: [
    ["c", /\/\/.*|\/\*[\s\S]*?\*\//y],
    ["s", /`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/y],
    ["k", new RegExp(`\\b(?:${KW_JS})\\b`, "y")],
    ["n", /\b\d[\d.]*\b/y],
    ["t", /<\/?[A-Z][\w.]*|\/?>/y],
    ["p", /[A-Za-z_][\w-]*(?==(?!=))/y],
    ["f", /[A-Za-z_]\w*(?=\()/y],
  ],
};
rules.tsx = rules.ts!;
rules.js = rules.ts!;

export function Highlighted({ code, lang }: { code: string; lang: string }): ReactNode {
  const set = rules[lang];
  if (!set) return code;
  const out: ReactNode[] = [];
  let plain = "";
  let i = 0;
  const flush = () => {
    if (plain) out.push(plain);
    plain = "";
  };
  while (i < code.length) {
    let hit: [string, string] | undefined;
    for (const [cls, re] of set) {
      re.lastIndex = i;
      const m = re.exec(code);
      if (m && m[0].length > 0) {
        hit = [cls, m[0]];
        break;
      }
    }
    if (hit) {
      flush();
      out.push(
        <span key={out.length} className={`tk-${hit[0]}`}>
          {hit[1]}
        </span>,
      );
      i += hit[1].length;
    } else {
      plain += code[i];
      i += 1;
    }
  }
  flush();
  return out;
}
