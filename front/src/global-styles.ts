import withTheme, { Theme } from 'containers/ThemeProvider/ThemeProvider';

import { createGlobalStyle } from 'styled-components';
import iconsMembership from './images/org_icons_membership.png';

/* eslint no-unused-expressions: 0 */

export default withTheme(createGlobalStyle`

body {
  height: 100%;
  width: 100%;
}
body {
  font-family: 'Lato', Arial, sans-serif;
  background-color: #eaedf4;

}
body.fontLoaded {
  font-family: 'Lato', Arial, sans-serif;
}
p,
label {
  font-family: 'Lato', Arial, sans-serif;
  line-height: 1.5em;
}
.hr {
  background: ${(props: any) => props.theme.crumbs.crumbBackground};
}
.btn, button, .-btn{
  border: 0px;
  font-family: 'Lato', Arial, sans-serif !important;
}
.labeled-btn{
  margin: 0 0.5em 0.5em 0;
}
.btn, .-btn{
  background: ${(props: any) => props.theme.crumbs.crumbBackground};
  color: #fff !important;
  padding: 10px 15px;
  display: inline-block;
  padding: 6px 12px;
  margin: 0 0.5em 0.5em 0;
  font-size: 11px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  border-radius: 1px;
  -webkit-transition: 0.5s;
  transition: 0.5s;
  height: 38px;
}
#dropdown-basic-default{
  text-align: left;
}
.btn .caret{
  position: absolute;
  right: 1em;
  top: 50%;
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
.crumb-container2 {
  border: 2px solid ${props => props.theme.crumbs2.crumbBackground2};
  border-radius: 8px;
  padding: 0 5px 0 5px;
  margin: 1px;
  background: ${props => props.theme.crumbs2.crumbBackground2};
  color: ${props => props.theme.crumbs2.crumbFont2} !important;
  line-height: 1.85em;
  .mail-merge-island{
    display: inline-block;
  }
}
.crumb-container3 {
  border: 2px solid ${props => props.theme.crumbs3.crumbBackground3};
  border-radius: 8px;
  padding: 0 5px 0 5px;
  margin: 1px;
  background: ${props => props.theme.crumbs3.crumbBackground3};
  color: ${props => props.theme.crumbs3.crumbFont3} !important;
  line-height: 1.85em;
}
.crumb-container4 {
  border: 2px solid ${props => props.theme.crumbs4.crumbBackground4};
  border-radius: 8px;
  padding: 0 5px 0 5px;
  margin: 1px;
  background: ${props => props.theme.crumbs4.crumbBackground4};
  color: ${props => props.theme.crumbs4.crumbFont4} !important;
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
.mm-flex-row{
  display: flex;
  flex-wrap: wrap;
  padding: 1em;
  position: relative;
}
.mm-flex-row .active-btn{
  margin-bottom: 0.5em;
  position: relative;
  padding: 7px;
  font-size: 11px;

}
.active-btn{
  margin: 0 0.5em 0.5em 0;

}
.text-l{
  font-size: 16px;
}
.text-s{
  font-size: 8px;
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
.cards-container{
  display: flex;
  flex-wrap:wrap;

}
.mm-card{
  width: 80%;
  min-height: 225px;
  max-height: 350px;
  margin: 15px;
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.7);
  background: #ffffff;
  padding: 5px;
  display: flex;
  overflow: hidden;
  margin:auto;
  
  a {
    ${props => props.theme.button};
  }


 .mail-merge {
   position: relative;
 }
}

.mm-card2 {
  max-width: 350px;
  min-height: 350px;
  max-height: 350px;
  margin: 15px;
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
  background: #ffffff;
  padding: 5px;
  display: flex;
  flex-wrap:wrap;
  position: relative;
  overflow: scroll;
  
  a {
    ${props => props.theme.button};
  }

 .mail-merge {
   position: relative;
 }
 
 .mm-card-inner {
  //  overflow: hidden;
   height: 100%;
   width: 100%;
 }

}

.mm-card3 {
  max-width: 350px;
  min-height: 350px;
  max-height: 350px;
  margin: 15px;
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
  background: #ffffff;
  padding: 5px;
  display: flex;
  flex-wrap:wrap;
  position: relative;
  
  a {
    ${props => props.theme.button};
  }

 .mail-merge {
   position: relative;
 }
 
 .mm-card-inner {
  //  overflow: hidden;
   height: 100%;
   width: 100%;
 }

}

  ///TOOL TIPS

  .mm-tooltip {
    position: relative;
    display: inline-block;
    z-index: 10000;
    font-size: medium;
  }
  
  .mm-tooltip .mm-tooltiptext {
    visibility: hidden;
    background: rgba(0,0,0,.7);
    color: #fff;
    text-align: center;
    border-radius: 6px;
    position: absolute;
    z-index: 1;
    opacity: 0;
    transition: .5s;
    padding: 5px;
    font-size: 8px;
  }
  
  .mm-tooltip:hover .mm-tooltiptext {
    visibility: visible;
    position: absolute;
    opacity: 1;
  }

  .mm-tooltip-tr {
    top: -25px;
    right: -60px;
  }

  .mm-tooltip-br{
    right: -100px;
  }

  .mm-tooltip-bl{
    left: -60px;
  }

  .mm-tooltip-tl{
    left: -60px;
    top: -25px;
  }

//// GRID WORK

.grid-container{
  // display: flex;
  width:100vw;
  height:100vh;
}
.grid {
  display: grid;
  grid-template-areas:
    "one one two two"
    "one one two two"
    "three three four four"
    "three three four four";
  gap: 10px;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 100px);
  inline-size: 500px;
    margin: 1em;

}

.grid > * {
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;
}
.grid2 {

  display: grid;
  grid-template-areas:
    "one one two two"
    "one one two two"
    "three three four four"
    "three three four four";
  gap: 10px;
  grid-template-columns: repeat(4, 25px);
  grid-template-rows: repeat(4, 25px);
  height:95%;
  width:95%;
/*   inline-size: 500px; */
}

.grid2 > * {
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;
}

.grid3 {
  display: grid;
  grid-template-areas:
    "one two two two"
    "one two two two"
    "one three three three"
    "one three three three";
  gap: 10px;
  grid-template-columns: 25em 1fr;
  // grid-template-rows: repeat(4, 100px);
  inline-size: 500px;
  margin: 1em;
  width: 98vw;

}

.grid3 > * {
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;
}
.grid4 {
  display: grid;
  grid-template-areas:
    "two two two two"
    "two two two two"
    "three three three three"
    "three three three three";
  gap: 10px;
  // grid-template-columns: repeat(4, 1fr);
  // grid-template-rows: repeat(4, 100px);
  inline-size: 500px;
  margin: 1em;
  width: 98vw;


}

.grid4 > * {
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;
}
.one {
  grid-area: one;
}

.two {
  grid-area: two;
}

.three {
  grid-area: three;
}
.four {
  grid-area: four;
}

.grid > .five {
  background-color: orange;
  grid-row: 2 / 4;
  grid-column: 2 / 4;
}

.loader-container {
  position: relative;
}
.subgrid{
  display: grid;
   grid-template-areas:
     "a1 a2 a3 a4"
     "b1 b2 b3 b4"
     "c1 c2 c3 c4"
 }
.card-subgrid{
  display: grid;
   grid-template-areas:
     "a1 a2 a3 a4"
     "b1 b2 b3 b4"
     "c1 c2 c3 c4"
     "d1 d2 d3 d4"
     "e1 e2 e3 e4"
     "f1 f2 f3 f4"
 }
 .a1 {
   grid-area: a1;
 }
 .a2 {
    grid-area: a2;
 }
 .a3 {
    grid-area: a3;
 }
 .a4 {
    grid-area: a4;
 }
 
 .b1 {
   grid-area: b1;
 }
 .b2 {
    grid-area: b2;
 }
 .b3 {
    grid-area: b3;
 }
 .b4 {
    grid-area: b4;
 }
 
 .c1 {
   grid-area: c1;
 }
 .c2 {
    grid-area: c2;
 }
 .c3 {
    grid-area: c3;
 }
 .c4 {
    grid-area: c4;
 }
 .d1 {
   grid-area: d1;
 }
 .d2 {
    grid-area: d2;
 }
 .d3 {
    grid-area: d3;
 }
 .d4 {
    grid-area: d4;
 }
 .e1 {
  grid-area: e1;
}
.e2 {
   grid-area: e2;
}
.e3 {
   grid-area: e3;
}
.e4 {
   grid-area: e4;
}
.f1 {
  grid-area: f1;
}
.f2 {
   grid-area: f2;
}
.f3 {
   grid-area: f3;
}
.f4 {
   grid-area: f4;
}
 
 .right {
   text-align: right
 }
 
 .left {
   text-align: left
 }
 .no-filter{
  display: flex;
  height: 3em;
  margin: auto;
  width: 100%;
  /* top: auto; */
  overflow: hidden;
  bottom: auto;
  span{
    display: flex;
    margin:auto;
  }
 }
 .mail-merge .three.loader-container.subgrid .mail-merge-island div:nth-child(1) {
    display: flex;
    flex-wrap: wrap;
  }
  .disabled-btn {
    background-color: #b4b4b4 !important;
    cursor: not-allowed;
    pointer-events: none;
  }
  .search-container {
    position: relative;
    z-index: 10;
    max-width: 100%;
    margin: auto;
    margin-right: 50px;
  }
  .search-form {
    margin-bottom: 10px;
  }
  .search-box-wrapper {
    display: block;
    max-width: 1000px;
    margin: auto;
  }
  .search-container input[type=text] {
    position: relative;
    z-index: 10;
    outline: none;
    width: 100%;
    max-width: none;
    height: 60px;
    padding: 10px 20px;
    font-size: 218.75%;
    margin: 0px;
  }
  .search-container input[type=text] {
    @media (max-width: 854px) {
      font-size: 175%;
      height: 48px;
      padding: 8px 14px;
    }
    @media (max-width: 640px) {
      font-size: 105%;
      height: 35px;
      padding: 8px 14px;
    }
  }
  .dis-autocomplete-bottom .buttons a.paginator.disabled {
    border: 1px solid #eeeeee;
    color: #eeeeee;
  }
  .reset-button {
    font-size: 15px;
  }
  .reset-button:hover {
    transform: scale(1.05);
    transition-duration: 0.1s;
    background: #1B2A38;
  }
  article.main {
    max-width: 1400px;
    margin: 30px auto 0;
    padding: 0 20px;
  }
  .view-organization h1 {
    font-size: 250%;
    color: #00083d;
    line-height: 1.2rem;
  }
  .view-organization #datasection11 {
    float: left:
    width: 100%;
    heigh: 0px;
  }
  .view-organization .brochure_container {
    min-width: 200px;
    postion: relative;
    top: -66px;
    float: right;
  }
  .view-organization .brochure_container a {
    float: right;
    margin-left: 10px;
  }
  a.button-default.icon-right {
    padding-right : 20px;
  }
  a.button-default-green {
    background-color: #2e8939;
  }
  main.org_content {
    overflow: hidden;
    width: 100%;
  }
  .edit_links_section {
    position: relative;
    padding-right: 30px;
  }
  .logo_and_details {
    float: left;
    width: 63%;
  }
  .logo_container {
    float: left;
    width: 230px;
    padding-right: 30px;
  }
  #dataSection10 {
    height: 190px;
    position: relative;
    padding: 10px;
    background-color: #fcfcfc;
    border: 1px solid #f1f1f1;
  }
  .logo_box {
    background-color: transparent;
    background-size: contain;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    width: auto;
    height: 100%;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
  }
  .meta_lists {
    margin-top: 10px;
  }
  .meta_lists span {
    font-size: 87.5%;
  }
  .meta_lists span.label {
    color: #6c6c6c;
    white-space: unset;
  } 
  .meta_lists span.value {
    color: black;
  } 
  .org_info_box {
    margin: 0 0 0 230px;
  }
  .fixed_width_strings {
    max-width: 100%;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    vertical-align: bottom;
  }
  main.org_content div.org_intro div.org_meta_info {
    float: left;
    width: 37%;
    padding-left: 40px;
  }
  .org_meta_info.org_financials {
    float: left;
    width: 25%;
    padding-left: 60px;
    line-height: 150%;
  }
  .field-row {
    margin-bottom: 15px;
  }
  span.clarify {
    color: #999999;
    font-size: 90%;
    display: block;
  }
  .org_intro {
    overflow: hidden;
    margin-bottom: 30px;
  }
  div.right_column.org_meta_info {
    float: right;
    width: 37%;
    padding-left: 20px;
  }
  div.meta_info.org_financials div.entries {
    width: 280px;
    position: relative;
    overflow: hidden;
  }
  div.meta_info.org_financials div.entries span.entry:nth-child(1) {
    margin-top: 67px;
    margin-left: 0px;
  }
  div.meta_info.org_financials div.entries span.entry {
    display: block;
    float: left;
    background-color: #8CB7D7;
    width: 48%;
    max-width: 155px;
    height: 125px;
    border-top-right-radius: 40px;
    border-bottom-left-radius: 40px;
    margin-left: 5px;
    text-align: center;
    position: relative;
    -moz-transition: background-color 0.5s cubic-bezier(0, 0, 0, 1) 0s;
    -o-transition: background-color 0.5s cubic-bezier(0, 0, 0, 1) 0s;
    -webkit-transition: background-color 0.5s cubic-bezier(0, 0, 0, 1);
    -webkit-transition-delay: 0s;
    transition: background-color 0.5s cubic-bezier(0, 0, 0, 1) 0s;
  }
  span.entry span.wrapper {
    position: relative;
    left: 50%;
    top: 50%;
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    display: block;
  }
  div.entries span.entry span.wrapper span.value {
    display: block;
    color: white;
    font-size: 125.5%;
    margin-bottom: 5px;
  }
  div.entries span.entry span.wrapper span.label {
    display: block;
    line-height: 20px;
    font-size: 100%;
    padding: 0px 5px;
    color: #323232;
  }
  div.meta_info.org_financials div.entries span.entry:nth-child(2) {
    border-top-right-radius: 0px;
    border-bottom-left-radius: 0px;
    border-top-left-radius: 40px;
    border-bottom-right-radius: 40px;
    margin-bottom: 5px;
  }
  div.meta_info.org_membership div.entries {
    position: relative;
    width: 270px;
  }
  div.meta_info.org_membership div.entries span.entry {
    display: block;
    background: #8CB7D7;
    height: 154px;
    margin-bottom: 10px;
    position: relative;
    text-align: center;
    -moz-transition: background-color 0.5s cubic-bezier(0, 0, 0, 1) 0s;
    -o-transition: background-color 0.5s cubic-bezier(0, 0, 0, 1) 0s;
    -webkit-transition: background-color 0.5s cubic-bezier(0, 0, 0, 1);
    -webkit-transition-delay: 0s;
    transition: background-color 0.5s cubic-bezier(0, 0, 0, 1) 0s;
  }
  div.meta_info.org_membership div.entries span.entry:nth-child(1) span.wrapper {
    top: 38%;
  }
  div.meta_info.org_membership div.entries span.entry span.wrapper {
    position: relative;
    left: 50%;
    top: 50%;
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    display: block;
    width: 90%;
  }
  div.meta_info.org_membership div.entries span.entry span.wrapper span.label {
    display: block;
    line-height: 20px;
    font-size: 100%;
  }
  div.meta_info.org_membership div.entries span.entry:nth-child(1):after {
    content: '';
    display: block;
    position: relative;
    left: 50%;
    -moz-transform: translate(-50%, 0%);
    -ms-transform: translate(-50%, 0%);
    -webkit-transform: translate(-50%, 0%);
    transform: translate(-50%, 0%);
    position: absolute;
    width: 80px;
    height: 80px;
    border-radius: 75px;
    background: url(${iconsMembership}) 50% 12px no-repeat #8CB7D7;
    border: 10px solid white;
    bottom: -47.5px;
    z-index: 100;
  }
  div.left_column {
    float: right;
    width: 63%;
  }
  div.left_column div.what_we_do_box {
    padding: 20px;
    background: #F9F9F9;
    float: left;
    width: 100%;
  }
  div.left_column div.what_we_do_box h2.title {
    margin-bottom: 30px;
    margin-top: 0px;
  }
  div.what_we_do_box .field-row span.service.active {
    color: #323232;
  }
  div.left_column div.what_we_do_box .field-row {
    margin-bottom: 0px;
    float: left;
    width: 100%;
  }
  div.left_column div.what_we_do_box .field-row span.service.active:before {
    content: '\f058';
    opacity: 1;
  }
  div.left_column div.what_we_do_box .field-row span.service:before {
    content: '\f10c';
    font-size: 100%;
    font-family: FontAwesome;
    opacity: 0.3;
    position: absolute;
    top: 0px;
    left: 20px;
    display: inline-block;
    width: 27px;
    height: 24px;
  }
  div.left_column div.what_we_do_box .field-row span.service {
    float: left;
    width: 50%;
    position: relative;
    padding-left: 45px;
    box-sizing: border-box;
    display: block;
  }
  div.what_we_do_box .field-row span.service {
    color: #999999;
    line-height: 2;
  }
  div.left_column .org_info_extras {
    float: left;
    width: 100%;
  }
  div.left_column .org_info_extras div.resources {
    clear: left;
  }
  main.org_content .edit_links_section {
    position: relative;
    padding-right: 30px;
  }
  .org_info_extras h2 {
    margin-bottom: 30px;
  }
  .org_info_extras div.resources div.view div.entry {
    margin-bottom: 30px;
    border-bottom: 1px solid #f1f1f1;
    padding-bottom: 30px;
  }
  main.org_content div.additional_org_info div.left_column .org_info_extras div.resources div.view div.entry a.primary-link {
    font-size: 112.5%;
    margin-bottom: 5px;
    display: inline-block;
    position: relative;
  }
  .smaller_text.intro p {
    margin-bottom: 30px;
  }
  div.left_column .org_info_extras div.resources div.view div.entry div.meta_info {
    color: #6c6c6c;
    font-size: 87.5%;
    line-height: 1.6;
  }
  .org_info_extras div.resources div.view div.entry div.meta_info span.label {
    color: #393939;
    display: inline-block;
    float: left;
    font-size: 100%;
  }
  div.left_column .org_info_extras div.resources div.view div.entry div.meta_info span.value {
    margin-left: 130px;
    display: block;
  }
  .org_info_extras div.resources div.view div.entry div.description {
    margin-left: 130px;
  }
  .org_info_extras div.resources div.helper_content.actions {
    margin-bottom: 30px;
    background: #f8f8f8;
    padding: 5px 10px;
    overflow: hidden;
  }
  .org_info_extras div.resources div.helper_content.actions span.summary {
    font-size: 87.5%;
    float: right;
    white-space: nowrap;
  }
  div.right_column.org_meta_info div.meta_info.org_membership {
    float: left;
    width: 100%;
  }
  div.right_column.org_meta_info .field-row {
    margin-bottom: 30px;
  }
  div.right_column.org_meta_info div.meta_info.org_membership div.entries span.entry:nth-child(2):after {
    content: '';
    display: block;
    position: relative;
    left: 50%;
    -moz-transform: translate(-50%, 0%);
    -ms-transform: translate(-50%, 0%);
    -webkit-transform: translate(-50%, 0%);
    transform: translate(-50%, 0%);
    position: absolute;
    width: 80px;
    height: 80px;
    border-radius: 75px;
    background: url(${iconsMembership}) 50% -394px no-repeat #8CB7D7;
    border: 10px solid white;
    bottom: -47.5px;
    z-index: 100;
  }
  div.right_column.org_meta_info div.meta_info.org_membership div.entries span.entry:nth-child(3):after {
    content: '';
    display: block;
    position: relative;
    left: 50%;
    -moz-transform: translate(-50%, 0%);
    -ms-transform: translate(-50%, 0%);
    -webkit-transform: translate(-50%, 0%);
    transform: translate(-50%, 0%);
    position: absolute;
    width: 80px;
    height: 80px;
    border-radius: 75px;
    background: url(${iconsMembership}) 50% -190px no-repeat #8CB7D7;
    border: 10px solid white;
    bottom: -47.5px;
    z-index: 100;
  }
  div.additional_org_info div.right_column.org_meta_info div.meta_info.org_info div.entries span.entry {
    color: white;
    display: inline-block;
    margin: 3px;
    background: black;
    padding: 3px 10px;
    -moz-transition: background-color 0.5s cubic-bezier(0, 0, 0, 1) 0s, color 0.5s cubic-bezier(0, 0, 0, 1) 0s;
    -o-transition: background-color 0.5s cubic-bezier(0, 0, 0, 1) 0s, color 0.5s cubic-bezier(0, 0, 0, 1) 0s;
    -webkit-transition: background-color 0.5s cubic-bezier(0, 0, 0, 1), color 0.5s cubic-bezier(0, 0, 0, 1);
    -webkit-transition-delay: 0s, 0s;
    transition: background-color 0.5s cubic-bezier(0, 0, 0, 1) 0s, color 0.5s cubic-bezier(0, 0, 0, 1) 0s;
  }
`);
