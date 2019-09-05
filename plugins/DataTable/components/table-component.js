import React from "react";
import { DataTable } from 'react-datatable-bs';
require('react-datatable-bs/css/table-twbs.css');
/* eslint-disable react/prop-types */

export default class TableComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { key: 0 };
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.options &&
          nextProps.options.initialPageLength &&
          this.props.options && this.props.options.initialPageLength &&
          this.props.options.initialPageLength !== nextProps.options.initialPageLength) {
            this.setState({ key: this.state.key + 1 });
        }
    }
    render() {
        let data = this.props.data;
        let options = this.props.options;
        let realKeys = this.props.keys;
        let cols = [];
        realKeys.forEach((key, i) =>{
            cols.push({ title: key, prop: i });
        });

        options.pageLengthOptions = [5, 10, 100];
        options.pageLengthOptions = options.pageLengthOptions.filter(a => a <= data.length);
        if (!isNaN(options.initialPageLength) && options.pageLengthOptions.indexOf(options.initialPageLength) === -1) {
            options.pageLengthOptions = this.insert(options.initialPageLength, options.pageLengthOptions);
        }
        let prop = realKeys.indexOf(options.initialSort) !== -1 ? realKeys.indexOf(options.initialSort) : 0;
        return (
            <div className={"tableContainer theme-" + options.theme}>
                <DataTable key={this.state.key || 0}
                    keys="name"
                    columns={cols}
                    initialData={data}
                    initialPageLength={options.initialPageLength || 5}
                    disablePagination={options.disablePagination}
                    disableFilter={options.disableFilter}
                    disableRowChoice={options.disableRowChoice}
                    pageSizeLabel={options.pageSizeLabel}
                    noDataLabel={options.noDataLabel}
                    searchLabel={options.searchLabel}
                    searchPlaceholder={options.searchPlaceholder}
                    pageLengthOptions={options.pageLengthOptions}
                    paginationBottom
                    initialSortBy={{ prop: prop, order: options.initialOrder } /* { prop: cols[0].title, order: 'descending' }*/}
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
    componentDidUpdate() {

    }
    componentDidMount() {

    }

}
/* eslint-enable react/prop-types */
