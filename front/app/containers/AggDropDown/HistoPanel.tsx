import * as React from 'react';
import HistoSlider from 'histoslider';
import { Panel } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import { AggBucket } from '../SearchPage/Types';

interface HistoPanelProps {
  isOpen: boolean;
  hasMore: boolean;
  loading: boolean;
  buckets: Array<AggBucket>;
  handleLoadMore: () => void;
  updater: AggFilterInputUpdater;
}

class HistoPanel extends React.Component<HistoPanelProps> {
  render() {
    const {
      isOpen,
      hasMore,
      loading,
      buckets,
      handleLoadMore,
      updater,
    } = this.props;
    if (hasMore || loading) {
      handleLoadMore();
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BeatLoader key="loader" color="#fff" />
        </div>
      );
    }

    const sliderData = [] as any[];
    buckets.forEach(({ key, docCount }) => {
      if (docCount > 0) {
        sliderData.push({
          x0: key,
          x: key,
          y: docCount,
        });
      }
    });

    return (
      <Panel.Collapse className="bm-panel-collapse">
        <Panel.Body>
          {
            <HistoSlider
              height={50}
              width={150}
              data={sliderData}
              onChange={updater.changeRange}
              showLabels={false}
              selection={updater.getRangeSelection()}
            />
          }
        </Panel.Body>
      </Panel.Collapse>
    );
  }
}

export default withAggContext(HistoPanel);
