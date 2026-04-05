import { Fragment, useMemo } from "react";
import { normalizeSearch, tokenizeQuery } from "@/lib/searchUtils";

interface HighlightedTextProps {
  text: string;
  query: string;
  className?: string;
  highlightClassName?: string;
}

/**
 * Highlights whole words whose normalized form contains any normalized query token.
 */
const HighlightedText = ({
  text,
  query,
  className,
  highlightClassName = "rounded-sm bg-[#9C2F45]/12 px-0.5 font-semibold text-[#9C2F45]",
}: HighlightedTextProps) => {
  const segments = useMemo(() => {
    const tokens = tokenizeQuery(query);
    if (tokens.length === 0) return [{ value: text, hit: false as const }];

    const out: { value: string; hit: boolean }[] = [];
    let last = 0;
    let m: RegExpExecArray | null;
    const re = /\p{L}[\p{L}'-]*/gu;
    while ((m = re.exec(text)) !== null) {
      const start = m.index;
      const word = m[0];
      if (start > last) {
        out.push({ value: text.slice(last, start), hit: false });
      }
      const nw = normalizeSearch(word);
      const hit = tokens.some((t) => t.length > 0 && nw.includes(t));
      out.push({ value: word, hit });
      last = start + word.length;
    }
    if (last < text.length) {
      out.push({ value: text.slice(last), hit: false });
    }
    if (out.length === 0) return [{ value: text, hit: false as const }];
    return out;
  }, [text, query]);

  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.hit ? (
          <span key={i} className={highlightClassName}>
            {seg.value}
          </span>
        ) : (
          <Fragment key={i}>{seg.value}</Fragment>
        ),
      )}
    </span>
  );
};

export default HighlightedText;
