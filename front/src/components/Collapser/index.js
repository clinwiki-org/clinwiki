import React from 'react';
import * as FontAwesome from 'react-fontawesome';

const Collapser = ({title, collapse, state}) => {
  return ( 
    <div className="collapse-container">
      <div className="collapse-title">{state ? title : ""}</div>
      <div className="collapser" onClick={collapse}>
        {state ? 
          <FontAwesome name={"chevron-up"} /> : 
          <FontAwesome name={"chevron-down"} />}
      </div>
    </div> 
  )
}

export default Collapser