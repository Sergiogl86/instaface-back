import * as express from "express";

export interface RequestAuth extends express.Request {
  userid?: string;
  file?: any;
}
