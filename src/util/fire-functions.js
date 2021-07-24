import fire, { storage, firestore } from "../config/Fire";

export async function getStorageCollectionImages(collection, userId) {
  try {
    const imagesList = await storage.ref().child(`${collection}/${userId}`).listAll();
    try {
      const downloadURLS = await Promise.all(imagesList.items.map(async (item) => await item.getDownloadURL()));
      return downloadURLS;
    } catch (error) {
      console.log(error);
    }
  } catch (err) {
    console.log("Algo de errado aconteceu :(", err);
    return err;
  }
}

export const getBillets = async () => {
  const user = await fire.auth().currentUser;
  let userRef = firestore.collection("boletos");
  userRef = await userRef.where("idTitular", "==", user.uid).where("tipo", "==", "cobranca").get();
  let arr = [];
  userRef.forEach((doc) => {
    if (doc.data().boletos && doc.data().boletos.length) arr = [...arr, doc.data()];
  });
  return arr;
};
export async function getFirestoreCollections(collection) {
  try {
    const getData = [];
    await firestore
      .collection(collection)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const data = doc.data();
          getData.push(data);
        });
      })
      .catch((err) => console.log("Algo de errado aconteceu :(", err));

    return getData;
  } catch (err) {
    console.log("Algo de errado aconteceu :(", err);
    return err;
  }
}

export async function getFirestoreCollectionData(collection, userId) {
  try {
    const getUser = await firestore
      .collection(collection)
      .doc(userId)
      .get()
      .then((userData) => userData.data())
      .catch((err) => console.log("Algo de errado aconteceu :(", err));

    return getUser;
  } catch (err) {
    console.log("Algo de errado aconteceu :(", err);
    return err;
  }
}

export async function getFirestoreCollectionDataByAttribute(collection, attribute, attributeValue, orderBy) {
  try {
    const getData = [];
    let ref = attributeValue ? await firestore.collection(collection).where(attribute, "==", attributeValue) : await firestore.collection(collection);
    if (orderBy) {
      ref = ref.orderBy(orderBy);
    }
    await ref.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        const data = { ...doc.data(), id: doc.id };
        getData.push(data);
      });
    });
    // .catch((err) => console.log("Algo de errado aconteceu :(", err));

    return getData;
  } catch (err) {
    console.log("Algo de errado aconteceu :(", err);
    return err;
  }
}

export function setNewCollectionDoc(collection, userData, userId) {
  if (collection === "carteirasDigitais") {
    firestore.collection(collection).add(userData);

    firestore.collection("usuarios").doc(userId).update({
      situacao: "Aprovado",
      possuiCarteira: true,
    });
  }
}

export const getWalletById = async (userId) => {
  const res = await firestore.collection("carteirasDigitais").where("idUsuario", "==", userId).get();
  let wallet = null;
  res.forEach((doc) => {
    wallet = { ...doc.data(), id: doc.id };
  });
  return wallet;
};

export const getAgencies = async () => {
  const regionsReference = firestore.collection("regioes");
  const regions = await regionsReference.get();
  const agenciesArr = [];
  regions.forEach((doc) => {
    agenciesArr.push({ id: doc.id, ...doc.data(), gerente: null });
  });
  return agenciesArr.length ? agenciesArr : null;
};

export const getPlans = async () => {
  const regionsReference = firestore.collection("planos");
  const regions = await regionsReference.get();
  const agenciesArr = [];
  regions.forEach((doc) => {
    agenciesArr.push({ id: doc.id, ...doc.data() });
  });
  return agenciesArr.length ? agenciesArr : null;
};

export const getPjUnset = async (agencia) => {
  const userFetchReference = firestore
    .collection("usuarios")
    .where("situacao", "==", "Em análise")
    .where("tipoDeUsuario", "==", "Pessoa Jurídica")
    .where("agencia", "in", ["0001", agencia]);
  const userFetch = await userFetchReference.get();
  const users = [];
  userFetch.forEach((doc) => {
    users.push({ ...doc.data(), id: doc.id });
  });
  return users.length ? users : null;
};

