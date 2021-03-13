import * as React from 'react';
import { SearchParams } from '../shared';





const GreyCard = () => {
  return (
  <div className="grey-loader" style={{height: '320px', width: '320px', margin: '20px'}}>

  </div>
  )
}




const CardsLoader =  () => {
   return (
     <div className="cards-loader-wrapper">
          <GreyCard />
          <GreyCard />
          <GreyCard />
          <GreyCard />
          <GreyCard />
          <GreyCard />
          <GreyCard />
          <GreyCard />
          <GreyCard />
     </div>
   )
}

export default CardsLoader;


