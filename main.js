function formatDate (date) {
    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
}

class DataSets {
    /**
     * @type {Series[]}
     */
    series = [];

    constructor(chart) {
        this.chart = chart;
    }

    /**
     * @param {String} name
     * @param {Series} series
     */
    addSeries(name, series) {
        this.series[name] = series;
    }

    /**
     * @param {String} name
     */
    removeSeries(name) {
        delete this.series[name];
    }

    /**
     * @param {String} name
     * @returns {Series}
     */
    getSeries(name) {
        return this.series[name];
    }

    /**
     * @returns {Date[]}
     */
    getDates() {
        let allDates = [];
        Object.values(this.series).forEach(function (series) {
            series.getDates().forEach(function (date) {
                if (allDates.find((d) => d - date === 0) === undefined) {
                    allDates.push(date);
                }
            });
        });

        return allDates;
    }

    getDatasets() {
        let dates = this.getDates();

        let datasets = [];
        for (let i in this.series) {
            datasets.push(this.series[i].getDataset(dates));
        }

        return datasets;
    }

    render() {
        this.chart.data.labels = this.getDates();
        this.chart.data.datasets = this.getDatasets();

        this.chart.update();
    }
}

class Series {
    /**
     * @type {{date: Date, value: int}[]}
     */
    data = [];

    /**
     * @param {object} options
     */
    constructor(options) {
        this.options = options;
    }

    /**
     * @param {String|Date} date
     * @param {int} value
     */
    addValue(date, value) {
        date = typeof date === "string" ? new Date(date) : date;

        this.data.push({date: date, value: value});
    }

    /**
     * @returns {{date: Date, value: int}[]}
     */
    getData() {
        return this.data;
    }

    clearData() {
        this.data = [];
    }

    getDates() {
        return this.data.map((point) => point.date);
    }

    /**
     * @param {Date[]} dates
     * @returns {int[]}
     */
    getValues(dates) {
        return dates.map(
            (date) => this.data.find(
                (point) => point.date - date === 0
            )?.value
        );
    }

    getDataset(dates) {
        let dataset = this.options;

        if (dataset.color !== undefined && dataset.backgroundColor === undefined) {
            dataset.backgroundColor = dataset.color;
        }
        if (dataset.color !== undefined && dataset.borderColor === undefined) {
            dataset.borderColor = dataset.color;
        }

        dataset.data = this.getValues(dates);

        return dataset;
    }
}
