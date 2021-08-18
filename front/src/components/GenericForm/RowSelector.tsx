
import { routerMiddleware } from 'connected-react-router';
import React, {useEffect, useState, useMemo} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
// import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
import {useTable, useFilters, useSortBy, useGlobalFilter, useAsyncDebounce} from 'react-table';
import styled from 'styled-components'
import { BeatLoader } from 'react-spinners'
import GlobalFilter from './globalFilter';
import {matchSorter} from 'match-sorter'

const Styles = styled.div `
  table {
    width: 100%;
    border-spacing: 0;
    border: 1px solid #444;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    .cw-cell {
      max-height: 125px;
      overflow:scroll;
    }
    .t-row {
      cursor: pointer;
      max-height: 200px;
      // overflow-y: hidden;
    }
    .t-row:hover {
      background: #6ba5d6;
    }
    th,
    td {
      margin: 0;
      padding: 1rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      max-width: 300px;
      :last-child {
        border-right: 0;
      }
    }
  }
`

function fuzzyTextFilterFn(rows, id, filterValue) {
  //@ts-ignore
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val
// import 'rsuite-table/dist/css/rsuite-table.css'

const RowSelector = ({data, selectRow, setIsForm, isForm, columns, isLoading}) => {
  const {getTableProps, preGlobalFilteredRows, state, getTableBodyProps, headerGroups, rows, prepareRow, preGlobalFilterRows, setGlobalFilter} = useTable({columns, data}, useFilters, useGlobalFilter, useSortBy)
  // const [filterInput, setFilterInput] = useState("")
  // const [globalFilter, setGlobalFilter] = useState("")
  // const [value, setValue] = React.useState(globalFilter)
  // const count = preGlobalFilteredRows.length
  const onRowClick  = (rowId) => {
    selectRow(rowId)
    setIsForm(!isForm)
  }

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

 
  if (!data || isLoading) {
  return <BeatLoader />
}

  return (
    <Styles>
      <div>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />      
      <table {...getTableProps()}>

        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup
                .headers
                .map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} 
                  className={
                    column.isSorted
                      ? column.isSortedDesc
                        ? "sort-desc"
                        : "sort-asc"
                      : ""
                  }
                  
                  >{column.render('Header')}</th>
                ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr className="t-row" {...row.getRowProps()} onClick={() => onRowClick(row.original.id)}>
                {row
                  .cells
                  .map(cell => {
                    return <td {...cell.getCellProps()}><div className="cw-cell">{cell.render('Cell')}</div></td>
                  })}
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
    </Styles>
  )
}

export default RowSelector