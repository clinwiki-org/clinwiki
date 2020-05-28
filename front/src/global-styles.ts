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
.btn, .-btn{
  background: #55B88D;
  color: #fff !important;
}
div.crumbs-bar span.label {
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

/* Autosuggest */

.react-autosuggest__container {
  position: relative;
}

.react-autosuggest__input {
  width: 100%;
  height: 30px;
  padding: 10px 20px;
  font-family: Helvetica, sans-serif;
  font-weight: 300;
  font-size: 16px;
  border: 1px solid #aaa;
  border-radius: 4px;
  margin-right: 8px;
}

.react-autosuggest__input--focused {
  outline: none;
}

.react-autosuggest__input--open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.react-autosuggest__suggestions-container {
  display: none;
}

.react-autosuggest__suggestions-container--open {
  display: block;
  position: absolute;
  top: 28px;
  width: 100%;
  border: 1px solid #aaa;
  background-color: #fff;
  font-family: Helvetica, sans-serif;
  font-weight: 300;
  font-size: 14px;
  border-bottom: 1px solid black;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  z-index: 2;
}

.react-autosuggest__suggestions-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.react-autosuggest__suggestion {
  cursor: pointer;
  padding: 10px 20px;
}

.react-autosuggest__suggestion--highlighted {
  background-color: #ddd;
}

.react-autosuggest__section-container {
  border-top: 1px dashed #ccc;
}

.react-autosuggest__section-container--first {
  border-top: 0;
}

.react-autosuggest__section-title {
  padding: 10px 0 0 10px;
  font-size: 12px;
  color: #777;
}

.modal-container {
  position: relative;
}
.modal-container .modal, .modal-container .modal-backdrop {
  position: absolute;
}

`;
