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
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        },
                    ],
                });
            })
            .catch(err => {
                console.error('Error getting subscription count: ' + err);
            });
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-1/2">
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
                    <p>Loading chart data...</p>
                )}
            </div>
        </div>
    );
}

export default SubscriptionStatistics;