import axios from "axios";
import _ from "lodash";
import AddedData from "./AddedData";
import CountriesData from "./CountriesData";
import DayData from "./DayData";
import GlobalData from "./GlobalData";

export default class TotalData {
    static FETCH_LINK = "https://pomber.github.io/covid19/timeseries.json";

    isFetchingData: boolean;
    data: CountriesData | null;
    globalData: DayData[] | null;
    lastFetchDate: Date | null;

    constructor() {
        this.isFetchingData = false;
        this.data = null;
        this.globalData = null;
        this.lastFetchDate = null;

        this._start();
    }

    private async _start() {
        await this.updateData();
        this.updateGlobalData();

        this.lastFetchDate = new Date();
    }

    updateData(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.isFetchingData = true;

            this.data = null;
            this.data = await this._fetchData();
            this.lastFetchDate = new Date();

            this.isFetchingData = false;
            resolve();
        });
    }

    getCountryData(country: string): DayData[] | null {
        if (!this.data) {
            if (!this.isFetchingData) this.updateData();
            return null;
        }
        if (!(country in this.data)) return null;
        return this.data[country];
    }

    updateGlobalData() {
        this.globalData = this._getGlobalData();
    }

    isValidCountry(country: string) {
        if (!this.data) throw new Error("Data is still fetching!");
        return country in this.data;
    }

    private _fetchData(): Promise<CountriesData> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(TotalData.FETCH_LINK);
                resolve(response.data as CountriesData);
            } catch (err) {
                reject(err);
            }
        });
    }

    private _getGlobalData() {
        // const d: GlobalData = {};
        if (!this.data) throw new Error("No data to use in _getGlobalData!");
        // for (const country in this.data) {
        //     if (!(country in d)) d[country] = {} as AddedData;

        //     d[country].confirmed = this.data[country].reduce(
        //         (acc, c) => acc + c.confirmed,
        //         0
        //     );
        //     d[country].deaths = this.data[country].reduce(
        //         (acc, c) => acc + c.deaths,
        //         0
        //     );
        //     d[country].recovered = this.data[country].reduce(
        //         (acc, c) => acc + c.recovered,
        //         0
        //     );
        // }

        // const e: DayData = {
        //     confirmed: 0,
        //     deaths: 0,
        //     recovered: 0,
        //     date: ""
        // };

        // for (const country in d) {
        //     e.confirmed += d[country].confirmed;
        //     e.deaths += d[country].deaths;
        //     e.recovered += d[country].recovered;
        // }

        // return e;

        const b: DayData[] = [];
        // Let's get the first country just so we can have an index for all dates
        const firstCountryData = this.data[Object.keys(this.data)[0]];
        for (let i = 0; i < firstCountryData.length; i++) {
            // Now we loop through every country of this ("i") day
            for (const country in this.data) {
                if (!b[i])
                    b[i] = {
                        date: this.data[country][i].date,
                        confirmed: 0,
                        deaths: 0,
                        recovered: 0
                    } as DayData;

                b[i].confirmed += this.data[country][i].confirmed;
                b[i].deaths += this.data[country][i].deaths;
                b[i].recovered += this.data[country][i].recovered;
            }
        }

        return b;
    }

    // Weird promise that checks every 100ms for 20 (tries) times if data is ready
    waitForData(tries: number = 20): Promise<void> {
        return new Promise(async (resolve, reject) => {
            while (!this.data && tries > 0) {
                this._wait(100);
                tries--;
            }

            if (!this.data) return reject();
            return resolve();
        });
    }

    private _wait(ms: number): Promise<void> {
        return new Promise(async resolve => setTimeout(resolve, ms));
    }

    diff(country: string) {
        if (!this.data) return null;
        else if (!this.isValidCountry(country)) return null;

        const x = _.cloneDeep(this.data[country]);
        const y = _.cloneDeep(this.data[country]);

        for (let i = 0; i < x.length; i++) {
            x[i].confirmed =
                y[i].confirmed - y[i - 1 > 0 ? i - 1 : 0].confirmed;
            x[i].deaths = y[i].deaths - y[i - 1 > 0 ? i - 1 : 0].deaths;
            x[i].recovered =
                y[i].recovered - y[i - 1 > 0 ? i - 1 : 0].recovered;
        }

        return x;
    }
}

// export default TotalData;
