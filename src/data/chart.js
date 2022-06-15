export const basicLabels =[ 'Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]

export const basicDatasets = [
    {
        label: 'My First dataset',
        backgroundColor: '#42A5F5',
        data: [20, 12, 14, 30, 40, 20, 80, 75, 60, 90, 90, 100],
        borderColor: '#42A5F5',
        tension: .4,
    },
]


export const getDarkTheme = () => {
    let basicOptions = {
        maintainAspectRatio: false,
        aspectRatio: .8,
        plugins: {
            legend: {
                labels: {
                    color: '#ced4da'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ced4da'
                },
                grid: {
                    color: '#495057'
                }
            },
            y: {
                ticks: {
                    color: '#ced4da'
                },
                grid: {
                    color: '#495057'
                }
            }
        }
    };

    return { basicOptions }
}


export const pieChartLabels =[ 'A', 'B', 'C' ]

export const pieChartDatasets = [
    {
        label: 'My First dataset',
        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
        data: [20, 60, 30],
    },
]
