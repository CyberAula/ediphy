import React from "react";
import { ResponsiveContainer, PieChart, AreaChart, BarChart, LineChart, Pie, Area, Bar, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from "recharts";

export default class Chart extends React.Component {

    render() {
        /* jshint ignore:start */
        let data = this.props.data;
        let options = this.props.options;
        let width = this.props.width;
        console.log(this.props);
        switch (options.type) {
        case "line":
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}>
                        <XAxis dataKey={options.x} name={options.x} tickCount={data ? data.length : 5}/>
                        <YAxis/>
                        <CartesianGrid horizontal={options.gridX} vertical={options.gridY} />
                        {options.y.map((y, o) => {
                            return(
                                <Line key={o + 1} type="monotone" dataKey={y.key} stroke={y.color}/>
                            );
                        })}
                        <Tooltip active/>
                        <Legend/>
                    </LineChart>
                </ResponsiveContainer>
            );
        case "area":
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}>
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
                        {options.y.map((y, o) => {
                            return(
                                <Area key={o + 1} type="monotone" dataKey={y.key} stroke={y.color} fillOpacity={1} fill={"url(#colorUv" + o + ")"}/>
                            );
                        })}
                    </AreaChart>
                </ResponsiveContainer>
            );
        case "bar":
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}>
                        <XAxis dataKey={options.x} name={options.x}/>
                        <YAxis/>
                        <CartesianGrid horizontal={options.gridX} vertical={options.gridY} />
                        <Tooltip/>
                        <Legend />
                        {options.y.map((y, o) => {
                            return(
                                <Bar key={o + 1} dataKey={y.key} fill={y.color} scaleY={1} />
                            );
                        })}
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
            console.log("default");
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart

                        data={data}>
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
        /* jshint ignore:end */
    }
}
