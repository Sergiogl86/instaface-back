import { Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../database/models/user";

import { addUser, loginUser } from "./usersController";

import { RequestAuth } from "../../database/namespaces/expressNamespace";

jest.mock("../../database/models/user");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Given a addUser function", () => {
  describe("When it receives new user", () => {
    test("Then it should invoke res.json() function with a new user", async () => {
      const mockRequest = () => {
        const req = {} as RequestAuth;
        return req;
      };

      const mockResponse = () => {
        const res = {} as Response;
        return res;
      };

      const req = mockRequest();
      req.body = {
        nombre: "Usuario_Admin",
        nombreUsuario: "Usuario_Admin",
        password: "1234",
      };
      req.file = { fileURL: "algo" };

      const user = {
        username: "Usuario_Admin",
        password:
          "$2b$10$.xShGXjq4bjeueI7/9/DquWq5AIJ0d.mBxYs/lmMnf9FFollI4pMC",
        id: "618c181075e76774517f1aa0",
      };

      const res = mockResponse();
      res.json = jest.fn();

      const next = jest.fn();

      bcrypt.hash = jest.fn().mockResolvedValue(user.password);
      User.create = jest.fn().mockResolvedValue(user);

      await addUser(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ user: "Creado correctamente!" });
    });
  });
  describe("When it receives new user with wrong user", () => {
    test("Then it should invoke next() function with a error", async () => {
      const mockRequest = () => {
        const req = {} as RequestAuth;
        return req;
      };

      const mockResponse = () => {
        const res = {} as Response;
        return res;
      };

      const req = mockRequest();
      req.body = {
        nombre: "Usuario_Admin",
        nombreUsuario: "Usuario_Admin",
        password: "1234",
      };
      req.file = { fileURL: "algo" };

      const user = {
        username: "Usuario_Admin",
        password:
          "$2b$10$.xShGXjq4bjeueI7/9/DquWq5AIJ0d.mBxYs/lmMnf9FFollI4pMC",
        isAdmin: true,
        id: "618c181075e76774517f1aa0",
      };

      const res = mockResponse();
      res.json = jest.fn();

      const next = jest.fn();

      const expectedError = {
        message: "Datos erroneos!",
        code: 400,
      };

      bcrypt.hash = jest.fn().mockResolvedValue(user.password);
      User.create = jest.fn().mockRejectedValue({});

      await addUser(req, res, next);

      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});

describe("Given a loginUser function", () => {
  describe("When it receives existing user login", () => {
    test("Then it should invoke res.json() function with a new token", async () => {
      const mockRequest = () => {
        const req = {} as Request;
        return req;
      };

      const mockResponse = () => {
        const res = {} as Response;
        return res;
      };

      const req = mockRequest();
      req.body = {
        nombreUsuario: "Sergio",
        password: "entrar",
      };

      const user = {
        nombreUsuario: "Usuario_Admin",
        password:
          "$2b$10$.xShGXjq4bjeueI7/9/DquWq5AIJ0d.mBxYs/lmMnf9FFollI4pMC",
      };

      const expectedToken = {
        token: "Token_Bonito",
      };

      const res = mockResponse();
      res.json = jest.fn();

      const next = jest.fn();

      User.findOne = jest.fn().mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue("Token_Bonito");

      await loginUser(req, res, next);

      expect(res.json).toHaveBeenCalledWith(expectedToken);
    });
  });
  describe("When it receives non existing user login", () => {
    test("Then it should invoke next() function with a error", async () => {
      const mockRequest = () => {
        const req = {} as Request;
        return req;
      };

      const mockResponse = () => {
        const res = {} as Response;
        return res;
      };

      const req = mockRequest();
      req.body = {
        nombreUsuario: "Sergio",
        password: "entrar",
      };

      const res = mockResponse();
      res.json = jest.fn();

      const expectedError = {
        message: "Error de credenciales!",
        code: 401,
      };

      const next = jest.fn();

      User.findOne = jest.fn().mockResolvedValue(null);

      await loginUser(req, res, next);

      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
  describe("When it receives non correct user login password", () => {
    test("Then it should invoke next() function with a error", async () => {
      const mockRequest = () => {
        const req = {} as Request;
        return req;
      };

      const mockResponse = () => {
        const res = {} as Response;
        return res;
      };

      const req = mockRequest();
      req.body = {
        nombreUsuario: "Sergio",
        password: "entrar",
      };

      const res = mockResponse();
      res.json = jest.fn();

      const user = {
        username: "Usuario_Admin",
        password:
          "$2b$10$.xShGXjq4bjeueI7/9/DquWq5AIJ0d.mBxYs/lmMnf9FFollI4pMC",
      };

      const expectedError = {
        message: "Error de credenciales!",
        code: 401,
      };

      const next = jest.fn();

      User.findOne = jest.fn().mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await loginUser(req, res, next);

      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});
