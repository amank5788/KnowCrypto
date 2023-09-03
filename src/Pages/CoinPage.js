import { Button } from "react-bootstrap";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CoinInfo from "../Components/CoinInfo";
import { SingleCoin } from "../config/api";
import { CryptoState } from "../CryptoContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import styled from "styled-components";

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();

  const { currency, symbol, user, watchlist, setAlert } = CryptoState();

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data);
  };

  console.log(coin);

  useEffect(() => {
    fetchCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inWatchlist = watchlist.includes(coin?.id);

  const addToWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);

    try {
      await setDoc(coinRef, {
        coins: watchlist ? [...watchlist, coin.id] : [coin.id],
      });

      setAlert({
        open: true,
        message: `${coin.name} Added to the watchlist`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  const removeFromWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);

    try {
      await setDoc(
        coinRef,
        {
          coins: watchlist.filter((watch) => watch !== coin?.id),
        },
        { merge: "true" }
      );

      setAlert({
        open: true,
        message: `${coin.name} Removed from the Watchlist`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  const coin_description = coin?.description.en.split(". ")[0];
  return (
    <ContainerCp>
      <div className="sidebar_coinpage">
        {/* sidebar */}
        <img
          src={coin?.image.large}
          alt={coin?.name}
          height="150"
          style={{ marginBottom: 20 }}
        />
        <h3
          className="headingcp"
          style={{ width: "100%", justifyContent: "center", display: "flex" }}
        >
          {coin?.name}
        </h3>
        <div className="typos" style={{ margin: 0 }}>
          <div dangerouslySetInnerHTML={{ __html: coin_description }} />
        </div>

        <div className="market_data">
          <span>
            <h5 className="headingcp">Rank:</h5>
            &nbsp; &nbsp;
            <h5 className="typos" style={{ fontFamily: "Montserrat" }}>
              {coin?.market_cap_rank}
            </h5>
          </span>
          <span>
            <h5 className="headingcp">Current Price:</h5>
            &nbsp; &nbsp;
            <h5 className="typos" style={{ fontFamily: "Montserrat" }}>
              {symbol}
              {
                coin?.market_data.current_price[
                  currency.toLowerCase().toLocaleString()
                ]
              }
            </h5>
          </span>
          <span>
            <h5 className="headingcp">Market Cap:</h5>
            &nbsp; &nbsp;
            <h5 className="typos" style={{ fontFamily: "Montserrat" }}>
              {symbol}
              {coin?.market_data.market_cap[currency.toLowerCase()]
                .toLocaleString()
                .slice(0, -6)}
              M
            </h5>
          </span>
          {user && (
            <Button
              variant="outlined"
              style={{
                width: "100%",
                height: 40,
                backgroundColor: inWatchlist ? "#ff0000" : "#EEBC1D",
                color: inWatchlist ? "#fff" : "#000",
                border: "none",
                marginTop: "10px",
              }}
              onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
            >
              {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </Button>
          )}
        </div>
      </div>

      {/* chart */}
      <CoinInfo coin={coin} />
    </ContainerCp>
  );
};

export default CoinPage;

const ContainerCp = styled.div`
  display: flex;
  background: #151829;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }

  .sidebar_coinpage {
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 25px;
    border-right: 2px solid grey;
    @media (max-width: 600px) {
      width: 100%;
    }
  }

  .headingcp {
    font-weight: bold;
    font-family: Montserrat;
    width: 164px;
    justify-content: flex-start;
    @media (max-width: 400px) {
      align-items: start;
      width: 100%;
    }
  }
  .typos {
    // width: 100%;
    font-family: Montserrat;
    text-align: left;
    padding: 15px 25px;
  }
  .market_data {
    align-self: start;
    padding: 15px 25px 25px 25px;
    paddingtop: 10px;
    width: 100%;
    span {
      display: flex;
      align-items: center;
    }
    @media (max-width: 900px) {
      display: flex;
      flex-direction: column;
      align-items: left;
    }
    @media (max-width: 400px) {
      align-items: start;
    }
  }
`;
