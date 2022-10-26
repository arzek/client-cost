
async function main() {
    const response = await fetch('https://costs-production.up.railway.app/costs/current-month');
    const data = await response.json();


    const labels = [];
    const dataLabels = [];
    const backgroundColor = [];

    let totalPrice = 0;

    for (const item of data) {
        labels.push(capitalizeFirstLetter(item._id));
        const prise = Number(item.count);
        dataLabels.push(prise);
        backgroundColor.push(randomRgba());

        totalPrice+=prise;
    }

    Chart.defaults.set('plugins.datalabels', {
        color: '#ffffff'
    });

    const ctx = document.getElementById('myChart');
    const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                label: 'My First Dataset',
                data: dataLabels,
                backgroundColor,
            }],
            hoverOffset: 4
        },
        plugins: [ChartDataLabels],
        options: {
            plugins: {
                datalabels: {
                    display: true,
                    align: 'bottom',
                    backgroundColor: '#000000',
                    borderRadius: 3,
                    font: {
                        size: 18,
                    },
                    formatter: (val, ctx) => {
                        // Grab the label for this value
                        const label = ctx.chart.data.labels[ctx.dataIndex];

                        // Format the number with 2 decimal places
                        const formattedVal = Intl.NumberFormat('en-US', {
                            minimumFractionDigits: 2,
                        }).format(val);

                        // Put them together
                        return `${label} - ${formattedVal}$ - ${getPerCent(val, totalPrice)}%`;
                    },
                },
            }
        }
    });
}

function getPerCent(val, totalPrice) {
    return (val / totalPrice * 100).toFixed(2)
}

function randomRgba() {
    const o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ','  + 1 + ')';
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

main();

