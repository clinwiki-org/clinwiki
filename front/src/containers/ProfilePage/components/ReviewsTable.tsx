import * as React from 'react';
import { History } from 'history';
import { SearchContainer } from 'components/StyledComponents';
import ReactTable from 'react-table';

interface ReviewsTableProps {
  reviewData: any;
  history: History;
  isReview: boolean;
}

class ReviewsTable extends React.Component<ReviewsTableProps> {
  componentDidMount() {}

  onRowClick = (nctId: string, siteViewUrl: string) => {
    this.props.history.push(`/study/${nctId}?sv=${siteViewUrl}`);
  };

  rowProps = (_, rowInfo) => {
    return {
      onClick: (_, handleOriginal) => {
        this.onRowClick(rowInfo.row.nctId, 'default');
        return handleOriginal();
      },
    };
  };

  render() {
    const data = this.props.reviewData;

    const reviewColumns = [
      {
        Header: 'Nct Id',
        accessor: 'nctId', // String-based value accessors!
      },
      {
        Header: 'Brief Title',
        accessor: 'briefTitle',
        // Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
      },
      {
        Header: 'Review Content',
        accessor: 'content',
        // Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
      },
    ];
    const reactionsColumns = [
      {
        Header: 'Nct Id',
        accessor: 'nctId', // String-based value accessors!
      },
      {
        Header: 'Brief Title',
        accessor: 'study.briefTitle',
        // Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
      },
    ];

    if (this.props.isReview == true) {
      return (
        <SearchContainer>
          Showing Reviews
          <ReactTable
            data={data}
            columns={reviewColumns}
            minRows={1}
            getTdProps={this.rowProps}
          />
        </SearchContainer>
      );
    }
    return (
      <SearchContainer>
        <ReactTable
          data={data}
          columns={reactionsColumns}
          minRows={1}
          getTdProps={this.rowProps}
        />
      </SearchContainer>
    );
  }
}

export default ReviewsTable;
