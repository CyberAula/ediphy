import React from "react";
import { DataTable } from 'react-datatable-bs';
require('react-datatable-bs/css/table-twbs.css');

export default class TableComponent extends React.Component {
    render() {
        let data = this.props.data;
        let options = this.props.options;
        let keys = Object.keys(this.props.data[0]);
        let cols = [];
        keys.map(key =>{
            cols.push({ title: key, prop: key });
        });
        options.pageLengthOptions = [5, 10, 100];
        options.pageLengthOptions = options.pageLengthOptions.filter(a => a <= data.length);
        if (!isNaN(options.initialPageLength) && options.pageLengthOptions.indexOf(options.initialPageLength) === -1) {
            options.pageLengthOptions = this.insert(options.initialPageLength, options.pageLengthOptions);
        }
        return (
            <div className="tableContainer">
                <DataTable
                    keys="name"
                    columns={cols}
                    initialData={data}
                    initialPageLength={options.initialPageLength || 5}
                    disablePagination={options.disablePagination}
                    disableFilter={options.disableFilter}
                    disableRowChoice={options.disableRowChoice}
                    pageSizeLabel={options.pageSizeLabel}
                    searchLabel={options.searchLabel}
                    searchPlaceholder={options.searchPlaceholder}
                    pageLengthOptions={options.pageLengthOptions}
                    initialSortBy={{ prop: options.initialSort, order: options.initialOrder } /* { prop: cols[0].title, order: 'descending' }*/}
                />
            </div>

        );

    }
    insert(element, array) {
        array.splice(this.locationOf(element, array) + 1, 0, element);
        return array;
    }

    locationOf(element, array, start, end) {
        start = start || 0;
        end = end || array.length;
        let pivot = parseInt(start + (end - start) / 2, 10);
        if (end - start <= 1 || array[pivot] === element) {return pivot;}
        if (array[pivot] < element) {
            return this.locationOf(element, array, pivot, end);
        }
        return this.locationOf(element, array, start, pivot);

    }

}
