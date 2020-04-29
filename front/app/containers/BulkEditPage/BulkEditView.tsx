import * as React from 'react';
import styled from 'styled-components';
import CollapsiblePanel from 'components/CollapsiblePanel';
import Toast from 'components/Toast';
import { ButtonToolbar, Button, Checkbox, Panel, Col } from 'react-bootstrap';
import { checkServerIdentity } from 'tls';
import MultiCrumb from 'components/MultiCrumb';
import { bucketKeyStringIsMissing } from 'utils/aggs/bucketKeyIsMissing';
import { capitalize } from 'utils/helpers';
import * as FontAwesome from 'react-fontawesome';
import ThemedButton, {
  PresearchTitle,
  PresearchPanel,
  PresearchContent,
  ThemedPresearchHeader,
  ThemedPresearchCard,
} from 'components/StyledComponents';

interface Undo {
  description: string;
  action: () => void;
}

interface Label {
  name: string;
  values: string[];
  selectedValues: string[];
  indeterminiteValues: string[];
}

interface LabelValue {
  name: string;
  value: string;
}

interface LoadingProps {
  readonly show: boolean;
}

interface BulkEditProps {
  recordsTotal: number;
  labels: string[];
  aggBucketsByLabel: any;
  loading: boolean;
  undoHistory: any[];
  commit: (
    toAdd: LabelValue[],
    toRemove: LabelValue[],
    description: string
  ) => Promise<void>;
  handleUndo: (undoActions: any[], idx: number) => void;
}

interface BulkEditState {
  labelsToAdd: LabelValue[];
  labelsToRemove: LabelValue[];
}

const CrumbsBarStyleWrapper = styled.div`
  margin-bottom: 8px;
  .container {
    background: #d9deea;
    border: 0px;

    color: #394149;
  }

  i {
    font-style: normal;
    margin-right: 3px;
    text-transform: capitalize;
  }

  span.label.label-default {
    padding: 7px !important;
    border-radius: 2px !important;
  }

  input.form-control {
    border: 0px;
    box-shadow: none;
    margin-right: 10px;
    margin-left: 10px;
  }

  span.label {
    background: none;
    padding: 5px;
    font-size: 12px;
    border-radius: 4px;
    margin-right: 5px;
    text-transform: capitalize;

    span.fa-remove {
      color: #fff !important;
      opacity: 0.5;
      margin-left: 5px !important;
    }

    span.fa-remove:hover {
      opacity: 1;
    }

    b {
      padding-right: 5px;
    }

    b:last-of-type {
      padding-right: 0px;
    }
  }

  .right-align {
    text-align: right;
  }

  div.row > div {
    padding-left: 0px;
  }

  .searchInput {
    padding-bottom: 10px;
  }
`;

const Loading = styled.div<LoadingProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  transition: 0.3s;
  opacity: 0;
  pointer-events: none;
  ${props =>
    props.show
      ? `
      opacity:1;
      pointer-events: initial;
  `
      : ''}
  z-index: 999999;
`;
const ToastContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
`;

const MainContainer = styled(Col)`
  background-color: #eaedf4;
  min-height: 100vh;
  padding: 20px;
`;
const PanelContainer = styled(Panel)`
  padding: 16px;
  position: relative;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const Title = styled.h3`
  margin-bottom: 20px;
`;
const StyledPanel = styled(CollapsiblePanel)`
  margin: 0 10px 10px 0;
  width: 250px;
  .panel-heading h3 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: absolute;
    max-width: 200px;
  }
  .panel-body {
    height: 150px !important;
    overflow: scroll;
  }
