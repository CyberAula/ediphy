import React from "react";
import { DataTable } from 'react-datatable-bs';
require('react-datatable-bs/css/table-twbs.css');

export default class TableComponent extends React.Component {
    render() {
        let data = this.props.data;
        let options = this.props.options;
        // console.log(this.props);
        let keys = Object.keys(this.props.data[0]);
        let cols = [];
        keys.map(key =>{
            cols.push({ title: key, prop: key });
        });

        // console.log(cols);
        return (
            <div className="tableContainer">
                <DataTable
                    keys="name"
                    columns={cols}
                    initialData={data}
                    initialPageLength={options.initialPageLength}
                    disablePagination={options.disablePagination}
                    disableFilter={options.disableFilter}
                    disableRowChoice={options.disableRowChoice}
                    pageSizeLabel={options.pageSizeLabel}
                    searchLabel={options.searchLabel}
                    searchPlaceholder={options.searchPlaceholder}
                    initialSortBy={{ prop: cols[0].title, order: 'descending' }}
                />
            </div>

        );

    }

}
