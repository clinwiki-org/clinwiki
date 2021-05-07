export const getMinString = (agg) => {
    // logic handling of input based on agg type here
    // if (this.input?.gte) {
    //   const thisField: any =
    //     find(propEq('name', this.agg))(thisSiteView.search.aggs.fields) ||
    //     find(propEq('name', this.agg))(thisSiteView.search.crowdAggs.fields);
    //   if (thisField.display) {
    //     switch (thisField.display) {
    //       case 'DATE_RANGE':
    //         return this.isDateAgg()
    //           ? moment(this.input.gte)
    //               .utc(false)
    //               .format('YYYY-MM-DD')
    //           : this.input.gte;
    //       case 'NUMBER_RANGE':
    //         return this.input.gte;
    //       default:
            return agg.gte;
    //     }
    //   }
    //   return this.input.gte;
    // }
  }
export const getMaxString = (agg) => {
    // logic handling of input based on agg type here
    // if (this.input?.lte) {
    //   const thisField: any =
    //     find(propEq('name', this.agg))(thisSiteView.search.aggs.fields) ||
    //     find(propEq('name', this.agg))(thisSiteView.search.crowdAggs.fields);
    //   switch (thisField.display) {
    //     case 'DATE_RANGE':
    //       return this.isDateAgg()
    //         ? moment(this.input.lte)
    //             .utc(false)
    //             .format('YYYY-MM-DD')
    //         : this.input.lte;
    //     case 'NUMBER_RANGE':
          return agg.lte;
    //     default:
    //       return this.input.lte;
    //   }
    // }
  }