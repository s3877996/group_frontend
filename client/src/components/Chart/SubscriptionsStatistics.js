import React, { useState, useEffect } from 'react';
import api from '../../api'
import {
  Chart as ChartJS,
  CategoryScale,    // x axis
  LinearScale,      // y axis
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function SubscriptionStatistics() {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        api.get('/admin/get_subscriptions_count')
            .then(response => {
                const packageData = response.data;
                setChartData({
                    labels: packageData.map((pkg) => pkg.package_name),
                    datasets: [
                        {
                            label: 'Numbers of subscribers',
                            data: packageData.map((pkg) => pkg.subscription_count),
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
        <div className="px-8 w-1/2 h-1/2">
            {chartData && chartData?.datasets ? (
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Subscription Count',
                            },
                        },
                    }}
                />
            ) : (
                <div className="flex justify-center items-center h-screen">
                    <p><strong>Loading chart data...</strong></p>
                </div>
            )}
        </div>
    );
}

export default SubscriptionStatistics;