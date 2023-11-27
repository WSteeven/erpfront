export const optionsPie = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 24,
  },
  elements: {
    arc: {
      borderWidth: 0,
    }
  },
  plugins: {
    legend: {
      position: 'right',
    },
    datalabels: {
      align: 'end',
      anchor: 'end',
      color: '#fff',
      borderRadius: 16,
      padding: 6,
      backgroundColor: function (context) {
        return context.dataset.backgroundColor
      },
      font: function (context) {
        const w = context.chart.width
        return {
          size: w < 512 ? 10 : 12,
        }
      },
      formatter: function (value, context) {
        return value ? context.chart.data.labels[context.dataIndex] + ' (' + value + ')' : null
      }
    },
  },
}

export const optionsLine = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    // padding: 32,
  },
  elements: {
    line: {
      fill: false,
      tension: 0.4,
    }
  },
  scales: {
    y: {
      stacked: true
    }
  },
  plugins: {

    datalabels: {
      align: 'end',
      anchor: 'end',
      color: '#fff',
      borderRadius: 16,
      padding: 6,
      backgroundColor: function (context) {
        return context.dataset.backgroundColor
      },
      font: function (context) {
        const w = context.chart.width
        return {
          size: w < 512 ? 10 : 12,
        }
      },
      formatter: function (value, context) {
        return value + ' hora(s)' // ? context.chart.data.labels[context.dataIndex] + ' (' + value + ')' : null
      }
    }
  },
}