`;

const groupByLabel = (labels: LabelValue[]) => {
  return labels.reduce(
    (accum, x) => ({
      ...accum,
      [x.name]: [...(accum[x.name] || []), x.value],
    }),
    {}
  );
};

const isSelected = ({ label, value }) => (x: { name: string; value: string }) =>
  x.name != label || x.value != value;

const buildDescription = ({ groupedByLabel, recordsTotal }) => {
  let desc = '';
  if (Object.keys(groupedByLabel.toAdd).length) {
    desc += `Added: `;
    desc += `${Object.entries(groupedByLabel.toAdd)
      .map(([label, values]) => `${label}: ${values}`)
      .join('. ')}`;
  }
  if (Object.keys(groupedByLabel.toRemove).length) {
    desc += `Removed: `;
    desc += `${Object.entries(groupedByLabel.toRemove)
      .map(([label, values]) => `${label}: ${values}`)
      .join('. ')}`;
  }
  if (desc != '') desc += ` on ${recordsTotal} studies.`;
  return desc;
};

class BulkEditView extends React.Component<BulkEditProps, BulkEditState> {
  state: BulkEditState = {
    labelsToAdd: [],
    labelsToRemove: [],
  };
  handleSelect = (label, value, checked) => {
    if (checked) {
      this.setState(state => ({
        labelsToRemove: [...state.labelsToRemove, { name: label, value }],
        labelsToAdd: state.labelsToAdd.filter(isSelected({ label, value })),
      }));
    } else {
      this.setState(state => ({
        labelsToAdd: [...state.labelsToAdd, { name: label, value }],
        labelsToRemove: state.labelsToRemove.filter(
          isSelected({ label, value })
        ),
      }));
    }
  };

  handleRemoveCrumb = (label, value, fromAdd = false) => {
    if (fromAdd) {
      this.setState(state => ({
        labelsToAdd: state.labelsToAdd.filter(isSelected({ label, value })),
      }));
    } else {
      this.setState(state => ({
        labelsToRemove: state.labelsToRemove.filter(
          isSelected({ label, value })
        ),
      }));
    }
  };

  render() {
    const {
      commit,
      handleUndo,
      loading,
      labels,
      aggBucketsByLabel,
      recordsTotal,
      undoHistory,
    } = this.props;
    const { labelsToAdd, labelsToRemove } = this.state;

    const groupedByLabel = {
      toAdd: groupByLabel(labelsToAdd),
      toRemove: groupByLabel(labelsToRemove),
    };

    return (
      <MainContainer>
        <PanelContainer>
          <Loading show={loading} />
          <Title>Crowd Labels</Title>
          <Container>
            {labels.map(label =>
              !aggBucketsByLabel[label].all.length ? null : (
                <ThemedPresearchCard>
                  <ThemedPresearchHeader>
                    <PresearchTitle>{capitalize(label)}</PresearchTitle>
                  </ThemedPresearchHeader>
                  <PresearchContent>
                    {aggBucketsByLabel[label].all.map(value => {
                      const indeterminate = aggBucketsByLabel[
                        label
                      ].selected.includes(value);
                      const isToAdd =
                        groupedByLabel.toAdd[label] &&
                        groupedByLabel.toAdd[label].includes(value);
                      const isToRemove =
                        groupedByLabel.toRemove[label] &&
                        groupedByLabel.toRemove[label].includes(value);
                      if (bucketKeyStringIsMissing(value)) {
                        // don't allow bulk adding missing value to matching pages
                        return null;
                      }
                      return (
                        <Checkbox
                          key={`${label}-${value}`}
                          checked={(indeterminate || isToAdd) && !isToRemove}
                          inputRef={el =>
                            el &&
                            (el.indeterminate =
                              indeterminate && !isToAdd && !isToRemove)
                          }
                          onChange={() =>
                            this.handleSelect(label, value, isToAdd)
                          }>
                          {value}
                        </Checkbox>
                      );
                    })}
                  </PresearchContent>
                </ThemedPresearchCard>
              )
            )}
            <ThemedPresearchCard>
              <ThemedPresearchHeader>
                <PresearchTitle>Add Label</PresearchTitle>
              </ThemedPresearchHeader>
              <PresearchContent>
                <div>
                  {/* <FontAwesome
                    style={{ color: 'green' }}
                    inverse={false}
                    name="plus-square"
                  /> */}
                </div>
              </PresearchContent>
            </ThemedPresearchCard>
          </Container>
          {!labelsToAdd.length && !labelsToRemove.length
            ? `Select labels to update ${recordsTotal} studies`
            : ''}
          <CrumbsBarStyleWrapper className="crumbs-bar">
            {labelsToAdd.length ? ' Add: ' : ''}
            {labelsToAdd.length
              ? Object.keys(groupedByLabel.toAdd).map(label => (
                  <MultiCrumb
                    key={label}
                    category={label}
                    values={groupedByLabel.toAdd[label]}
                    onClick={value =>
                      this.handleRemoveCrumb(label, value, true)
                    }
                  />
                ))
              : null}
            {labelsToRemove.length ? ' Remove: ' : ''}
            {labelsToRemove.length
              ? Object.keys(groupedByLabel.toRemove).map(label => (
                  <MultiCrumb
                    key={label}
                    category={label}
                    values={groupedByLabel.toRemove[label]}
                    onClick={value =>
                      this.handleRemoveCrumb(label, value, false)
                    }
                  />
                ))
              : null}
            {labelsToAdd.length || labelsToRemove.length
              ? `on ${recordsTotal} studies`
              : ''}
          </CrumbsBarStyleWrapper>

          <ButtonToolbar>
            <ThemedButton
              onClick={() =>
                commit(
                  labelsToAdd,
                  labelsToRemove,
                  buildDescription({
                    groupedByLabel,
                    recordsTotal,
                  })
                ).then(() =>
                  this.setState({ labelsToRemove: [], labelsToAdd: [] })
                )
              }>
              Save
            </ThemedButton>
            {labelsToAdd.length || labelsToRemove.length ? (
              <ThemedButton
                bsStyle="danger"
                onClick={() =>
                  this.setState({ labelsToAdd: [], labelsToRemove: [] })
                }>
                Clear
              </ThemedButton>
            ) : null}
          </ButtonToolbar>
        </PanelContainer>
        <ToastContainer>
          {undoHistory.length
            ? undoHistory.map(({ description, undoActions }, idx) => (
                <Toast
                  message={description}
                  buttons={[
                    {
                      label: 'UNDO',
                      onClick: () => {
                        handleUndo(undoActions, idx);
                      },
                    },
                  ]}
                />
              ))
            : null}
        </ToastContainer>
      </MainContainer>
    );
  }
}

export default BulkEditView;
