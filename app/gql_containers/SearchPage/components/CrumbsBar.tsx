import * as React from 'react';
import { Grid, Row, Col, Label, Button, FormControl, Form, FormGroup } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import styled from 'styled-components';
import aggToField from 'utils/aggs/aggToField';

// import './CrumbsBar.css';
const CrumbsBarStyleWrappper = styled.div`
.crumbs-bar {
  display:flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 30px;
  border: solid white 1px;
  background-color: #f2f2f2;
  color: black;
  margin-bottom: 1em;
}
.crumbs-bar .label {
  margin: 2px;
}
.crumbs-bar .row {
  margin: 5px;
}


`

import { AggFilterMap, AggCallback, SearchParams } from '../Types'

// 
interface CrumbsBarProps {
  searchParams : SearchParams
  removeFilter: AggCallback,
  addSearchTerm : (term:string)=>void
  removeSearchTerm : (term:string,bool?)=>void
} 
interface CrumbsBarState {
  searchTerm : string
}

const Crumb = ({category,value,onClick}) => {
  return (
    <Label> 
      <i>{category}:</i> <strong>{value}</strong>
      <FontAwesome 
        className="remove" 
        name="remove"
        style={{cursor: 'pointer', color: '#cc1111', margin: '0 0 0 3px'}}
        onClick={onClick}
        />
    </Label>)
} 
const MultiCrumb = (props: {category:string,values:string[],onClick:(string)=>void}) => {
  return (
    <Label>
      <i>{props.category}:</i>
      {props.values.map(v => (
        <strong> {v}
          <FontAwesome 
            className="remove" 
            name="remove"
            style={{cursor: 'pointer', color: '#cc1111', margin: '0 0 0 3px'}}
            onClick={()=>props.onClick(v)}
            />
        </strong>
      ))}
    </Label>
  )
}

export default class CrumbsBar extends React.Component<CrumbsBarProps, CrumbsBarState> {
  *mkCrumbs(searchParams : SearchParams, removeFilter) {
    if (searchParams.q) {
      yield <Crumb 
              key="search" 
              category="search" 
              value={searchParams.q} 
              onClick={this.clearPrimarySearch} />
    }
    for (const key in searchParams.searchWithinTerms) {
      const term = searchParams.searchWithinTerms[key]
      yield <Crumb 
              key={"search:"+key} 
              category="search" 
              value={term} 
              onClick={() => this.props.removeSearchTerm(term)} />
    }
    for(const key in searchParams.aggFilters) {
      const agg = searchParams.aggFilters[key]
      const cat = aggToField(agg.field)
      yield <MultiCrumb 
          category={cat} 
          values={agg.values} 
          onClick={(val)=>removeFilter(agg.field, val)} 
          key={cat+agg.values.join()}  />
    }
    for(const key in searchParams.crowdAggFilters) {
      const agg = searchParams.crowdAggFilters[key]
        const cat = aggToField(agg.field)
        yield <MultiCrumb
          category={cat} 
          values={agg.values} 
          onClick={(val)=>removeFilter(agg.field, val, true)} 
          key={cat+agg.values.join('')} />
    }
  }

  localSearchChange = (e) => {
    this.setState({ searchTerm : e.target.value })
  }
  clearPrimarySearch = () => {
    this.props.removeSearchTerm("", true)
  }
  onSubmit = (e) => {
    e.preventDefault()
    this.props.addSearchTerm(this.state.searchTerm)
    this.setState({ searchTerm: "" })
  }

  render() {
    return (
      <CrumbsBarStyleWrappper>
      <Grid className="crumbs-bar">
        <Row>
          <Form inline className="searchInput" onSubmit={this.onSubmit}>
            <FormGroup>
              <b>Search Within: </b>
              <FormControl 
                type="text" 
                placeholder="search..."
                onChange={this.localSearchChange}
                />
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
      </CrumbsBarStyleWrappper>
    )
  }
}