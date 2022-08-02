import {
  HttpResponseDelete,
  HttpResponseGet,
  HttpResponseList,
  HttpResponsePost,
  HttpResponsePut,
} from "@shared/http/domain/HttpResponse"

export type Responses =
  | HttpResponseDelete
  | HttpResponseGet
  | HttpResponseList
  | HttpResponsePost
  | HttpResponsePut
