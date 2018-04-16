import React from "react";
import { ResponsiveContainer, PieChart, AreaChart, BarChart, LineChart, Pie, Area, Bar, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from "recharts";
/* eslint-disable react/prop-types */

export default class Chart extends React.Component {
    componentWillUpdate() {

    }
    render() {
        let data = this.props.dataProcessed;
        let options = this.props.options;
        let ymap = options.y.map((y)=>{ return y;});
        switch (options.type) {
        case "line":
            if(ymap.length === 1) {
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}>
                            <XAxis dataKey="name" /* tickCount={data ? data.length : 5}*/ />
                            <YAxis />
                            <CartesianGrid horizontal={options.gridX} vertical={options.gridY} />
                            <Tooltip />
                            <Legend />
                            <Line key={1} type="monotone" dataKey={options.y[0].key} stroke={options.y[0].color} fillOpacity={1} />
                        </LineChart>
                    </ResponsiveContainer>
                );
            }
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}>
                        <XAxis dataKey="name" /* tickCount={data ? data.length : 5}*/ />
                        <YAxis />
                        <CartesianGrid horizontal={options.gridX} vertical={options.gridY} />
                        <Tooltip />
                        <Legend />
                        {ymap.map((y, o) => <Line key={o + 1} type="monotone" dataKey={y.key} stroke={y.color} fillOpacity={1} />)}
                    </LineChart>
                </ResponsiveContainer>
            );

        case "area":
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            {options.y.map((y, o) => {
                                return(
                                    <linearGradient key={o + 1} id={"colorUv" + o} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={y.color} stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor={y.color} stopOpacity={0}/>
                                    </linearGradient>
                                );
                            })}
                        </defs>
                        <XAxis dataKey={options.x} name={options.x} />
                        <YAxis/>
                        <CartesianGrid horizontal={options.gridX} vertical={options.gridY} />
                        <Tooltip />
                        {ymap.map((y, o) => <Area key={o + 1} type="monotone" dataKey={y.key} stroke={y.color} fillOpacity={1} fill={"url(#colorUv" + o + ")"}/>)}
                    </AreaChart>
                </ResponsiveContainer>
            );
        case "bar":
            if(ymap.length === 1) {
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}>
                            <XAxis dataKey={options.x} name={options.x}/>
                            <YAxis/>
                            <CartesianGrid horizontal={options.gridX} vertical={options.gridY} />
                            <Tooltip/>
                            <Legend />
                            <Bar key={1} dataKey={options.y[0].key} fill={options.y[0].color} scaleY={1} />
                        </BarChart>
                    </ResponsiveContainer>
                );
            }
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}>
                        <XAxis dataKey={options.x} name={options.x}/>
                        <YAxis/>
                        <CartesianGrid horizontal={options.gridX} vertical={options.gridY} />
                        <Tooltip/>
                        <Legend />
                        {ymap.map((y, o) =><Bar key={o + 1} dataKey={y.key} fill={y.color} scaleY={1} />)}
                    </BarChart>
                </ResponsiveContainer>
            );

        case "pie":
            let rings = [];
            for (let ring of options.rings) {
                let newRing = {};
                let newData = [];
                for (let row of data) {
                    let value = {};
                    value.name = row[ring.name];
                    value.value = row[ring.value];
                    newData.push(value);
                }
                newRing.data = newData;
                newRing.color = ring.color;
                rings.push(newRing);
            }

            return (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
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
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis dataKey={options.x} name={options.x}/>
                        <YAxis/>
                        <CartesianGrid
                            horizontal
                            vertical={options.xGrid} />
                        {options.y.map((y, o) => {
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
