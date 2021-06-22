import React, { useState, useEffect } from "react";

const MainPage = () => {
  const [country, setCountry] = useState([]);

  const [countryDep, setDep] = useState({
    code: "",
    name: "",
  });

  const [cityDep, setDepCity] = useState("");
  const [cityArr, setArrCity] = useState("");

  const [responseData, setResponse] = useState({
    countryItems: [],
  });

  const [date, setDate] = useState("");

  const [countryArr, setArr] = useState({
    code: "",
    name: "",
  });

  useEffect(() => {
    fetch(
      "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/reference/v1.0/countries/en-US",
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "521b4d5f7amshfe22350b8620668p1f345fjsn49dd8cd29064",
          "x-rapidapi-host":
            "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        setCountry(response["Countries"]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleClick = () => {
    const contryArr = countryArr.code;
    const cityA = cityArr;
    const contryDep = countryDep.code;
    const cityD = cityDep;
    fetch(
      `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/${contryDep}/GBP/en-GB/?query=${cityD}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "521b4d5f7amshfe22350b8620668p1f345fjsn49dd8cd29064",
          "x-rapidapi-host":
            "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        let airNameDep = response["Places"][0]["PlaceId"];
        setTimeout(() => {
          fetch(
            `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/${contryArr}/GBP/en-GB/?query=${cityA}`,
            {
              method: "GET",
              headers: {
                "x-rapidapi-key":
                  "521b4d5f7amshfe22350b8620668p1f345fjsn49dd8cd29064",
                "x-rapidapi-host":
                  "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
              },
            }
          )
            .then((response) => response.json())
            .then((response) => {
              let airNameArr = response["Places"][0]["PlaceId"];
              fetch(
                `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/${contryDep}/USD/en-US/${airNameDep}/${airNameArr}/${date}`,
                {
                  method: "GET",
                  headers: {
                    "x-rapidapi-key":
                      "521b4d5f7amshfe22350b8620668p1f345fjsn49dd8cd29064",
                    "x-rapidapi-host":
                      "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
                  },
                }
              )
                .then((response) => response.json())
                .then((res) => {
                  const newItems = [];
                  newItems.push(res);
                  setResponse({ countryItems: newItems });
                });
            })
            .catch((err) => {
              console.error(err);
            });
        }, 1000);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const favoriteHandler = (e) => {
    const price = e.target.getAttribute("data-price");
    const dep = e.target.getAttribute("data-dep");
    const arr = e.target.getAttribute("data-arr");
    const no = e.target.getAttribute("data-no");
    const trans = e.target.getAttribute("data-trans");

    let authKey = localStorage.getItem("authToken");
    let requestHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authKey}`,
    };

    let bodyReq = {
      countryArr: arr,
      countryDep: dep,
      number: no,
      minPrice: price,
      transporter: trans,
    };
    fetch("/bilet", {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(bodyReq),
    })
      .then((res) => res.json())
      .then((response) => {});
  };
  return (
    <div>
      <div className="container">
        <h1 className="main-legend">Find cheap tickers</h1>
        <div className="bilets">
          <h3>Departure</h3>
          <div className="departure">
            <div className="input-group">
              <label>Country</label>

              <select
                onChange={(event) =>
                  setDep({
                    name: event.target.options[event.target.selectedIndex].text,
                    code:
                      event.target.options[event.target.selectedIndex].value,
                  })
                }
              >
                {country.map((elem) => {
                  return <option value={elem["Code"]}>{elem["Name"]}</option>;
                })}
              </select>
            </div>
            <div className="input-group">
              <label>City</label>
              <input
                onChange={(event) => setDepCity(event.target.value)}
              ></input>
            </div>
            <div className="input-group">
              <label>Date</label>
              <input
                type="date"
                onChange={(event) => setDate(event.target.value)}
              ></input>
            </div>
          </div>
          <div className="icon-change"></div>
          <h3>Arrived</h3>
          <div className="arrived">
            <div className="input-group">
              <label>Country</label>
              <select
                onChange={(event) =>
                  setArr({
                    name: event.target.options[event.target.selectedIndex].text,
                    code:
                      event.target.options[event.target.selectedIndex].value,
                  })
                }
              >
                {country.map((elem) => {
                  return <option value={elem["Code"]}>{elem["Name"]}</option>;
                })}
              </select>
            </div>
            <div className="input-group">
              <label>City</label>
              <input
                onChange={(event) => setArrCity(event.target.value)}
              ></input>
            </div>
          </div>
          <button className="findBilets" onClick={handleClick}>
            Find flights
          </button>
          <div className="flights">
            {responseData.countryItems.map((elem) => {
              if (elem["Carriers"].length > 1) {
                return (
                  <div className="flights">
                    <div className="bilet">
                      <div className="add-info">
                        Transporter: {elem["Carriers"][0].Name}
                      </div>
                      <div className="add-info">
                        Flight No#: {elem["Carriers"][0].CarrierId}
                      </div>
                      <div className="add-info">
                        Price starts from: {elem["Quotes"][0].MinPrice}$
                      </div>
                      <button
                        onClick={favoriteHandler}
                        className="findBilets"
                        data-price={elem["Quotes"][0].MinPrice}
                        data-dep={elem["Places"][0].CityName}
                        data-arr={elem["Places"][1].CityName}
                        data-no={elem["Carriers"][0].CarrierId}
                        data-trans={elem["Carriers"][0].Name}
                      >
                        Add to favorites
                      </button>
                    </div>
                    <div className="bilet">
                      <div className="add-info">
                        Transporter: {elem["Carriers"][1].Name}
                      </div>
                      <div className="add-info">
                        Flight No#: {elem["Carriers"][1].CarrierId}
                      </div>
                      <div className="add-info">
                        Price starts from: {elem["Quotes"][1].MinPrice}$
                      </div>
                      <button
                        onClick={favoriteHandler}
                        className="findBilets"
                        data-price={elem["Quotes"][1].MinPrice}
                        data-dep={elem["Places"][0].CityName}
                        data-arr={elem["Places"][1].CityName}
                        data-no={elem["Carriers"][1].CarrierId}
                        data-trans={elem["Carriers"][1].Name}
                      >
                        Add to favorites
                      </button>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="bilet">
                    <div className="add-info">
                      Transporter: {elem["Carriers"][0].Name}
                    </div>
                    <div className="add-info">
                      Flight No#: {elem["Carriers"][0].CarrierId}
                    </div>
                    <div className="add-info">
                      Price starts from: {elem["Quotes"][0].MinPrice}$
                    </div>
                    <button
                      onClick={favoriteHandler}
                      className="findBilets"
                      data-price={elem["Quotes"][0].MinPrice}
                      data-dep={elem["Places"][0].CityName}
                      data-arr={elem["Places"][1].CityName}
                      data-no={elem["Carriers"][0].CarrierId}
                      data-trans={elem["Carriers"][0].Name}
                    >
                      Add to favorites
                    </button>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
