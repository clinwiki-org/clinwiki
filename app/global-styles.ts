import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
html,
body {
  height: 100%;
  width: 100%;
}

body {
  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

body.fontLoaded {
  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

p,
label {
  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.5em;
}

.btn, button, .-btn{
  border: 0px;
  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
  border-radius: 4px;
}

.btn, .-btn, div.rt-tbody div.rt-tr:hover, div.crumbs-bar span.label{
  background: #55B88D !important;
  color: #fff !important;
}

/* Pagination */

div.pagination-bottom div.-pagination{
  padding: 0px !important;
  margin-top: 10px;
  border: 0px;
  box-shadow: none !important;
}

div.-previous{
  border: 0px;
}

/* Tables */

div.rt-td, div.ReactTable{
  border: 0px;
}

.rt-table, table{
  background: #fff;
}

div.rt-table div.rt-tr-group div.rt-tr.-odd, .table-striped tr:nth-of-type(2n+1) td{
  background: #f1f3f6;
}

.table-striped tr:nth-of-type(2n-1) th{
  background: #fff;
}

.table-striped tr:nth-of-type(2n) th{
  background: #f1f3f6;
}

::placeholder {
  color: rgba(255,255,255,.6);
  opacity: 1;
}

:-ms-input-placeholder {
  color: #fff;
}

::-ms-input-placeholder {
  color: #fff;
}

div.DraftEditor-editorContainer{
  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

#divsononeline {
   display: inline-block;
   vertical-align: middle;
}

#navbuttonsonstudypage {
   display: inline-block;
   vertical-align: super;
}

`;
