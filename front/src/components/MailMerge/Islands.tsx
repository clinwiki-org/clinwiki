import React, { useMemo, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

function insertIslands(
  context: any,
  islands?: Record<string, (el: Element, context: object) => JSX.Element>,
  root?: HTMLDivElement | null
) {
  if (!root || !context || !islands) return;
  const result: React.ReactPortal[] = [];

  for (const name in islands) {
    const elements = root.getElementsByTagName(name);
    for (const el of elements) {
      if (!el['attachedIsland']) {
        el['attachedIsland'] = true;
        if (el.firstElementChild) {
          el.innerHTML = ''
        }
      }
      result.push(ReactDOM.createPortal(islands[name](el, context), el));
    }
  }
  console.log(`${result.length} islands`);
  return result;
}
interface IslandProps {
  context: any;
  islands?: Record<string, (el: Element, context: object) => JSX.Element>;
  root?: HTMLDivElement | null;
}
export default function Islands(props: IslandProps) {
  // const [islands, setIslands] = useState<React.ReactPortal[]>([]);
  const islands = insertIslands(props.context, props.islands, props.root);
  return <>{islands}</>;
}
