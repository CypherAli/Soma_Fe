import { Fragment } from "react";

function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*)/g).map((part, index) =>
    /^(\*\*|__)/.test(part) ? <strong key={index}>{part.slice(2, -2)}</strong>
      : /^\*[^*]+\*$/.test(part) ? <em key={index}>{part.slice(1, -1)}</em>
        : <Fragment key={index}>{part}</Fragment>);
}

/** Small, safe text renderer: semantic lists and emphasis, without raw HTML. */
export default function PathologyText({ text }: { text: string }) {
  const blocks: { list: boolean; lines: string[] }[] = [];
  for (const raw of text.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) { if (blocks.at(-1)?.lines.length) blocks.push({ list: false, lines: [] }); continue; }
    const list = /^(?:[-*•]|\d+[.)])\s+/.test(line);
    const clean = line.replace(/^(?:#{1,6}\s+|(?:[-*•]|\d+[.)])\s+)/, "");
    let block = blocks.at(-1);
    if (!block || block.list !== list) { block = { list, lines: [] }; blocks.push(block); }
    block.list = list; block.lines.push(clean);
  }
  return <div className="pth-text">{blocks.filter(block => block.lines.length).map((block, index) => block.list
    ? <ul key={index}>{block.lines.map((line, i) => <li key={i}>{inline(line)}</li>)}</ul>
    : <p key={index}>{block.lines.map((line, i) => <Fragment key={i}>{i > 0 && <br />}{inline(line)}</Fragment>)}</p>)}</div>;
}
