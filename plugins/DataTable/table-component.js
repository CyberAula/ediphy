import React from "react";
import { DataTable } from 'react-data-components';
require('react-data-components/css/table-twbs.css');

export default class TableComponent extends React.Component {
    render() {
        let data = this.props.data;
        let options = this.props.options;
        console.log(this.props)
        let keys = Object.keys(this.props.data[0]);
        let cols = [];
        keys.map(key =>{
            cols.push({ title: key, prop: key  });
        });

        console.log(cols)
        return (
            <div className="tableContainer">
                <DataTable
                    keys="name"
                    columns={cols}
                    initialData={data}
                    initialPageLength={5}
                    initialSortBy={{ prop: 'name', order: 'descending' }}
                />
            </div>

        );

    }

}