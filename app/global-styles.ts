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

#app {
  background-color: #4d5863;
  min-height: 100%;
  min-width: 100%;
}

#search-main, #study-main{
  background-color: #eaedf4;
  min-height: 100vh;
  padding-top: 20px;
  padding-bottom: 20px;
}

/* Search Sidebar */

#search-sidebar{
  padding: 0px !important;
  box-sizing: border-box;
}

#search-sidebar div.panel-title a:hover{
  text-decoration: none;
  color: #fff;
}

#search-sidebar div.panel.panel-default, #search-sidebar div.panel.panel-default div.panel-heading{
  box-shadow: 0px;
  border: 0px;
  background: none;
  color: #fff;
  text-transform: capitalize;
}

#search-sidebar div.panel.panel-default div.panel-collapse{
  background: #394149
}

#search-sidebar div.panel.panel-default div.panel-collapse div.panel-body{
  padding-left: 10px;
  color: rgba(255,255,255,.7)
}

#search-sidebar div.panel-title, #study-sidebar li a {
  font-size: 16px;
  color: #bac5d0;
}

#search-sidebar div.panel-title{
  padding: 0px 10px;
}

/* Study Sidebar */

div#study-sidebar{
  padding-right: 0px;
  color:  rgba(255,255,255,.5);
  padding-top: 20px !important;
}

#study-sidebar li a{
  border-bottom: 1px solid #4c545e;
  text-align: left;
}

#study-sidebar li a:hover{
  background: #394149;
  border-radius: 0px;
  color: #fff;
}

div.react-toggle-track{
  background: rgba(255,255,255,.1) !important;
}

div.react-toggle-thumb{
  border: 0px;
  background: #55b88d;
}

#study-main div.panel-heading, #search-main div.rt-table div.rt-th{
  background: #8BB7A4;
  color: #fff;
}

#study-main div.panel-heading{
  padding: 15px;
}

nav.navbar {
  background: #1b2a38;
  margin-bottom: 0px;
  border: 0px;
  border-radius: 0px;
}

nav.navbar a.logo{
  color: #fff;
}

a#logo{
  background: url("https://yellowrubberball.com/img/clinwiki-50.png") center left no-repeat;
  background-size: 25px 25px;
  margin-left: 1px;
  padding-left: 30px;
  color: #fff;
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

.btn, button, .-btn, div.rt-tbody div.rt-tr:hover, div.crumbs-bar span.label{
  background: #55B88D !important;
  color: #fff !important;
}

/* Crumbs Bar */

div.crumbs-bar.container{
  background: #d9deea;
  border: 0px;
  margin-top: 5px;
  color: #394149;
}

div.crumbs-bar i{
  font-style: normal;
  margin-right: 3px;
  text-transform: capitalize;
}

div.crumbs-bar span.label.label-default{
  padding: 7px !important;
  border-radius: 2px !important;
}

div.crumbs-bar div.row > div{
  padding-left: 0px;
}

div.crumbs-bar input.form-control{
  border: 0px;
  box-shadow: none;
  margin-right: 10px;
  margin-left: 10px;
}

div.crumbs-bar span.label{
  padding: 5px;
  font-size: 12px;
  border-radius: 4px;
  margin-right: 5px;
  text-transform: capitalize;
}

div.crumbs-bar span.label span.fa-remove{
  color: #fff !important;
  opacity: .5;
  margin-left: 5px !important;
}

div.crumbs-bar span.label b span.fa-remove:hover{
  opacity: 1;
}

div.crumbs-bar span.label b{
  padding-right: 5px;
}

div.crumbs-bar span.label b:last-of-type{
  padding-right: 0px;
}

div.crumbs-bar span.label{
  background: none;
}

div.sc-htpNat{
  padding: 10px 5px 10px 10px;
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

div.WikiToggle__ToggleWrapper-gRLMLc{
  margin-top: 20px;
  margin-bottom: 10px;
}

/* Tables */

div.rt-td, div.ReactTable{
  border: 0px;
}

.rt-table, table{
  background: #fff;
}

#search-main div.rt-table div.rt-th{
  text-transform: capitalize;
  padding: 15px;
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

/* Alerts */

div.alert{
  margin-top: 10px;
  border: 0px;
}

div.alert-success{
  background: #5d8890;
  color: #fff;
}

div.alert-danger{
  background: #af4545;
  color: #fff;
}

div.alert-danger li{
  background: none;
  border: 0px;
  color: #fff
}

div.alert-danger li b{
  text-transform: uppercase;
}

div.alert-danger li b:after{
  content: ":";
  margin-right: 5px;
}

/* Forms */

form.searchInput{
  padding-bottom: 10px;
}

nav.navbar input.form-control, #search-sidebar input.form-control{
  background: rgba(255,255,255,.3);
  border: 0px;
  color: #fff;
}

#password, #username, #passwordConfirmation{
  background: rgba(255,255,255,.2);
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
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

/* Wiki area */

div.DraftEditor-editorContainer{
  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

`;
