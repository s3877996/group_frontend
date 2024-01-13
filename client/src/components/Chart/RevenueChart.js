import React, { useState, useEffect } from 'react';
import api from '../../api'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function RevenueChart() {
    const [chartData, setChartData] = useState([]);
    const [revenue, setRevenue] = useState();

    useEffect(() => {
        api.get('/admin/get_revenue')
            .then(response => {
                const packageData = response.data.data;
                setRevenue(response.data.total);
                setChartData({
                    labels: packageData.map((pkg) => pkg.package_name),
                    datasets: [
                        {
                            label: 'Revenue',
                            data: packageData.map((pkg) => pkg.subscription_revenue),
                            backgroundColor: [
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                            ],
                            borderColor: [
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                });
            })
            .catch(err => {
                console.error('Error getting subscription count: ' + err);
            });
    }, []);

    return (
        <div className='w-1/2 flex flex-col content-center items-center'>
            <div className="w-2/3">
                {chartData && chartData?.datasets ? (
                    <div>
                        <h3 style={{ textAlign: "center" }}><strong>Total Revenue: {revenue}</strong></h3>

                        <Pie
                            data={chartData}
                            options={{
                                responsive: true,
                                plugins: {
                                    title: {
                                        display: false
                                    },
                                },
                            }}
                        />
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-screen">
                        <p><strong>Loading chart data...</strong></p>
                    </div>
                )}
            </div>
        </div>
        
    );
}

export default RevenueChart;