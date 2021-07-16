import { createGlobalStyle } from 'styled-components';
import withTheme, { Theme } from 'containers/ThemeProvider/ThemeProvider';
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
  background: ${(props:any) => props.theme.crumbs.crumbBackground};
}
.btn, button, .-btn{
  border: 0px;
  font-family: 'Lato', Arial, sans-serif !important;
}
.labeled-btn{
  margin: 0 0.5em 0.5em 0;
}
.btn, .-btn{
  background: ${(props:any) => props.theme.crumbs.crumbBackground};
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
  overflow: hidden;
  
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
  background-color: rgba(111,41,97,.1);
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
  background-color: rgba(0,41,97,.1);
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
`);
