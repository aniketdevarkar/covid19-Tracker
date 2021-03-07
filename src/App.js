// import React, { useState, useEffect } from "react";
// import "./App.css";
// import Table from "./Table";
// import {
//   MenuItem,
//   FormControl,
//   Select,
//   CardContent,
//   Card,
// } from "@material-ui/core";
// import InfoBox from "./InfoBox";
// import Map from "./Map";
// import { sortData } from "./util";
// import LineGraph from "./LineGraph";
// import "leaflet/dist/leaflet.css";

// function App() {
//   const [countries, setCountries] = useState([]);
//   const [country, setCountry] = useState("worldwide");
//   const [countryInfo, setCountryInfo] = useState({});
//   const [tableData, setTableData] = useState([]);
//   const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]);
//   const [mapZoom, setMapZoom] = useState(3);
//   const [mapCountries, setMapCountries] = useState([]);

//   useEffect(() => {
//     fetch("https://disease.sh/v3/covid-19/all")
//       .then((response) => response.json())
//       .then((data) => {
//         setCountryInfo(data);
//       });
//   }, []);

//   useEffect(() => {
//     const getCountriesData = async () => {
//       await fetch("https://disease.sh/v3/covid-19/countries")
//         .then((response) => response.json())
//         .then((data) => {
//           // console.log(data);
//           const countries = data.map((country) => ({
//             name: country.country, // united states
//             value: country.countryInfo.iso2, // UK,USA,FR
//           }));
//           const sortedData = sortData(data);
//           setTableData(sortedData);
//           setMapCountries(data);
//           setCountries(countries);
//         });
//     };
//     getCountriesData();
//   }, []);

//   const onCountryChange = async (event) => {
//     const countryCode = event.target.value;
//     //  console.log("yoooooo>>", countryCode);

//     const url =
//       countryCode === "worldwide"
//         ? "https://disease.sh/v3/covid-19/all"
//         : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
//     await fetch(url)
//       .then((response) => response.json())
//       .then((data) => {
//         setCountry(countryCode);
//         //All of the data..
//         //from the country response
//         setCountryInfo(data);
//         // console.log([data.countryInfo.lat, data.countryInfo.long]);
//         setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
//         // console.log(mapCenter);
//         setMapZoom(4);

//         // console.log(mapZoom);
//       });
//   };
//   console.log(countryInfo);
//   return (
//     <div className="app">
//       <div className="app__left">
//         <div className="app__header">
//           <h1>COVID-19 TRACKER</h1>
//           <FormControl className="app__dropdown">
//             <Select
//               variant="outlined"
//               onChange={onCountryChange}
//               value={country}
//             >
//               {/* <MenuItem>abcd</MenuItem> */}
//               <MenuItem value="worldwide">Worldwide</MenuItem>
//               {countries.map((country) => (
//                 <MenuItem value={country.value}>{country.name}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </div>
//         <div className="app__stats">
//           <InfoBox
//             title="Coronavirus Cases"
//             cases={countryInfo.todayCases}
//             total={countryInfo.cases}
//           />
//           <InfoBox
//             title="Recoverd"
//             cases={countryInfo.todayRecovered}
//             total={countryInfo.recovered}
//           />
//           <InfoBox
//             title="Deaths"
//             cases={countryInfo.todayDeaths}
//             total={countryInfo.deaths}
//           />
//         </div>

//         {/*Map*/}
//         <Map countries={mapCountries} center={mapCenter} zoom={mapZoom} />
//       </div>
//       <Card className="app__right">
//         <CardContent>
//           {/*Table*/}

//           <h1>Coronavirus cases</h1>
//           <Table countries={tableData} />
//           <h1>Worl wide cases</h1>
//           {/*Graph*/}
//           <LineGraph />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  CardContent,
  Card,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import "./InfoBox.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]);
  const [zoom, setZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    setLoading(true);
    const countryCode = event.target.value;

    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    //https://disease.sh/v3/covid-19/all
    //https://disease.sh/v3/covid-19/countries/[countryCode]

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setLoading(false);
        // console.log([data.countryInfo.lat, data.countryInfo.long]);
        countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setZoom(4);
      });

    console.log(countryInfo);
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            className="infoBox__cases"
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            total={prettyPrintStat(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)}
            isloading={isLoading}
          />
          <InfoBox
            active={casesType === "recovered"}
            className="infoBox__recovered"
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            total={prettyPrintStat(countryInfo.recovered)}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            isloading={isLoading}
          />
          <InfoBox
            isGrey
            active={casesType === "deaths"}
            className="infoBox__deaths"
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            total={prettyPrintStat(countryInfo.deaths)}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            isloading={isLoading}
          />
        </div>
        {/* Map */}
        <Map
          countries={mapCountries}
          center={mapCenter}
          zoom={zoom}
          casesType={casesType}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">WorldWide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
        {/* Table */}
        {/* Graph */}
      </Card>
    </div>
  );
}

export default App;
