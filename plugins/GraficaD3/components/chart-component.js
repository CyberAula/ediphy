import React from "react";
import { ResponsiveContainer, PieChart, AreaChart, BarChart, LineChart, Pie, Area, Bar, Line, XAxis, YAxis,
    CartesianGrid, Legend, Tooltip } from "recharts";
/* eslint-disable react/prop-types */

export default class Chart extends React.Component {

    render() {
        let data = this.props.dataProcessed.slice();
        let options = this.props.options;
        options.graphs.forEach(graph=>{
            data.forEach((element, i)=>{
                let newData = { ...data[i] };
                newData = { ...newData, [graph.name]: element[graph.column] };
                delete newData[graph.column];
                data[i] = newData;
            });
        });
        switch (options.type) {
        case "line":
            if(options.graphs.length === 1) {
                return (
                    <ResponsiveContainer width="100%" height="100%" key={this.props.id}>
                        <LineChart key={'chart' + this.props.id}
                            data={data}>
                            <XAxis dataKey="name" /* tickCount={data ? data.length : 5}*/ />
                            <YAxis mirror/>
                            <CartesianGrid horizontal={options.gridX} vertical={options.gridY} />
                            <Tooltip />
                            <Legend />
                            <Line key={1} type="monotone" dataKey={options.graphs[0].name} stroke={options.graphs[0].color} fillOpacity={1} />
                        </LineChart>
                    </ResponsiveContainer>
                );
            }
            return (
                <ResponsiveContainer width="100%" height="100%" key={this.props.id}>
                    <LineChart key={'chart' + this.props.id}
                        data={data}>
                        <XAxis dataKey="name" /* tickCount={data ? data.length : 5}*/ />
                        <YAxis mirror/>
                        <CartesianGrid horizontal={options.gridX} vertical={options.gridY} />
                        <Tooltip />
                        <Legend />
                        {options.graphs.map((y, o) => <Line key={o + 1} type="monotone" dataKey={y.name} stroke={y.color} fillOpacity={1} />)}
                    </LineChart>
                </ResponsiveContainer>
            );

        case "area":
            return (
                <ResponsiveContainer width="100%" height="100%" key={this.props.id}>
                    <AreaChart data={data} key={'chart' + this.props.id}>
                        <defs>
                            {options.graphs.map((y, o) => {
                                return(
                                    <linearGradient key={o + 1} id={(this.props.fromConfig ? "config_" : "") + this.props.id + "_colorUv" + o} x1="0" y1="0" x2="0" y2="1">
                                        <stop key={this.props.id + '_' + o + '_' + 1} offset="5%" stopColor={y.color} stopOpacity={0.8}/>
                                        <stop key={this.props.id + '_' + o + '_' + 2} offset="95%" stopColor={y.color} stopOpacity={0}/>
                                    </linearGradient>
                                );
                            })}
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis mirror/>
                        <CartesianGrid horizontal={options.gridX} vertical={options.gridY} />
                        <Tooltip />
                        {options.graphs.map((y, o) => <Area key={o + 1} type="monotone" dataKey={y.name} stroke={y.color} fillOpacity={1} fill={"url(#" + (this.props.fromConfig ? "config_" : "") + this.props.id + "_colorUv" + o + ")"}/>)}
                    </AreaChart>
                </ResponsiveContainer>
            );
        case "bar":
            if(options.graphs.length === 1) {
                return (
                    <ResponsiveContainer width="100%" height="100%" key={this.props.id}>
                        <BarChart key={'chart' + this.props.id}
                            data={data}>
                            <XAxis dataKey="name"/>
                            <YAxis mirror/>
                            <CartesianGrid horizontal={options.gridX} vertical={options.gridY} />
                            <Tooltip/>
                            <Legend />
                            <Bar key={1} dataKey={options.graphs[0].name} fill={options.graphs[0].color} scaleY={1} />
                        </BarChart>
                    </ResponsiveContainer>
                );
            }
            return (
                <ResponsiveContainer width="100%" height="100%" key={this.props.id}>
                    <BarChart key={'chart' + this.props.id}
                        data={data}>
                        <XAxis dataKey="name"/>
                        <YAxis mirror/>
                        <CartesianGrid horizontal={options.gridX} vertical={options.gridY} />
                        <Tooltip/>
                        <Legend />
                        {options.graphs.map((y, o) =><Bar key={o + 1} dataKey={y.name} fill={y.color} scaleY={1} />)}
                    </BarChart>
                </ResponsiveContainer>
            );

        case "pie":
            let rings = [];
            for (let ring of options.rings) {
                let newRing = {};
                let newData = [];
                for (let column of data) {
                    let value = {};
                    value.name = column[ring.name];
                    value.value = column[ring.value];
                    newData.push(value);
                }
                newRing.data = newData;
                newRing.color = ring.color;
                rings.push(newRing);
            }

            return (
                <ResponsiveContainer width="100%" height="100%" key={this.props.id}>
                    <PieChart key={'chart' + this.props.id}>
                        <Tooltip />
                        {rings.map((ring, o) => {
                            return(
                                <Pie key={o + 1} data={ring.data} cx="50%" cy="50%" innerRadius={o * 50} outerRadius={(o + 1) * 50 - 10} nameKey="name" fill={ring.color} dataKey={ring.value} label={o === rings.length - 1} />
                            );
                        })}
                    </PieChart>
                </ResponsiveContainer>
            );
        default:
            return (
                <ResponsiveContainer width="100%" height="100%" key={this.props.id}>
                    <LineChart data={data} key={'chart' + this.props.id}>
                        <XAxis dataKey={options.x} name={options.x}/>
                        <YAxis mirror/>
                        <CartesianGrid
                            horizontal
                            vertical={options.xGrid} />
                        {options.graphs.map((y, o) => {
                            return(
                                <Line key={o + 1} type="monotone"
                                    dataKey={y.key}
                                    stroke={y.color}/>
                            );
                        })}
                        <Tooltip active/>
                        <Legend/>
                    </LineChart>
                </ResponsiveContainer>
            );

        }
    }
}
/* eslint-disable react/prop-types */
