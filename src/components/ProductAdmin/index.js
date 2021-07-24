import React, { useState, useEffect } from "react";
import { firestore } from "../../config/Fire";
import { Link } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import placeholder from "../../assets/images/placeholder.jpg";
import {
  getStores,
  createProduct,
  sendNotification,
  getUserByAgency,
} from "../../util/fire-functions";
import { priceFormat } from "../../util/functions";
import { useAlert } from "../../components/alert/alertContext";
import "./styles.css";

const ProductAdmin = ({ agency }) => {
  const user = JSON.parse(window.localStorage.getItem("@plugpixweb/authData"));
  const [products, setProducts] = useState([]);
  const [image, setImage] = useState();
  const [selectedStore, setSelectedStore] = useState();
  const [allUsers, setAllUsers] = useState(false);
  const [lojas, setLojas] = useState([]);
  const alert = useAlert();

  useEffect(() => {
    const produtos = [];
    if (agency) {
      firestore
        .collection("produtos")
        .where("agencia", "==", agency)
        .limit(6)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const data = doc;
            produtos.push(data);
          });
          setProducts(produtos);
        })
        .catch((error) => console.log("Algo de errado aconteceu :(", error));
    } else {
      firestore
        .collection("produtos")
        .limit(6)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const data = doc;
            produtos.push(data);
          });
          setProducts(produtos);
        })
        .catch((error) => console.log("Algo de errado aconteceu :(", error));
    }

    (async () => {
      const res = await getStores(user.agency || agency || null);
      setLojas(res);
    })();
  }, [agency]);

  const [openProductModal, setOpenProductModal] = useState(false);
  const handleOpen = () => {
    setOpenProductModal(true);
  };

  const handleClose = () => {
    setOpenProductModal(false);
    window.location.reload();
  };
  const submit = async (e) => {
    const {
      name,
      store,
      imageInput,
      price,
      cashback,
      descricao,
    } = e.target.elements;
    if (
      name.value &&
      store.value &&
      imageInput.value &&
      price.value &&
      cashback.value &&
      descricao.value
    ) {
      await createProduct(
        {
          agencia: selectedStore.agencia,
          nome: name.value,
          descricao: descricao.value,
          dadosDaLoja: selectedStore,
          cashbackDaOferta: parseInt(cashback.value),
          valor: parseFloat(price.value),
        },
        image
      );
      alert.setOptions({
        open: true,
        message: "Produto criada com sucesso",
        type: "success",
        time: 2000,
      });
      if (allUsers && selectedStore.agencia) {
        const users = await getUserByAgency(selectedStore.agencia);
        const reqs = [];
        users.forEach(async (item) => {
          reqs.push(
            sendNotification(
              `O produto ${name.value} está disponível na loja ${selectedStore.nomeDaLoja} com cashback de ${cashback.value}%`,
              item.id,
              "Nova Loja na sua Região!"
            )
          );
        });
        await Promise.all(reqs);
      }

      handleClose();
    } else {
      alert.setOptions({
        open: true,
        message: "Preencha todos os campos corretamente",
        type: "error",
        time: 15000,
      });
    }
  };

  return (
    <>
      <section className="section">
        <div className="section-heading">
          <h2 className="section-title">Ofertas</h2>
          <Button className="add-offer" variant="outlined" onClick={handleOpen}>
            Adicionar Oferta
          </Button>
          <Link className="see-more" to="cashback-offers">
            Veja mais <MdKeyboardArrowRight />
          </Link>
        </div>
        <Grid
          container
          spacing={2}
          alignContent="space-between"
          className="shopping-grid product-grid"
        >
          {products && products.length > 0 ? (
            products.map((product, index) => {
              const prod = product.data();
              return (
                <Grid item className="grid-item" key={index}>
                  <Card className="card">
                    <Link
                      className="grid-item-link"
                      to={`/cashback-offer/${product.id}`}
                    >
                      <CardActionArea className="action-button">
                        <CardMedia
                          className="card-image"
                          image={prod.url ? prod.url : placeholder}
                          title={prod.produto}
                        />
                        <CardContent className="card-content">
                          <h3 className="card-name">{prod.nome}</h3>
                          <p className="product-details">
                            <strong>Preço:</strong> {priceFormat(prod.valor)}
                          </p>
                          <p className="product-details">
                            <strong>Cashback:</strong> {prod.cashbackDaOferta}%
                          </p>
                          <p className="product-details">
                            <strong>Loja:</strong> {prod.dadosDaLoja.nomeDaLoja}
                          </p>
                        </CardContent>
                      </CardActionArea>
                    </Link>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <div>Nada encontrado!</div>
          )}
        </Grid>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className="default-modal"
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
              <h3 className="form-title">Adicionar Produto</h3>

              <label className="logo-loja">
                <div className="img-wrapper">
                  <img src={image || placeholder} />
                </div>
                <input
                  hidden
                  name="imageInput"
                  type="file"
                  onChange={(e) => {
                    const reader = new FileReader();
                    reader.onloadend = function () {
                      setImage(reader.result);
                    };
                    if (e.target.files[0]) {
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                />
                <small>clique para carregar a foto da sua Oferta</small>
              </label>

              <TextField
                id="name"
                name="name"
                variant="outlined"
                label="Nome do Produto"
              />
              <TextField
                id="descricao"
                name="descricao"
                variant="outlined"
                label="Descrição"
              />

              <TextField
                id="price"
                name="price"
                variant="outlined"
                label="Preço"
              />
              <Autocomplete
                options={lojas}
                getOptionLabel={(option) => {
                  return `${option.nomeDaLoja}`;
                }}
                name="store"
                id="store"
                onChange={(event, newValue) => {
                  setSelectedStore(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Loja"
                    margin="normal"
                    variant="outlined"
                  />
                )}
              />

              <TextField
                id="cashback"
                name="cashback"
                type="number"
                variant="outlined"
                label="Cashback"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={allUsers}
                    color="primary"
                    label="Enviar Notificões para todos os usuários dessa região"
                    onChange={() => {
                      setAllUsers((prev) => !prev);
                    }}
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                }
                label="Enviar Oferta para todos os usuários"
              />

              <button type="submit">Adicionar</button>
            </form>
          </Fade>
        </Modal>
      </section>
    </>
  );
};

export default ProductAdmin;
