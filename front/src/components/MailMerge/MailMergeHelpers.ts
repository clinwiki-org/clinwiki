import Handlebars from 'handlebars';
import useUrlParams, { queryStringAll } from 'utils/UrlParamsProvider';
import { link } from 'fs';

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
        return value
    }
  });
    Handlebars.registerHelper('$LEFT', (value: string, characters: number) => {
    let newVal = value.slice(0, characters) 
    return newVal
});
  Handlebars.registerHelper('$RIGHT', (value: string, characters: number) => {
    let newVal = value.slice(value.length-characters, value.length) 
    return newVal
});
  Handlebars.registerHelper('$TRUNCATE', (value: string, characters: number) => {
    if(value.length<characters) return value
    let ellipses = '...'
    let newVal = value.slice(0,characters) 
    let cutValues = value.slice(characters, value.length)
    return new Handlebars.SafeString(`${newVal}<span id="ellipses"> ${ellipses}</span><span class="ellipsed-text">${cutValues}</span>`)
});
  Handlebars.registerHelper('DateToString', (value: string) => {
    console.log("VAL",value)
    let newVal = value
    console.log("NEW:", newVal)
    return newVal
});
  Handlebars.registerHelper('$FindAndReplace', ( arrayOfValuesToFind: string, arrayOfValues:string, valueToReplace: string ) => {
    let valuesToFind: string[] = arrayOfValuesToFind.toLowerCase().replace(/\s/g, "").split('|');
    let values: string[] = arrayOfValues.split('|');
    let indexFound= valuesToFind.indexOf(valueToReplace.toLocaleLowerCase().replace(/\s/g, ""))
    if ( indexFound== -1){
      return new Handlebars.SafeString(valueToReplace)
    }else{
      return new Handlebars.SafeString(values[indexFound])
    }
  });

}
