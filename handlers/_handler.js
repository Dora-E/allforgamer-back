import axios from "axios";

export function APIHandler(APIPrefix) {
  return (() => { // IIFE (Immediatly Invoked Function Expression)
    const instance = axios.create({ // une méthode d'axios
      baseURL: process.env.REACT_APP_BACKEND_URL + APIPrefix || "", // utile pour normaliser la connection à l'API back
    });

    const getAll = () => instance.get("/");

    const getById = (id) => instance.get("/" + id);

    const getOne = (path, query) => instance.get("/" + path, { query });

    return { // typeof du retour de l'IIFE ? object
      instance,
      getAll,
      getById,
      getOne,
    };
  })();
}
