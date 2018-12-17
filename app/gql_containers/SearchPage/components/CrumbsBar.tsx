import * as React from 'react';
import { Grid, Row, Col, Label, Button, FormControl, Form, FormGroup } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import aggToField from 'utils/aggs/aggToField';

import './CrumbsBar.css';

import { AggFilterMap, AggCallback, SearchParams } from '../Types'

// 
interface CrumbsBarProps {
  searchParams : SearchParams
  removeFilter: AggCallback,
} 
interface CrumbsBarState {
}

const Crumb = ({category,value,onClick}) => {
  return (
    <Label> 
      <i>{category}:</i> {value} 
      <FontAwesome 
        className="remove" 
        name="remove"
        style={{cursor: 'pointer', color: '#cc1111', margin: '0 0 0 3px'}}
        onClick={onClick}
        />
    </Label>)
} 

export default class CrumbsBar extends React.Component<CrumbsBarProps, CrumbsBarState> {
  *mkCrumbs(searchParams : SearchParams, removeFilter) {
    if (searchParams.q) {
      yield <Crumb key="search" category="search" value={searchParams.q} onClick={console.log} />
    }
    for(const key in searchParams.aggFilters) {
      const agg = searchParams.aggFilters[key]
      for (const v in agg.values) {
        const val = agg.values[v]
        const cat = aggToField(agg.field)
        yield <Crumb category={cat} value={val} onClick={()=>removeFilter(agg.field, val)} key='{cat}{val}'  />
      }
    }
    for(const key in searchParams.crowdAggFilters) {
      const agg = searchParams.aggFilters[key]
      for (const v in agg.values) {
        const val = agg.values[v]
        const cat = aggToField(agg.field)
        yield <Crumb category={cat} value={val} onClick={()=>removeFilter(agg.field, val, true)} key='{cat}{val}' />
      }
    }
  }

  render() {
    // do we have any css up in this place?
    return (
      <Grid className="crumbs-bar">
        <Row>
          <Form inline className="searchInput">
            <FormGroup>
              <b>Search Within: </b>
              <FormControl type="text" placeholder="search..." />
            </FormGroup>
            <Button type="submit">
              <FontAwesome name="search" />
            </Button>
          </Form>
        </Row>
        <Row>
          <b>Filters: </b>
          { Array.from(this.mkCrumbs(this.props.searchParams, this.props.removeFilter)) }
        </Row>
      </Grid>
    )
    // <div id="crumbs-bar" className="container">
    //   <div className="row">
    //     Search Within: 
    //     <input type='text' />
    //   </div>
    //   <div className="row">
    //     sort by
    //     # of items
    //   </div>
    //   <div className="row">

    //   </div>
      
    // </div>)
  }
}