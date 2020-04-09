import * as React from 'react';

const CardIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="far"
    data-icon="th"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className="svg-inline--fa fa-th fa-w-16 fa-lg"
    style={{ width: '17px' }}>
    <path
      fill="currentColor"
      d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM197.3 72h117.3v96H197.3zm0 136h117.3v96H197.3zm-40 232H52c-6.6 0-12-5.4-12-12v-84h117.3zm0-136H40v-96h117.3zm0-136H40V84c0-6.6 5.4-12 12-12h105.3zm157.4 272H197.3v-96h117.3v96zm157.3 0H354.7v-96H472zm0-136H354.7v-96H472zm0-136H354.7V72H472z"
      className=""
    />
  </svg>
);

const TableIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="far"
    data-icon="th-list"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className="svg-inline--fa fa-th-list fa-w-16 fa-lg"
    style={{ width: '17px' }}>
    <path
      fill="currentColor"
      d="M0 80v352c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48H48C21.49 32 0 53.49 0 80zm472 224H197.333v-96H472v96zm0 40v84c0 6.627-5.373 12-12 12H197.333v-96H472zM40 208h117.333v96H40v-96zm157.333-40V72H460c6.627 0 12 5.373 12 12v84H197.333zm-40-96v96H40V84c0-6.627 5.373-12 12-12h105.333zM40 344h117.333v96H52c-6.627 0-12-5.373-12-12v-84z"
      className=""
    />
  </svg>
);

export { CardIcon, TableIcon };
