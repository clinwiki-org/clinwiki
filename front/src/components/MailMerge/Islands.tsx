import React, { useMemo, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { IslandConstructor } from './MailMergeView';

// function insertIslands(
//   context: any,
//   islands?: Record<string, (el: Element, context: object) => JSX.Element>,
//   root?: HTMLDivElement | null
// ) {
//   if (!root || !context || !islands) return;
//   const result: React.ReactPortal[] = [];

//   for (const name in islands) {
//     const elements = root.getElementsByTagName(name);
//     for (const el of elements) {
//       if (!el['attachedIsland']) {
//         el['attachedIsland'] = true;
//         if (el.firstElementChild) {
//           el.innerHTML = ''
//         }
//       }
//       result.push(ReactDOM.createPortal(islands[name](el, context), el));
//     }
//   }
//   console.log(`${result.length} islands`);
//   return result;
// }

interface IslandProps {
  parent: Element;
  component: JSX.Element;
}
export function Island(props: IslandProps) {
  const [el, setEl] = useState<Element | null>(null);
  useEffect(() => {
    const mydiv = document.createElement('div');
    props.parent.appendChild(mydiv);
    setEl(mydiv);
  }, [props.parent]);
  if (el) {
    return ReactDOM.createPortal(props.component, el);
  } else return null;
}

interface IslandsProps {
  islands?: Record<string, (el: Element, context: object) => JSX.Element>;
  context: any;
  root?: HTMLDivElement | null;
}
export default function Islands(props: IslandsProps) {
  console.log('render islands', props.root);
  const { islands, root } = props;
  const [elements, setElements] = useState<[Element, JSX.Element][]>([]);
  useEffect(() => {
    console.log("Islands effect");
    const result: [Element, JSX.Element][] = [];
    if (root) {
      for (const name in islands) {
        const elements = root.getElementsByTagName(name);
        for (const el of elements) {
          result.push([el, islands[name](el, props.context)]);
          el.innerHTML = '';
        }
      }
      setElements(result);
    }
  }, [root, root?.firstChild]);
  return (
    <>
      {elements.map(([domEl, rEl], i) => (
        <Island key={i} parent={domEl} component={rEl} />
      ))}
    </>
  );
}
