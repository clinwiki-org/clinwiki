// import { AggFilterInput } from 'types/globalTypes';
// import { SearchParams } from './shared'
// import {
//   path,
//   map,
//   dissoc,
//   pathOr,
//   prop,
//   any,
//   pipe,
//   groupBy,
//   head,
//   propOr,
//   lensPath,
//   over,
//   findIndex,
//   propEq,
//   reject,
//   isEmpty,
//   isNil,
//   view,
//   remove,
//   equals,
// } from 'ramda';

// /**
//  * The purpose of this class is to construct
//  * a new set of search params based on the agg
//  * filter input provided
//  */
// class AggFilterInputUpdater {
//   aggFilterInput: AggFilterInput
//   searchParams: SearchParams

//   ACCEPTED_FIELDS = ["values", "gte", "lte"];

//   constructor(aggFilterInput: AggFilterInput, searchParams: SearchParams) {
//     this.aggFilterInput = aggFilterInput;
//     this.searchParams = searchParams;
//   }

//   hasNoFilters(): boolean {
//     return !any((field) => (
//       !isEmpty(this.aggFilterInput[field]) ||
//       !isNil(this.aggFilterInput[field]) ||
//     ), this.ACCEPTED_FIELDS)
//   }

// }

// export const changeFilter = (add: boolean) => (
//   aggName: string,
//   key: string,
//   isCrowd?: boolean
// ) => (params: SearchParams) => {
//   const propName = isCrowd ? 'crowdAggFilters' : 'aggFilters';
//   const lens = lensPath([propName]);
//   return over(
//     lens,
//     (aggs: AggFilterInput[]) => {
//       const index = findIndex(propEq('field', aggName), aggs);
//       if (index === -1 && add) {
//         return [...aggs, { field: aggName, values: [key] }];
//       }
//       const aggLens = lensPath([index, 'values']);
//       const updater = (values: string[]) =>
//         add ? [...values, key] : reject(x => x === key, values);
//       let res = over(aggLens, updater, aggs);
//       // Drop filter if no values left
//       if (isEmpty(view(aggLens, res))) {
//         res = remove(index, 1, res as any);
//       }
//       return res;
//     },
//     {
//       ...params,
//       page: 0,
//     }
//   );
// };

// export const changeFilterNew = (add: boolean) => (
//   agg: AggFilterInput,
//   isCrowd?: boolean
// ) => (params: SearchParams) => {
//   const propName = isCrowd ? 'crowdAggFilters' : 'aggFilters';
//   const lens = lensPath([propName]);
//   return over(
//     lens,
//     (aggs: AggFilterInput[]) => {
//       const index = findIndex(propEq('field', aggName), aggs);
//       if (index === -1 && add) {
//         return [...aggs, { field: aggName, values: [key] }];
//       }
//       const aggLens = lensPath([index, 'values']);
//       const updater = (values: string[]) =>
//         add ? [...values, key] : reject(x => x === key, values);
//       let res = over(aggLens, updater, aggs);
//       // Drop filter if no values left
//       if (isEmpty(view(aggLens, res))) {
//         res = remove(index, 1, res as any);
//       }
//       return res;
//     },
//     {
//       ...params,
//       page: 0,
//     }
//   );
// };

// export const addFilter = changeFilter(true);

// export const removeFilter = changeFilter(false);

// export const addFilters = (
//   aggName: string,
//   keys: string[],
//   isCrowd?: boolean
// ) => {
//   return (params: SearchParams) => {
//     keys.forEach(k => {
//       (params = addFilter(aggName, k, isCrowd)(params) as SearchParams),
//     });
//     // changeFilter(true);
//     return params;
//   };
// };

// export const removeFilters = (
//   aggName: string,
//   keys: string[],
//   isCrowd?: boolean
// ) => {
//   return (params: SearchParams) => {
//     keys.forEach(k => {
//       params = removeFilter(aggName, k, isCrowd)(params) as SearchParams;
//     });
//     return params;
//   };
// };