export const getUserByAgency = async (agencia) => {
  const userFetchReference = agencia ? firestore.collection("usuarios").where("agencia", "==", agencia) : firestore.collection("usuarios");
  const userFetch = await userFetchReference.get();
  const users = [];
  userFetch.forEach((doc) => {
    if (doc.data().tipoDeUsuario !== "ADM Master") {
      users.push({ ...doc.data(), id: doc.id });
    }
  });
  return users.length ? users : null;
};
export const getStoreCompleted = async (agencia) => {
  const categorias = agencia ? await firestore.collection("lojas").get() : await firestore.collection("lojas").get();
  const arr = [];
  categorias.forEach((doc) => {
    if (doc.data().typeStore !== "demo") {
      arr.push(doc.data());
    }
  });
  return arr;
};
export const getWallet = async () => {
  const user = await fire.auth().currentUser;
  // const currentUser = await db.collection("usuarios").doc(user.uid);
  if (user) {
    const carteiras = await firestore.collection("carteirasDigitais");

    const myWallet = await carteiras.where("idUsuario", "==", user.uid).get();
    let arr = null;
    myWallet.forEach((doc) => {
      arr = {
        ...{ id: doc.id },
        ...doc.data(),
      };
    });
    return arr;
  }
  return null;
};
export const userData = async () => {
  const user = await fire.auth().currentUser;
  if (user && user.uid) {
    const userCollection = await fire.firestore().collection("usuarios").doc(user.uid).get();
    const userCollectionData = userCollection.data();
    return { ...user, ...userCollectionData };
  }
  return null;
};
export const getWalletByUid = async (id) => {
  const carteiras = await firestore.collection("carteirasDigitais");
  const myWallet = await carteiras.where("idUsuario", "==", id).get();
  let arr = null;
  myWallet.forEach((doc) => {
    arr = { id: doc.id, ...doc.data() };
  });
  return arr;
};
export const getUserByIdplug = async (idPlug) => {
  const userFetchReference = idPlug ? firestore.collection("usuarios").where("idPlug", "==", idPlug) : firestore.collection("usuarios");
  const userFetch = await userFetchReference.get();
  const users = [];
  userFetch.forEach((doc) => {
    if (doc.data().tipoDeUsuario !== "ADM Master") {
      users.push({ ...doc.data(), id: doc.id });
    }
  });
  return users.length ? users : null;
};

export const getUserByCPF = async (cpf) => {
  const userFetchReference = cpf ? firestore.collection("usuarios").where("cpf", "==", cpf) : firestore.collection("usuarios");
  const userFetch = await userFetchReference.get();
  const users = [];
  userFetch.forEach((doc) => {
    if (doc.data().tipoDeUsuario !== "ADM Master") {
      users.push({ ...doc.data(), id: doc.id });
    }
  });
  return users.length ? users : null;
};

export const getUserFiltered = async (agencia) => {
  let userFetchReference = firestore.collection("usuarios");
  if (agencia) {
    userFetchReference = userFetchReference.where("agencia", "==", agencia);
  }

  const userFetch = await userFetchReference.get();
  const users = [];
  userFetch.forEach((doc) => {
    if (doc.data().tipoDeUsuario !== "ADM Master") {
      users.push({ ...doc.data(), id: doc.id });
    }
  });
  return users.length ? users : null;
};

export const getWallets = async (agencia) => {
  const walletsReference = agencia ? firestore.collection("carteirasDigitais").where("agencia", "==", agencia) : firestore.collection("carteirasDigitais");
  const wallets = await walletsReference.get();
  const arr = [];
  wallets.forEach((doc) => {
    arr.push({ ...doc.data(), id: doc.id });
  });
  return arr.length ? arr : null;
};

export const getTrasactions = async (agencia) => {
  const transaction = [];
  const trasferenceRef = agencia ? firestore.collection("transacoes").where("agenciaTitular", "==", agencia) : firestore.collection("transacoes");

  // const trasactionsRef = firestore
  //   .collection("transacoes")
  //   .where("agenciaTitular", "==", agencia);

  const transferenceFetch = await trasferenceRef.get();
  // const transactionFetch = await trasactionsRef.get();

  transferenceFetch.forEach((doc) => {
    transaction.push({ ...doc.data(), id: doc.id });
  });

  // transactionFetch.forEach((doc) => {
  //   transaction.push({ ...doc.data(), id: doc.id });
  // });

  return transaction.length ? transaction : null;
};

export const getTrasactionsPendent = async (agencia) => {
  const transaction = [];
  const trasferenceRef = agencia
    ? firestore.collection("cashbacks").where("agenciaTitular", "==", agencia).where("pedente", "==", true)
    : firestore.collection("cashbacks").where("pedente", "==", true);

  const transferenceFetch = await trasferenceRef.get();

  transferenceFetch.forEach((doc) => {
    transaction.push({ ...doc.data(), id: doc.id });
  });

  return transaction.length ? transaction : null;
};

export const aproveTransaction = async (transaction, id) => {
  try {
    await firestore.collection("cashbacks").doc(id).updta({ pendente: false });
  } catch (error) {
    return error;
  }
};

export const updateStorage = async (id, name, image) => {
  try {
    const storageRef = storage.ref();
    const iconeRef = storageRef.child(`categorias/${id}/${name}.jpg`);
    await iconeRef.putString(image, "data_url");
    const iconeUrl = await iconeRef.getDownloadURL();

    return iconeUrl;
  } catch (error) {
    return error;
  }
};

