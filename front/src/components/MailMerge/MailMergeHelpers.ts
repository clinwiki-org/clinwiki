import Handlebars from 'handlebars';
import useUrlParams from 'utils/UrlParamsProvider';
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
        console.log(linkAttributes)
        let queryString = "?"

        for (const [key, value] of Object.entries(linkAttributes)) {
          if(value){
            queryString= queryString.concat(`${key}=${value}&`)
          }
        }

        return queryString
      default:
        return value
    }
  });
}
