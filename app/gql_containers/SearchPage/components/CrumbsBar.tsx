import * as React from 'react';
import { 
  Grid, 
  Row, 
  Col, 
  Label, 
  Button, 
  FormControl, 
  Form, 
  FormGroup, 
  ButtonGroup,
  MenuItem,
  DropdownButton } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import styled from 'styled-components';
import aggToField from 'utils/aggs/aggToField';

const CrumbsBarStyleWrappper = styled.div`
.crumbs-bar {
  padding: 10px 30px;
  border: solid white 1px;
  background-color: #f2f2f2;
  color: black;
  margin-bottom: 1em;
}
.crumbs-bar .label {
  margin: 2px;
}
.right-align {
  text-align: right;
}
`

import { AggCallback, SearchParams } from '../Types'

// 
interface CrumbsBarProps {
  searchParams : SearchParams
  removeFilter: AggCallback
  addSearchTerm : (term:string)=>void
  removeSearchTerm : (term:string,bool?)=>void
  page: number
  pagesTotal: number
  pageSize: number
  update: { page:(number)=>void }
} 
interface CrumbsBarState {
  searchTerm : string
}

const Crumb = ({category,value,onClick}) => {
  return (
    <Label> 
      <i>{category}:</i> <b>{value}</b>
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
        <b> {v}
          <FontAwesome 
            className="remove" 
            name="remove"
            style={{cursor: 'pointer', color: '#cc1111', margin: '0 0 0 3px'}}
            onClick={()=>props.onClick(v)}
            />
        </b>
      ))}
    </Label>
  )
}

export default class CrumbsBar extends React.Component<CrumbsBarProps, CrumbsBarState> {
  *mkCrumbs(searchParams : SearchParams, removeFilter) {
    if (searchParams.q && searchParams.q.length > 0) {
      yield <MultiCrumb
              key="search" 
              category="search" 
              values={searchParams.q}
              onClick={(term) => this.props.removeSearchTerm(term)} />
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
          <Col xs={12} md={9}>
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
          </Col>
          <Col xsHidden md={3}>
            <div className="right-align">
              {this.props.page > 1 ? <FontAwesome 
                className="arrow-left" 
                name="arrow-left"
                style={{cursor: 'pointer', margin: '5px'}}
                onClick={()=>this.props.update.page(this.props.page-2)}
                /> : null}
              page <b>{this.props.page}/{this.props.pagesTotal} </b>
              {this.props.page < this.props.pagesTotal ? <FontAwesome 
                  className="arrow-right" 
                  name="arrow-right"
                  style={{cursor: 'pointer', margin: '5px'}}
                  onClick={()=>this.props.update.page(this.props.page)}
                /> : null}
            </div>
          </Col>
        </Row>
        {/* <Row>
          <Col md={10}>
          </Col>
          <Col md={2}>
            <div className="right-align">
              <DropdownButton title={this.props.pageSize+" Rows"} >
                <MenuItem eventKey="1">5 Rows</MenuItem>
                <MenuItem eventKey="2">10 Rows</MenuItem>
                <MenuItem eventKey="3">20 Rows</MenuItem>
                <MenuItem eventKey="4">25 Rows</MenuItem>
                <MenuItem eventKey="5">50 Rows</MenuItem>
                <MenuItem eventKey="5">100 Rows</MenuItem>
              </DropdownButton>
            </div>
          </Col>
        </Row> */}
        <Row>
          <Col md={12}>
            <b>Filters: </b>
            { Array.from(this.mkCrumbs(this.props.searchParams, this.props.removeFilter)) }
          </Col>
        </Row>
      </Grid>
      </CrumbsBarStyleWrappper>
    )
  }
}