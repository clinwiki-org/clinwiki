/**
*
* GenericStudySection
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Table, Grid } from 'react-bootstrap';
import LoadingPane from 'components/LoadingPane';

const GenericStudySection = (props) => props.data !== undefined ? (
  <Grid>
    <Table striped bordered condensed>
      <tbody>
        {props.data.map((item) => (
          <tr className="generic-item-row" key={item.label}>
            <td className="generic-item-row-key"><b>{item.label}</b></td>
            <td className="generic-item-row-value">{item.value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Grid>
) : (<LoadingPane />);

GenericStudySection.propTypes = {
  data: PropTypes.array,
};

export default GenericStudySection;
