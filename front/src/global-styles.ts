import { createGlobalStyle } from 'styled-components';
import withTheme, { Theme } from 'containers/ThemeProvider/ThemeProvider';
/* eslint no-unused-expressions: 0 */

export default withTheme(createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400&family=Montserrat:ital,wght@0,400;0,700;1,400&display=swap');
body {
  height: 100%;
  width: 100%;
}
body {
  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background-color: #eaedf4;

}
body.fontLoaded {
  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
p,
label {
  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.5em;
}
.hr {
  background: ${(props:any) => props.theme.crumbs.crumbBackground};
}
.btn, button, .-btn{
  border: 0px;
  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
  border-radius: 4px;
}
.btn, .-btn{
  background: ${(props:any) => props.theme.crumbs.crumbBackground};
  color: #fff !important;
}
.crumb-container {
  border: 2px solid ${props => props.theme.crumbs.crumbBackground};
  border-radius: 4px;
  padding: 0 5px 0 5px;
  margin: 1px;
  background: ${props => props.theme.crumbs.crumbBackground};
  color: ${props => props.theme.crumbs.crumbFont} !important;
  line-height: 1.85em;
}
.crumb-wrapper{
  display: flex;
  flex-wrap:wrap;
}
.list-group-item {
  position: relative;
  display: block;
  padding: 10px 15px;
  margin-bottom: -1px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
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

.react-autosuggest__input::placeholder {
  color: black
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
.mm-single-line{
  display: flex;
}
.mm-single-line .mail-merge-island{
  padding-right: 1em;
}

.mail-merge pre {
  background-color: white;
  border: 0px;
  padding: 0px;
  font-family:inherit;
}
.mail-merge pre code {
  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 13px;
}
#ellipses:hover ~ .ellipsed-text{
  display:inline-block;
}
#ellipses:hover{
  color:white;
  font-size: 16px;
}
.ellipsed-text {
  display:none;
}
`);
