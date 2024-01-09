import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import api from '../../api'

function SubscriptionStatistics() {
    const [subscriptionData, setSubscriptionData] = useState([]);

    useEffect(() => {
        api.get()
            .then(response => response.json())
            .then(data => setSubscriptionData(data))
            .catch(err => {
                console.error('Error getting subscription count: ' + err.message);
            });
        
    }, []);

    useEffect(() => {
        if (subscriptionData.length > 0) {
        renderChart();
        }
    }, [subscriptionData]);

    const renderChart = () => {
        const labels = subscriptionData.map(subscription => subscription.package);
        const counts = subscriptionData.map(subscription => subscription.count);

        const ctx = document.getElementById('subscriptionChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                label: 'Number of Subscriptions',
                data: counts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
                }]
            },
            options: {
                scales: {
                y: {
                    beginAtZero: true,
                    stepSize: 1
                }
                }
            }
        });
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-1/2">
                <canvas id="subscriptionChart" width="400" height="200"></canvas>
            </div>
        </div>
    );
}

export default SubscriptionStatistics;