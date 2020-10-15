import axios from "axios";

export class APIHandler {
  constructor(APIPrefix) {
    if (!process.env.REACT_APP_BACKEND_URL || !APIPrefix)
      throw new Error(
        "fournir API prefix + URL de base pour effectuer des appels AJAX"
      );

    this.instance = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_URL + APIPrefix,
    });
  }

  createOne(payload) {
    return this.instance.post("/signup", payload);
  }

  getAll() {
    return this.instance.get("/"); // retourne une Promesse
    // return axios.get("http://localhost:8888/users")
  }

  getById(id) {
    return this.instance.get("/" + id);
    // return axios.get("http://localhost:8888/users/${id}")
  }

  deleteOne(id) {
    return this.instance.delete("/" + id);
  }
}