export const createCategory = async (data, image) => {
  try {
    const user = await fire.auth().currentUser;
    const categoryRef = await firestore.collection("categorias").add(data);
    const storageRef = storage.ref();
    const iconeRef = storageRef.child(`categorias/${categoryRef.id}/${data.tipo}.jpg`);
    await iconeRef.putString(image, "data_url");
    const iconeUrl = await iconeRef.getDownloadURL();
    categoryRef.update({
      url: iconeUrl,
      usuarioQueCriou: user.uid,
    });
    return categoryRef;
  } catch (error) {
    return error;
  }
};

export const createProduct = async (data, image) => {
  try {
    const user = await fire.auth().currentUser;
    const productRef = await firestore.collection("produtos").add(data);
    const storageRef = storage.ref();
    const iconeRef = storageRef.child(`produtos/${productRef.id}/${data.nome}.jpg`);
    await iconeRef.putString(image, "data_url");
    const iconeUrl = await iconeRef.getDownloadURL();
    productRef.update({
      url: iconeUrl,
      usuarioQueCriou: user.uid,
    });
    return productRef;
  } catch (error) {
    return error;
  }
};

export const updateProduct = async (id, data, image) => {
  try {
    const user = await fire.auth().currentUser;
    const productRef = await firestore.collection("produtos").doc(id).update(data);
    const storageRef = storage.ref();
    const iconeRef = storageRef.child(`produtos/${id}/${data.nome}.jpg`);
    await iconeRef.putString(image, "data_url");
    const iconeUrl = await iconeRef.getDownloadURL();
    firestore.collection("produtos").doc(id).update({
      url: iconeUrl,
      usuarioQueCriou: user.uid,
    });
    return productRef;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const getRegiobyAgency = async (agency) => {
  const regionsReference = firestore.collection("regioes").where("agencia", "==", agency);
  const regions = await regionsReference.get();
  let agenciesArr = null;
  regions.forEach((doc) => {
    agenciesArr = { ...doc.data(), id: doc.id };
  });
  return agenciesArr;
};

export const createNewAgency = async (agency) => {
  const regionsReference = firestore.collection("regioes");
  const regions = await regionsReference.add(agency);

  return regions;
};

export const createPlan = async (plan) => {
  const planReference = firestore.collection("planos");
  const planResp = await planReference.add(plan);

  return planResp;
};

export const updatePlan = async (doc, plan) => {
  const planReference = firestore.collection("planos").doc(doc);
  const planResp = await planReference.update(plan);

  return planResp;
};

export const createNewStore = async (store) => {
  const regionsReference = firestore.collection("lojas");
  const storeResp = await regionsReference.add(store);

  return storeResp;
};

export const getStores = async (region) => {
  let regionsReference = firestore.collection("lojas");
  let resp = null;
  if (region) {
    resp = await regionsReference.where("agencia", "==", region).get();
  } else {
    resp = await regionsReference.get();
  }
  let storesArr = [];
  resp.forEach((doc) => {
    storesArr.push({ ...doc.data(), id: doc.id });
  });
  return storesArr;
};

export const updateAgency = async (id, agency) => {
  const regionsReference = firestore.collection("regioes").doc(id);
  const regions = await regionsReference.update(agency);

  return regions;
};

export const createWalletStore = async (data) => {
  const regionsReference = firestore.collection("carteirasDigitais");
  const storeResp = await regionsReference.add(data);

  return storeResp;
};

export const sendNotification = async (msg, uid, title) => {
  const regionsReference = firestore.collection("notificacoesPush");
  const storeResp = await regionsReference.add({
    descricao: msg,
    destinatario: uid,
    titulo: title,
  });

  return storeResp;
};

export const sendEmail = async (msg, uid, title) => {
  const regionsReference = firestore.collection("emails");
  const storeResp = await regionsReference.add({
    descricao: msg,
    destinatario: uid,
    titulo: title,
  });

  return storeResp;
};

export async function updateToStore(id, data) {
  var docId = "";
  const snapshot = await firestore.collection("carteirasDigitais").where("idUsuario", "==", id).get();
  snapshot.forEach((doc) => {
    docId = doc.id;
  });

  var plano = "";
  const snapshot2 = await firestore.collection("planos").where("tipo", "==", data.tipo).get();
  snapshot2.forEach((doc) => {
    plano = doc.data().tipo;
  });

  const upData = {
    cashbackDaLoja: 0,
    planoAssociado: plano,
    tipoDoPlanoAssociado: data.tipo,
    planoAssociadoDinheiroParaDistribuir: data.dinheiroParaDistribuir,
    planoAssociadoMaximoCashbackUsuario: data.cashbackAte,
  };

  firestore.collection("carteirasDigitais").doc(docId).update(upData);
}
