import React, { useState, useEffect } from "react";

const Favorites = () => {
  const [flights, setFlight] = useState({
    flights: [],
  });

  let authKey = localStorage.getItem("authToken");
  let requestHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authKey}`,
  };

  useEffect(() => {
    fetch("/bilet", {
      method: "GET",
      headers: requestHeaders,
    })
      .then((res) => res.json())
      .then((res) => {
        setFlight({ flights: res });
      });
  }, []);

  const deleteItem = (e) => {
    let item = e.target.getAttribute("data-value");
    const ourItems = flights.flights;
    let bodyReq = {
      id: ourItems[item]["id"],
    };
    fetch("/bilet", {
      method: "DELETE",
      headers: requestHeaders,
      body: JSON.stringify(bodyReq),
    })
      .then((elem) => {
        return elem.json();
      })
      .then((res) => {
        alert("Done");
        ourItems.splice(item, 1);
        setFlight({ flights: ourItems });
      });
  };
  return (
    <div className="container">
      <div className="our-bilets">
        {flights.flights.map((elem, index) => {
          return (
            <div className="bilet-item">
              <div>{elem["countryDep"]}</div>
              <div>{elem["countryArr"]}</div>
              <div>{elem["number"]}</div>
              <div>{elem["minPrice"]}$</div>
              <div>{elem["transporter"]}</div>
              <div onClick={deleteItem} className="red" data-value={index}>
                X
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Favorites;
