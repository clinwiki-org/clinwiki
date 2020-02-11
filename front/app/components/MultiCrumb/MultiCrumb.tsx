import * as React from 'react';
import { ListGroupItem } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import styled from 'styled-components';

interface MultiCrumbProps {
  category?: string;
  values: string[];
  labels?: string[];
  onClick: (s: string) => void;
}
interface MultiCrumbState {
  showValue: boolean;
}
class MultiCrumb extends React.Component<MultiCrumbProps, MultiCrumbState> {
  state: MultiCrumbState = {
    showValue: false,
  };

  toggleShowValue = () => {
    const { showValue } = this.state;

    this.setState({ showValue: !showValue });
  };
  render() {
    const MultiCrumb = styled.div`
      .filter-values {
        background-color: transparent;
        border: none;
      }
      .crumb-container {
        border: 2px solid #ddd;
        border-radius: 4px;
        padding: 0 5px 0 5px;
        color: #55b88d;
        margin: 1px;
      }
      .crumb-icon {
        cursor: pointer;
        color: #ddd;
        margin: 0 0 0 3px;
      }
    `;
    if (this.props.values.length > 4 && this.state.showValue == false) {
      let addVals = this.props.values.length - 4;
      return (
        <MultiCrumb>
          <ListGroupItem className="filter-values">
            {this.props.category && <i>{this.props.category}:</i>}
            {this.props.values.slice(0, 4).map((v, i) => {
              const label = this.props.labels ? this.props.labels[i] : v;

              return (
                <b key={v}>
                  <span className="crumb-container">
                    {label}
                    <FontAwesome
                      className="remove crumb-icon"
                      name="remove"
                      onClick={() => this.props.onClick(v)}
                    />
                  </span>
                </b>
              );
            })}
            <b>
              <span className="crumb-container">
                {`...${addVals} others`}
                <FontAwesome
                  className="chevron-right crumb-icon"
                  name="chevron-right"
                  onClick={() => this.toggleShowValue()}
                />
              </span>
            </b>
          </ListGroupItem>
        </MultiCrumb>
      );
    } else if (this.props.values.length > 4 && this.state.showValue == true) {
      return (
        <MultiCrumb>
          <ListGroupItem className="filter-values">
            {this.props.category && <i>{this.props.category}:</i>}
            {this.props.values.map((v, i) => {
              const label = this.props.labels ? this.props.labels[i] : v;
              return (
                <b key={v}>
                  <span className="crumb-container">
                    {label}
                    <FontAwesome
                      className="remove crumb-icon"
                      name="remove"
                      onClick={() => this.props.onClick(v)}
                    />
                  </span>
                </b>
              );
            })}

            <b>
              <FontAwesome
                className="chevron-left crumb-icon"
                name="chevron-left"
                onClick={() => this.toggleShowValue()}
              />
            </b>
          </ListGroupItem>
        </MultiCrumb>
      );
    } else {
      return (
        <MultiCrumb>
          <ListGroupItem className="filter-values">
            {this.props.category && <i>{this.props.category}:</i>}
            {this.props.values.map((v, i) => {
              const label = this.props.labels ? this.props.labels[i] : v;
              return (
                <b key={v}>
                  <span className="crumb-container">
                    {label}
                    <FontAwesome
                      className="remove crumb-icon"
                      name="remove"
                      onClick={() => this.props.onClick(v)}
                    />
                  </span>
                </b>
              );
            })}
          </ListGroupItem>
        </MultiCrumb>
      );
    }
  }
}

export default MultiCrumb;
