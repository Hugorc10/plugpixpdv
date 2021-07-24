import React, { useEffect, useState } from "react";
import "./style.scss";
import { Col, Row } from "reactstrap";
import Button from "@material-ui/core/Button";
import {
  createPlan,
  updatePlan,
  getRegiobyAgency,
} from "../../util/fire-functions";
import { useAlert } from "../alert/alertContext";

const CreatePlan = ({ setOpen, planProp }) => {
  const alert = useAlert();

  const submit = async (event) => {
    const {
      nome,
      dinheiroParaDistribuir,
      cashbackAte,
      cashbackDaLojaPadrao,
    } = event.target.elements;
    try {
      if (
        nome.value &&
        dinheiroParaDistribuir.value &&
        cashbackAte.value &&
        cashbackDaLojaPadrao.value
      ) {
        if (planProp) {
          await updatePlan(planProp.id, {
            tipo: nome.value,
            dinheiroParaDistribuir: parseFloat(dinheiroParaDistribuir.value),
            cashbackDaLojaPadrao: parseFloat(cashbackDaLojaPadrao.value),
            cashbackAte: parseFloat(cashbackAte.value),
          });
        } else {
          await createPlan({
            tipo: nome.value,
            dinheiroParaDistribuir: parseFloat(dinheiroParaDistribuir.value),
            cashbackDaLojaPadrao: parseFloat(cashbackDaLojaPadrao.value),
            cashbackAte: parseFloat(cashbackAte.value),
          });
        }

        alert.setOptions({
          open: true,
          message: "Plano criado com sucesso!",
          type: "success",
          time: 2000,
        });
        setOpen(false);
      } else {
        alert.setOptions({
          open: true,
          message: "Preencha todos os campos corretamente",
          type: "error",
          time: 15000,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  console.log(planProp);
  return (
    <div className="new-plan modal-container">
      <h2>
        {planProp ? `Configurações do Plano ${planProp.tipo}` : "Novo Plano"}
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(e);
        }}
        className="plan-form"
      >
        <Row>
          <Col xs="6">
            <label className="d-flex align-items-center">
              Nome do Plano:
              <input
                id="nome"
                name="nome"
                defaultValue={planProp ? planProp.tipo : ""}
                label="Nome do Plano"
              />
            </label>
          </Col>
        </Row>
        <Row>
          <Col xs="6">
            <label className="d-flex align-items-center number">
              Comissão:
              <input
                id="dinheiroParaDistribuir"
                name="dinheiroParaDistribuir"
                type="number"
                defaultValue={planProp ? planProp.dinheiroParaDistribuir : ""}
                max={100}
                step="0.1"
                min={0}
                label="Comissão"
              />
              {"%"}
            </label>
          </Col>
        </Row>
        <Row>
          <Col xs="6">
            <label className="d-flex align-items-center number">
              Cashback Máximo:
              <input
                id="cashbackAte"
                name="cashbackAte"
                type="number"
                defaultValue={planProp ? planProp.cashbackAte : ""}
                max={100}
                step="0.1"
                min={0}
                label="Cashback Máximo"
              />
              {"%"}
            </label>
          </Col>
        </Row>
        <Row>
          <Col xs="6">
            <label className="d-flex align-items-center number">
              Cashback Padrão:
              <input
                id="cashbackDaLojaPadrao"
                name="cashbackDaLojaPadrao"
                defaultValue={planProp ? planProp.cashbackDaLojaPadrao : ""}
                type="number"
                max={100}
                step="0.1"
                min={0}
              />
              {"%"}
            </label>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="d-flex justify-content-center">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="submit-cancel"
            >
              Cancelar
            </Button>
            <Button type="submit" className="submit-button">
              {planProp ? "Salvar Alterações" : "Criar"}
            </Button>
          </Col>
        </Row>
      </form>
    </div>
  );
};
export default CreatePlan;
