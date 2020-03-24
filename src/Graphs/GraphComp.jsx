import React, { Component } from 'react';
import Select from 'react-select';
import GraphOfCases from './GraphOfCases'
import GraphOfDeaths from './GraphOfDeaths'
import GraphOfRecover from './GraphOfRecover'
import {
    Paper
} from '@material-ui/core';

class GraphComp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            countryDetails: null,
            countries: [],
            countryNames: [],
            selectedCountry: null,
            countryCode: null,
            labelsCases: [],
            dataCases: [],
            labelsDeaths: [],
            dataDeaths: [],
            labelsRecover: [],
            dataRecover: [],

        }
    }

    componentDidMount() {
        fetch('https://corona.lmao.ninja/historical')
            .then(response => response.json())
            .then(response => {

                if (response.length > 0) {
                    this.setState({
                        countries: response
                    })

                    this.setCountryNames();
                }
            })
            .catch((error) => console.log('Something went wrong...', error));
    }


    setData = (country) => {
        this.setCases(country);
        this.setDeaths(country);
        this.setRecoveries(country);
    }


    setRecoveries = (country) => {
        if (country) {
            let timeLineData = country.timeline;
            let p = timeLineData.recovered;
            let la = [];
            let da = []
            for (var key in p) {
                if (p.hasOwnProperty(key)) {
                    la.push(key);
                    da.push(p[key])
                }
            }
            this.setState({
                labelsRecover: la,
                dataRecover: da
            })
        }
    }
    setDeaths = (country) => {
        if (country) {
            let timeLineData = country.timeline;
            let p = timeLineData.deaths;
            let la = [];
            let da = []
            for (var key in p) {
                if (p.hasOwnProperty(key)) {
                    la.push(key);
                    da.push(p[key])
                }
            }
            this.setState({
                labelsDeaths: la,
                dataDeaths: da
            })
        }
    }

    setCases = (country) => {
        if (country) {
            let timeLineData = country.timeline;
            let p = timeLineData.cases;
            let la = [];
            let da = []
            for (var key in p) {
                if (p.hasOwnProperty(key)) {
                    la.push(key);
                    da.push(p[key])
                }
            }

            this.setState({
                labelsCases: la,
                dataCases: da
            })
        }
    }

    getCountryValues = (country) => {

        fetch(`https://corona.lmao.ninja/historical/${country.value}`)
            .then(response => response.json())
            .then(response => {

                if (response) {
                    this.setState({
                        countryDetails: response
                    })
                    this.setData(response);
                }
            })
            .catch((error) => console.log('Something went wrong...', error));
        return null;
    }

    selectChangeHandle = (val) => {

        this.getCountryValues(val);
        this.setState({
            selectedCountry : val.value
        })

        // for (var i = 0; i < this.state.countries.length; i++) {
        //     if (this.state.countries[i].country === val.value) {
        //         this.setState({
        //             selectedCountry: this.state.countries[i],

        //         })
        //         this.setData(this.state.countries[i]);

        //         this.fetchCountryCode(i);
        //     }
        // }
    }

    fetchCountryCode = (i) => {
        fetch(`https://restcountries.eu/rest/v2/name/${this.state.countries[i].country}`)
            .then(response => response.json())
            .then(response => {
                this.setState({
                    countryCode: response[0].alpha2Code
                });
            })
            .catch((error) => console.log('Something went wrong...', error));
    }

    setCountryNames = () => {
        console.log('con',this.state)
        const countryNames = [];
        for (let i = 0; i < this.state.countries.length; i++) {
            
            if (!countryNames.includes(this.state.countries[i].country)) {
                countryNames.push({
                    label: this.state.countries[i].country,
                    value: this.state.countries[i].country
                });
            }
        }
        this.setState({
            countryNames: countryNames
        });
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col">
                        <div data-toggle="tooltip" data-placement="top" title={'a'} className={`small-box bg-white   `}>
                            <div className="inner text-center">
                                <h6 className="text-center">Source</h6>
                                <p className="text-center"> The values displayed here are collected and distributed publicly by <a href="https://corona.lmao.ninja">https://corona.lmao.ninja</a></p>
                            </div>

                            <p className="small-box-footer text-danger">Consider these values as approximate values</p>
                        </div>
                    </div>
                </div>

                <Select options={this.state.countryNames}
                    onChange={opt => this.selectChangeHandle(opt)} />

 
                {

                    (this.state.selectedCountry != null) && (
                        <div>
                            <br />
                            <GraphOfCases countryCode={this.state.countryCode} labels={this.state.labelsCases} cases={this.state.dataCases} />
                            <Paper style={{ marginTop: 20 }} />
                            <GraphOfDeaths countryCode={this.state.countryCode} labels={this.state.labelsDeaths} cases={this.state.dataDeaths} />
                            <Paper style={{ marginTop: 20 }} />
                            <GraphOfRecover countryCode={this.state.countryCode} labels={this.state.labelsRecover} cases={this.state.dataRecover} />
                        </div>
                    )
                }

            </div>
        );
    }
}

export default GraphComp;