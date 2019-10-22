import styled from 'styled-components';

export const TableContainer = styled.div`
    overflow: auto;
    .table {
        margin-bottom: 1.2em;
    }

    .form-control {
        height: 2.2em;
        padding: 0.4em 0.9em;
        font-size: 1em;
    }
    .container {
        padding-right: 1em;
        padding-left: 1em;
        margin-right: auto;
        margin-left: auto;
    }
    .pagination {
        margin: 1.2em 0;
    }
    .pagination > .active > a, .pagination > .active > a:hover, .pagination > .active > a:focus, .pagination > .active > span, .pagination > .active > span:hover, .pagination > .active > span:focus {
        background-color: #eee;
        color: #222;
    }
    .pagination > li > span {
        color: $blueprimary;
        border-color: #ddd;
    }
    .pagination > li > a {
        color: $blueprimary;
    }
    .pagination > .active > a, .pagination > .active > a:hover, .pagination > .active > a:focus, .pagination > .active > span, .pagination > .active > span:hover, .pagination > .active > span:focus {
        border-color: #ddd;
    }
    .pagination li {
        margin-left: 0px;
        width: 2.5em;
        svg {
            width: 1em;
            height: 1em;
            vertical-align: middle;
        }
    }
    & > .container > .row > div > div {
    text-align: left;
    }
    
    & > .container {
    width:100% !important
    }
    
    * {
        border-radius: 0px !important;
    }
    
    .table  {
        svg {
            width: 1em;
            height: 1em;
            vertical-align: middle;
        }
    }
    
    &.theme-striped {
        tr:nth-child(even){background-color: #f2f2f2}
    }
    
    &.theme-rows-only {
        table {
            border: none;
        }
        th {
            border-top: none;
            border-left: none;
            border-right: none;
        }
        td{
            border-left: none;
            border-right: none;
        }
        tr {
            border-left: none;
            border-right: none;
        }
    }
    
    &.theme-solid2 {
        table {
            border: none;
        }
        th {
            border-top: none;
            border-left: none;
            border-right: none;
            background-color: #00aaff;
        }
        td{
            border-left: none;
            border-right: none;
        }
        tr {
            border-left: none;
            border-right: none;
        }
    }
    
    &.theme-thick, &.theme-solid {
        table, tr, td, th {
            border: 0.2em solid black;
        }
        th {
            border-bottom: no
        }
        tr:first-child {
            border-bottom: none;
      
    }
    
    &.theme-solid {
        th {
            background-color: #ccc;
        }
    }
    
    .table > thead > tr > th, .table > thead > tr > td, .table > tbody > tr > th, .table > tbody > tr > td, .table > tfoot > tr > th, .table > tfoot > tr > td {
        padding: 0.4em;
        line-height: 1.42857em;
        vertical-align: top;
        border-top: 0.07em solid #ddd;
    }
    
    .col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {
        position: relative;
        min-height: 1px;
        padding-right: 1em;
        padding-left: 1em;
    }
    
    .row {
        margin-right: -1em;
        margin-left: -1em;
    } 
    
    .pagination > li > a, .pagination > li > span {
        position: relative;
        float: left;
        padding: 0.4em 0.9em;
        margin-left: -0.1em;
    }
`;

export const TablePreviewContainer = styled.div.attrs({
    id: 'chartContainer' })`
        margin-right: -10px;
        margin-left: 0px;
        cursor: not-allowed;
        table{
            border-collapse: collapse;
        }
`;

export const PreviewOverlay = styled.div.attrs({ id: 'previewOverlay' })`
        width: 100%;
        height: 100%;
        position: absolute;
        cursor: not-allowed;
        top:0;
        left: 0;
`;
