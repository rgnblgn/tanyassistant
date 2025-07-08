// src/components/LogWorkChart.jsx
import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';

const LogWorkChart = ({ data }) => {
    // Örnek: [{ key: "PROJ-1", totalHours: 5 }, { key: "PROJ-2", totalHours: 3 }]
    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="key" />
                    <YAxis label={{ value: 'Saat', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalHours" fill="#8884d8" name="Toplam Saat" onClick={(data, index) => {
                        const jiraUrl = `${import.meta.env.VITE_API_URL}/browse/${data.key}`;
                        window.open(jiraUrl, '_blank');
                    }} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LogWorkChart;
