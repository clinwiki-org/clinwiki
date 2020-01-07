import * as React from 'react';
import { Label } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';

const MultiCrumb = (props: {
  category?: string;
  values: string[];
  labels?: string[];
  onClick: (s: string) => void;
}) => {
  return (
    <Label className="btn">
      {props.category && <i>{props.category}:</i>}
      {props.values.map((v, i) => {
        const label = props.labels ? props.labels[i] : v;
        return (
          <b key={v}>
            {label}
            <FontAwesome
              className="remove"
              name="remove"
              style={{
                cursor: 'pointer',
                color: '#cc1111',
                margin: '0 0 0 3px',
              }}
              onClick={() => props.onClick(v)}
            />
          </b>
        );
      })}
    </Label>
  );
};

export default MultiCrumb;
