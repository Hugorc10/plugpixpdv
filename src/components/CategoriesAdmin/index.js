import React, { useState, useEffect } from "react";
import { firestore } from "../../config/Fire";
import { Link } from "react-router-dom";

import { MdKeyboardArrowRight } from "react-icons/md";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CardActionArea from "@material-ui/core/CardActionArea";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import { useAlert } from "../../components/alert/alertContext";
import { createCategory } from "../../util/fire-functions";
import placeholder from "../../assets/images/placeholder.jpg";

import "./styles.css";

const CategoriesAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [logo, setLogo] = useState(null);
  const [refresh, setRefresh] = useState(true);
  const alert = useAlert();

  useEffect(() => {
    const categories = [];

    firestore
      .collection("categorias")
      .limit(6)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const data = doc;
          categories.push(data);
        });
        setCategories(categories);
      })
      .catch((error) => console.log("Algo de errado aconteceu :(", error));
  }, [refresh]);

  const [openProductModal, setOpenProductModal] = React.useState(false);
  const handleOpen = () => {
    setOpenProductModal(true);
  };

  const handleClose = () => {
    setOpenProductModal(false);
  };

  const submit = async (e) => {
    const { name, upload } = e.target.elements;
    if (name.value && upload.value && logo) {
      await createCategory(
        {
          dataDeCriacao: new Date(),
          tipo: name.value,
        },
        logo
      );
      alert.setOptions({
        open: true,
        message: "Categoria criada com sucesso",
        type: "success",
        time: 2000,
      });
      handleClose();
      setRefresh((prev) => !prev);
    } else {
      alert.setOptions({
        open: true,
        message: "Preencha todos os campos",
        type: "error",
        time: 15000,
      });
    }
  };

  return (
    <>
      <section className="section">
        <div className="section-heading">
          <h2 className="section-title">Categorias</h2>
          <Button className="add-offer" variant="outlined" onClick={handleOpen}>
            Adicionar Categoria
          </Button>
          <Link className="see-more" to="categories">
            Veja mais <MdKeyboardArrowRight />
          </Link>
        </div>
        <Grid
          container
          spacing={2}
          alignContent="space-between"
          className="centered-grid"
        >
          {categories &&
            categories.map((category, index) => {
              const cat = category.data();
              return (
                <Grid item className="grid-item" key={index}>
                  <Card className="card">
                    <Link
                      className="grid-item-link"
                      to={`/category/${category.id}`}
                    >
                      <CardActionArea className="action-button">
                        <CardMedia
                          className="card-category-image"
                          component="img"
                          image={cat.url ? cat.url : placeholder}
                          title={cat.tipo}
                        />
                        <CardContent className="card-content">
                          <h3 className="card-name">{cat.tipo}</h3>
                        </CardContent>
                      </CardActionArea>
                    </Link>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className="default-modal categories"
          open={openProductModal}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openProductModal}>
            <form
              className="modal-container"
              onSubmit={(e) => {
                e.preventDefault();
                submit(e);
              }}
            >
              <h3 className="form-title">Adicionar</h3>
              <label className="upload">
                <div className="img-wrapper">
                  <img src={logo || placeholder} />
                </div>
                <input
                  hidden
                  name="upload"
                  type="file"
                  onChange={(e) => {
                    const reader = new FileReader();
                    reader.onloadend = function () {
                      setLogo(reader.result);
                    };
                    if (e.target.files[0]) {
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                />
                <small>Click para enviar o Ícone da nova Categoria</small>
              </label>
              <TextField
                id="name"
                name="name"
                variant="outlined"
                label="Nome da Categoria"
              />
              <button type="submit">Adicionar</button>
            </form>
          </Fade>
        </Modal>
      </section>
    </>
  );
};

export default CategoriesAdmin;
