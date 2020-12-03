import * as React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

export interface ListProps {
  items: string[];
  nctid: string;
  delete(item: string): void;
}

export interface ListState {
  filtered: string[];
}

class List extends React.Component<ListProps, ListState> {
  constructor(props: ListProps) {
    super(props);
    this.state = {
      filtered: [],
    };
  }

  componentDidMount() {
    this.setState({
      filtered: this.props.items,
    });
  }

  componentWillReceiveProps(nextProps: ListProps) {
    this.setState({
      filtered: nextProps.items,
    });
  }

  render() {
    return (
      <div>
        {this.state.filtered.map((item: string) => (
          <button className="termstyle" key={item}>
            {item} &nbsp;
            <span className="delete" onClick={() => this.props.delete(item)}>
              x
            </span>
          </button>
        ))}
      </div>
    );
  }
}

export default List;
