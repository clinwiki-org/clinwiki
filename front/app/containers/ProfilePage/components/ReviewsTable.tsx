import * as React from 'react';
import { History, Location } from 'history';
import { SearchContainer } from 'components/StyledComponents';
import ReactTable from 'react-table'

interface ReviewsTableProps {
reviewData: any;
history: History;
}

class ReviewsTable extends React.Component<ReviewsTableProps> {
  componentDidMount() {

  };

  onRowClick = (nctId: string,siteViewUrl: string) => {
    this.props.history.push(
      `/study/${nctId}?sv=${siteViewUrl}`
    );
  };

  rowProps = (_, rowInfo) => {
    return {
      onClick: (_, handleOriginal) => {
        this.onRowClick(
          rowInfo.row.nctId,
           'default'
        );
        return handleOriginal();
      },
    };
  };

  render() {

    const data = this.props.reviewData
  
    const columns = [{
      Header: 'Nct Id',
      accessor: 'nctId' // String-based value accessors!
    }, {
      Header: 'Brief Title',
      accessor: 'briefTitle',
      // Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
      Header: 'Review Content',
      accessor: 'content',
      // Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }]

    return (
      <SearchContainer>
          Showing Reviews
          <ReactTable
    data={data}
    columns={columns}
    minRows={1}
    getTdProps={this.rowProps}

  />
      </SearchContainer>
    );
  }
}

export default ReviewsTable;
