import {Endpoint, Method} from "../../shared/api/http/endpoint";
import {NO_AUTHORIZATION} from "../../shared/api/http/endpoint-authorization";
import {bookService} from "../service/book-service";
import {optionalInteger, optionalString} from "../../shared/api/http/query-param-reader";
import {JSONSchemaType} from "ajv";
import {BookCreationRequest, PageCreationRequest} from "../component/book-creator";
import {jsonValidator} from "../../shared/api/json-validator";
import {BookUpdateRequest, PageUpdateRequest} from "../component/book-updater";
import {NewEditionReleaseRequest} from "../component/book-new-edition-releaser";

const API_ROOT = '/book'

const getBook:Endpoint = {
  method: Method.GET,
  path: `${API_ROOT}/:id`,
  auth: NO_AUTHORIZATION,
  requestHandler: async (req, res, next) => {
    const id = req.params['id']
    return bookService.getBook(id)
  }
}
const getBooks:Endpoint = {
  method: Method.GET,
  path: `${API_ROOT}`,
  auth: NO_AUTHORIZATION,
  requestHandler: async (req, res, next) => {
    const queryParams = req.query
    return bookService.getBooks({
      name: optionalString(queryParams, 'name'),
      edition: optionalInteger(queryParams, 'edition')
    })
  }
}

const createPageSchema:JSONSchemaType<PageCreationRequest> = {
  type: "object",
  additionalProperties: false,
  required: [ "pageNumber", "content" ],
  properties: {
    pageNumber: { type: "number" },
    content: { type: "string" }
  }
}
const createBookSchema:JSONSchemaType<BookCreationRequest> = {
  type: "object",
  additionalProperties: false,
  required: ["name", "edition", "pages"],
  properties: {
    name: { type: "string" },
    edition: { type: "number" },
    pages: {
      type: "array",
      items: createPageSchema
    }
  }
}
const createBook:Endpoint = {
  method: Method.POST,
  path: `${API_ROOT}`,
  auth: NO_AUTHORIZATION,
  requestHandler: async (req, res, next) => {
    const request = jsonValidator.validate<BookCreationRequest>(req.body, createBookSchema);
    return bookService.createBook(request)
  }
}

const updatePageSchema:JSONSchemaType<PageUpdateRequest> = {
  type: "object",
  additionalProperties: false,
  required: ["id"],
  properties: {
    id: { type: "string" },
    pageNumber: { type: "number", nullable: true },
    content: { type: "string", nullable: true },
  }
}
const updateBookSchema:JSONSchemaType<Omit<BookUpdateRequest, 'id'>> = {
  type: "object",
  additionalProperties: false,
  required: [],
  properties: {
    name: {type: "string", nullable: true},
    edition: {type: "number", nullable: true},
    pages: {
      type: "array",
      items: createPageSchema,
      nullable: true,
    }
  }
}
const updateBook:Endpoint = {
  method: Method.PUT,
  path: `${API_ROOT}/:id`,
  auth: NO_AUTHORIZATION,
  requestHandler: async (req, res, next) => {
    const id = req.params['id']
    const request = jsonValidator.validate<Omit<BookUpdateRequest, 'id'>>(req.body, updateBookSchema)
    return bookService.updateBook({
      id,
      ...request
    })
  }
}

const releaseNewEditionSchema:JSONSchemaType<Omit<NewEditionReleaseRequest, 'bookId'>> = {
  type: "object",
  additionalProperties: false,
  required: ["edition", "updatedPages"],
  properties: {
    edition: {type: "number"},
    updatedPages: {
      type: "array",
      items: createPageSchema,
      nullable: true,
    }
  }
}
const releaseNewBookEdition:Endpoint = {
  method: Method.PUT,
  path: `${API_ROOT}/:id/action/release-new-edition`,
  auth: NO_AUTHORIZATION,
  requestHandler: async (req, res, next) => {
    const id = req.params['id']
    const request = jsonValidator.validate<Omit<NewEditionReleaseRequest, 'bookId'>>(req.body, releaseNewEditionSchema)
    return bookService.releaseNewBookEdition({
      bookId: id,
      ...request
    })
  }
}

export const BOOK_ENDPOINTS:Array<Endpoint> = [
  getBook,
  getBooks,
  createBook,
  updateBook,
  releaseNewBookEdition,
]