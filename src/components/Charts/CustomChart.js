import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';

// Registering the necessary components for Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend
);

const CustomChart = ({ data, dataKeys, chartType, colors }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Cleanup chart on unmount
        return () => {
            const chartInstance = chartRef.current;
            if (chartInstance && chartInstance.chart) {
                chartInstance.chart.destroy();
            }
        };
    }, []);

    // Function to count occurrences of each unique value for a specific key in data
    const countUniqueValues = (data, key) => {
        return data.reduce((acc, curr) => {
            const value = curr[key];
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});
    };

    // Function to sum values for a specific key in data
    const sumValues = (data, key) => {
        return data.reduce((acc, curr) => {
            acc += curr[key] || 0;
            return acc;
        }, 0);
    };

    // Assign colors to datasets
    const assignColors = (index, length) => {
        return Array(length).fill().map((_, i) => colors[(index + i) % colors.length]);
    };

    // Processing the data to fit Chart.js format
    const processedData = (() => {
        const datasets = [];
        let labels = new Set();

        dataKeys.forEach((dataKey, index) => {
            if (dataKey.type === 'count') {
                const countData = countUniqueValues(data, dataKey.key);
                Object.keys(countData).forEach(key => labels.add(key));
                datasets.push({
                    label: dataKey.label,
                    data: Object.values(countData),
                    backgroundColor: assignColors(index, Object.keys(countData).length),
                    borderColor: assignColors(index, Object.keys(countData).length).map(color => color.replace('0.5', '1')),
                    borderWidth: 1,
                });
            } else if (dataKey.type === 'sum') {
                labels.add(dataKey.label);
                datasets.push({
                    label: dataKey.label,
                    data: [sumValues(data, dataKey.key)],
                    backgroundColor: colors[index % colors.length],
                    borderColor: colors[index % colors.length].replace('0.5', '1'),
                    borderWidth: 1,
                });
            } else {
                // Direct representation
                data.map(item => labels.add(dataKey.render ? dataKey.render(item[dataKey.key]) : item[dataKey.key]));
                datasets.push({
                    label: dataKey.label,
                    data: data.map(item => item[dataKey.key]),
                    backgroundColor: colors[index % colors.length],
                    borderColor: colors[index % colors.length].replace('0.5', '1'),
                    borderWidth: 1,
                });
            }
        });

        return { labels: Array.from(labels), datasets };
    })();

    // Selecting the correct chart type
    const renderChart = () => {
        switch (chartType.toLowerCase()) {
            case 'bar':
                return <Bar ref={chartRef} data={processedData} />;
            case 'line':
                return <Line ref={chartRef} data={processedData} />;
            case 'doughnut':
                return <Doughnut ref={chartRef} data={processedData} />;
            case 'pie':
                return <Pie ref={chartRef} data={processedData} />;
            default:
                return <p>Invalid chart type</p>;
        }
    };

    return <div>{data.length > 0 ? renderChart() : <p>No data available</p>}</div>;
};

export default CustomChart;