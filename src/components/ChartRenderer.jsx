import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = ['#6366f1', '#ec4899', '#38bdf8', '#10b981', '#f59e0b', '#8b5cf6'];

export default function ChartRenderer({ config, data }) {
  if (!data || data.length === 0) {
    return <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>No data to display.</p></div>;
  }

  const { type, xAxisKey, yAxisKeys } = config;

  // Custom styling for axes
  const axisProps = {
    stroke: 'var(--text-secondary)',
    fontSize: 12,
    tickLine: false,
    axisLine: false,
    dy: 10
  };

  const currentTheme = {
    backgroundColor: 'var(--surface-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    boxShadow: 'var(--glass-shadow)'
  };

  const renderTooltip = () => (
    <Tooltip 
      contentStyle={currentTheme}
      itemStyle={{ color: 'var(--text-primary)', fontWeight: 500 }}
      labelStyle={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}
    />
  );

  switch (type?.toLowerCase()) {
    case 'line':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey={xAxisKey} {...axisProps} />
            <YAxis {...axisProps} dx={-10} />
            {renderTooltip()}
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {yAxisKeys.map((key, i) => (
              <Line 
                key={key} 
                type="monotone" 
                dataKey={key} 
                stroke={COLORS[i % COLORS.length]} 
                strokeWidth={3}
                dot={{ r: 4, fill: COLORS[i % COLORS.length], strokeWidth: 2, stroke: 'var(--bg-base)' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
      
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey={xAxisKey} {...axisProps} />
            <YAxis {...axisProps} dx={-10} />
            {renderTooltip()}
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {yAxisKeys.map((key, i) => (
              <Bar 
                key={key} 
                dataKey={key} 
                fill={COLORS[i % COLORS.length]} 
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );

    case 'area':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {yAxisKeys.map((key, i) => (
                <linearGradient key={`color${key}`} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey={xAxisKey} {...axisProps} />
            <YAxis {...axisProps} dx={-10} />
            {renderTooltip()}
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {yAxisKeys.map((key, i) => (
              <Area 
                key={key} 
                type="monotone" 
                dataKey={key} 
                stroke={COLORS[i % COLORS.length]} 
                fillOpacity={1} 
                fill={`url(#color${key})`} 
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'pie':
      // For pie chart, usually it's one dimension against a measure (e.g. category vs sales)
      const dataKey = yAxisKeys[0];
      const nameKey = xAxisKey;

      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {renderTooltip()}
            <Legend layout="vertical" verticalAlign="middle" align="right" />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              stroke="var(--bg-base)"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      );
      
    case 'scatter':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey={xAxisKey} type="number" name={xAxisKey} {...axisProps} />
            <YAxis dataKey={yAxisKeys[0]} type="number" name={yAxisKeys[0]} {...axisProps} dx={-10} />
            {renderTooltip()}
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Scatter name="Data" data={data} fill={COLORS[0]} />
          </ScatterChart>
        </ResponsiveContainer>
      );

    default:
      return <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Unsupported chart type: {type}</p></div>;
  }
}
