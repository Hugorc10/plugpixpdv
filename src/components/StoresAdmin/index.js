import React, { useState, useEffect } from "react";
import { firestore } from "../../config/Fire";
import { Link } from "react-router-dom";

import { MdKeyboardArrowRight } from "react-icons/md";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import CardActionArea from "@material-ui/core/CardActionArea";

import placeholder from "../../assets/images/placeholder.jpg";

import "./styles.css";

const StoresAdmin = ({ agency }) => {
  const [stores, setStores] = useState([]);
  const user = JSON.parse(window.localStorage.getItem("@plugpixweb/authData"));

  useEffect(() => {
    const lojas = [];
    if (agency || user.agency) {
      firestore
        .collection("lojas")
        .where("agencia", "==", agency)
        // .orderBy("ordem")
        .limit(6)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const data = doc;
            lojas.push(data);
          });
          setStores(lojas);
        })
        .catch((error) => console.log("Algo de errado aconteceu :(", error));
    } else {
      firestore
        .collection("lojas")
        // .orderBy("ordem", "asc")
        .limit(6)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const data = doc;
            lojas.push(data);
          });
          setStores(lojas);
        })
        .catch((error) => console.log("Algo de errado aconteceu :(", error));
    }
  }, [agency]);

  return (
    <>
      <section className="section">
        <div className="section-heading">
          <h2 className="section-title">Lojas</h2>
          <Link className="see-more" to="stores">
            Veja mais <MdKeyboardArrowRight />
          </Link>
        </div>
        <Grid
          container
          spacing={2}
          alignContent="space-between"
          className="centered-grid"
        >
          {stores &&
            stores.map((store, index) => {
              const st = store.data();
              return (
                <Grid item className="grid-item" key={index}>
                  <Card className="card">
                    <Link className="grid-item-link" to={`/store/${store.id}`}>
                      <CardActionArea className="action-button">
                        <CardMedia
                          className="card-image"
                          image={
                            st.urlImagemDaLogoMarca
                              ? st.urlImagemDaLogoMarca
                              : placeholder
                          }
                          title={st.loja}
                        />
                        <CardContent className="card-content">
                          <h3 className="card-name">{st.nomeDaLoja}</h3>
                        </CardContent>
                      </CardActionArea>
                    </Link>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </section>
    </>
  );
};

export default StoresAdmin;
