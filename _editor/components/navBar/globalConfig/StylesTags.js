import styled from 'styled-components';
import { FormGroup } from "react-bootstrap";
import { PRIMARY_BLUE } from "../../../../sass/general/constants";

export const Keywords = styled(FormGroup)`
/* Example Styles for React Tags*/
div.ReactTags__tags {
    position: relative;
}

/* Styles for the input */
div.ReactTags__tagInput {
    width: 100%;
    border-radius: 2px;
    display: inline-block;
}

 input.ReactTags__tagInputField {
   margin-top: 5px; 
   display: block;
   width: 100%;
   height: 34px;
   padding: 6px 12px;
   font-size: 14px;
   line-height: 1.42857143;
   color: #555;
   background-color: #fff;
   background-image: none;
   border: 1px solid #ccc;
   border-radius: 4px;
   -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
           box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
   -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
        -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
           transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
 }
 input.ReactTags__tagInputField:focus {
   border-color: #66afe9;
   outline: 0;
   -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);
           box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);
 }
  input.ReactTags__tagInputField::-moz-placeholder {
   color: #999;
   opacity: 1;
 }
  input.ReactTags__tagInputField:-ms-input-placeholder {
   color: #999;
 }
  input.ReactTags__tagInputField::-webkit-input-placeholder {
   color: #999;
 }
  input.ReactTags__tagInputField::-ms-expand {
   background-color: transparent;
   border: 0;
 }




/* Styles for selected tags */
div.ReactTags__selected span.ReactTags__tag {
    border: 0! important;
    color: white;
    background-color: ${PRIMARY_BLUE};
    display: inline-block;
    padding: 4px 8px;
    height:  auto;
    margin: 3px 5px;
    cursor: move;
    border-radius: 0;
}
div.ReactTags__selected a.ReactTags__remove {
    color: white;
    margin-left: 5px;
    cursor: pointer;
    opacity: 0.5;
}

div.ReactTags__selected a.ReactTags__remove:hover {
    opacity: 1;
}


/* Styles for suggestions */
div.ReactTags__suggestions {
    position: absolute;
}
div.ReactTags__suggestions ul {
    list-style-type: none;
    box-shadow: .05em .01em .5em rgba(0,0,0,.2);
    background: white;
    width: 200px;
}
div.ReactTags__suggestions li {
    border-bottom: 1px solid #ddd;
    padding: 5px 10px;
    margin: 0;
}
div.ReactTags__suggestions li mark {
    text-decoration: underline;
    background: none;
    font-weight: 600;
}
div.ReactTags__suggestions ul li.ReactTags__activeSuggestion {
    background: #b7cfe0;
    cursor: pointer;
}
`;
