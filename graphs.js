function createSampleChart() {
    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1', '2', '3', '4', '5', '6'],
            datasets: [{
                label: 'Timed',
                data: [10, 15, 2, 3, 1, 1],
                borderWidth: 1
            }, {
                label: 'Total',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1
            }
            ]
        },
        options: {
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createKeyStats(stats) {
    const ctx = document.getElementById('myChart');

    var labels = Object.keys(stats);
    var timed = stats.map(e => e.timed).filter(n => n >= 0);
    var count = stats.map(e => e.count).filter(n => n >= 0);

    var chart = Chart.getChart("myChart");
    if (!chart) {
        chart2 = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Timed',
                    data: timed,
                    borderWidth: 0
                }, {
                    label: 'Total',
                    data: count,
                    borderWidth: 0
                }
                ]
            },
            options: {
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        });
    } else {
        chart.data.labels = labels;
        chart.data.datasets[0].data = timed;
        chart.data.datasets[1].data = count;
        chart.update()
    }

}


function createKeyStats2(stats) {
    const ctx = document.getElementById('myChart2');

    var labels = Object.keys(stats);
    var percent = stats.map(e => e.timed/e.count).filter(n => n >= 0);

    var chart = Chart.getChart("myChart2");
    if (!chart) {
        chart2 = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '% Timed',
                    data: percent,
                    borderWidth: 0
                }
                ]
            },
            options: {
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            format: {
                                style: 'percent'
                            }
                        }
                    }
                }
            }
        });
    } else {
        chart.data.labels = labels;
        chart.data.datasets[0].data = percent;
        chart.update()
    }
}