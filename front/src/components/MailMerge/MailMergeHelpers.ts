import Handlebars from 'handlebars';
import useUrlParams, { queryStringAll } from 'utils/UrlParamsProvider';
import { link } from 'fs';
import {ThemedSearchCard} from 'components/StyledComponents';
import moment from 'moment';

export function registerHandlebarsHelpers() {
  Handlebars.registerHelper('stars', (value: number) => {
    switch (value) {
      case 0:
        return '☆☆☆☆☆';
      case 1:
        return '★☆☆☆☆';
      case 2:
        return '★★☆☆☆';
      case 3:
        return '★★★☆☆';
      case 4:
        return '★★★★☆';
      case 5:
        return '★★★★★';
      default:
        return value
    }
  });
  Handlebars.registerHelper('querystring', (value: string) => {
    const linkAttributes =  useUrlParams()
    switch (value) {
      case 'hash':
        return linkAttributes.hash;
      case 'siteViewUrl':
        return linkAttributes.sv;
      case 'pageViewUrl':
        return linkAttributes.pv
      case 'q':
        return linkAttributes.q
      case 'ALL':
        return queryStringAll(linkAttributes)
      default:
        return 
    }
  });
    Handlebars.registerHelper('$LEFT', (value: string, characters: number) => {
      if(!value) return
      let newVal = value.slice(0, characters) 
    return newVal
});
  Handlebars.registerHelper('$RIGHT', (value: string, characters: number) => {
    if(!value) return
    let newVal = value.slice(value.length-characters, value.length) 
    return newVal
});
  Handlebars.registerHelper('$TRUNCATE', (value: string, characters: number) => {
    if(!value) return
    if(value.length<characters) return value
    let ellipses = '...'
    let newVal = value.slice(0,characters) 
    let cutValues = value.slice(characters, value.length)
    return new Handlebars.SafeString(`${newVal}<span id="ellipses"> ${ellipses}</span><span class="ellipsed-text">${cutValues}</span>`)
});
  Handlebars.registerHelper('DateToString', (value: string) => {
    let newVal = value
    return newVal
});
  Handlebars.registerHelper('$FindAndReplace', ( arrayOfValuesToFind: string, arrayOfValues:string, valueToReplace: string ) => {
    if(!arrayOfValuesToFind) return
    let valuesToFind: string[] = arrayOfValuesToFind.toLowerCase().replace(/\s/g, "").split('|');
    let values: string[] = arrayOfValues.split('|');
    let indexFound= valuesToFind.indexOf(valueToReplace?.toLocaleLowerCase().replace(/\s/g, ""))
    if ( indexFound== -1){
      return new Handlebars.SafeString(valueToReplace)
    }else{
      return new Handlebars.SafeString(values[indexFound])
    }
  });
}
  Handlebars.registerHelper('$Reduce', (arrayOfValuesToReduce: any[]) => {
    if(!arrayOfValuesToReduce) return

    const combinedItems = (arr :any[] = []) => {
      const res = arr.reduce((values, obj) => {
         let found = false;
         for (let i = 0; i < values.length; i++) {
            if (values[i].crowd_key === obj.crowd_key) {
               found = true;
              //  values[i].count++;
              let someArray : any[]=[];
              someArray.push(values[i].crowd_value)
              someArray.push(obj.crowd_value)
              console.log(obj)
              values[i].crowd_value = someArray
            };
         }
         if (!found) {
            obj.count = 1;
            values.push(obj);
         }
        //  console.log(values)
         return values;
      }, []);
      console.log(res)
      return res;
   }

   console.log(combinedItems(arrayOfValuesToReduce))
   return combinedItems(arrayOfValuesToReduce)
   
  });
Handlebars.registerHelper('formatDate', function(dateString) {
  return new Handlebars.SafeString(
      moment(dateString).format("MM/DD/YYYY").toUpperCase()
  );
});
Handlebars.registerHelper('runConditional', (a: any, operator: string, b: string, opts:string) => {
  console.log(a, b)
  var bool = false;
  switch(operator) {
     case '==':
       console.log("SIP")
         bool = a == b;
         break;
     case '>':
         bool = a > b;
         break;
     case '<':
         bool = a < b;
         break;
     default:
       console.log("OP", operator)
        //  throw "Unknown operator " + operator;
        return operator
      }

  // if (bool) {
  //     return opts.fn(bool);
  // } else {
  //     return opts.inverse(bool);
  // }
});