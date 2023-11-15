import {Endpoint, Method} from "../../shared/api/http/endpoint";
import {NO_AUTHORIZATION} from "../../shared/api/http/endpoint-authorization";

const API_ROOT = '/book'

const getBook:Endpoint = {
  method: Method.GET,
  path: `${API_ROOT}/:id`,
  auth: NO_AUTHORIZATION,
  requestHandler: async (req, res, next) => {
    const id = req.params['id']
  }
}
const getBooks:Endpoint = {
  method: Method.GET,
  path: `${API_ROOT}`,
  auth: NO_AUTHORIZATION,
  requestHandler: async (req, res, next) => {

  }
}
const createBook:Endpoint = {
  method: Method.POST,
  path: `${API_ROOT}`,
  auth: NO_AUTHORIZATION,
  requestHandler: async (req, res, next) => {

  }
}
const updateBook:Endpoint = {
  method: Method.PUT,
  path: `${API_ROOT}/:id`,
  auth: NO_AUTHORIZATION,
  requestHandler: async (req, res, next) => {
    const id = req.params['id']
  }
}
const createNewBookEdition:Endpoint = {
  method: Method.PUT,
  path: `${API_ROOT}/:id/action/create-new-edition`,
  auth: NO_AUTHORIZATION,
  requestHandler: async (req, res, next) => {
    const id = req.params['id']
  }
}

export const BOOK_ENDPOINTS:Array<Endpoint> = [
  getBook,
  getBooks,
  createBook,
  updateBook,
  createNewBookEdition,
]