import { Response } from "express";

import Picture from "../../database/models/picture";

import { addPicture } from "./pictureController";

import { RequestAuth } from "../../database/namespaces/expressNamespace";

jest.mock("../../database/models/user");
jest.mock("../../database/models/picture.ts");

describe("Given a addPicture function", () => {
  describe("When it receives new picture", () => {
    test("Then it should invoke res.json() function with picture: Creada correctamente!", async () => {
      const mockRequest = () => {
        const req = {} as RequestAuth;
        return req;
      };

      const mockResponse = () => {
        const res = {} as Response;
        return res;
      };

      const picture = {
        description: "De User Test",
        pictureDate: "2022-02-11T17:53:10.281Z",
        userId: {
          nombreUsuario: "User Test",
          urlFotoUser:
            "https://storage.googleapis.com/instaface-back.appspot.com/instaface-User-Bert-1644602026842-.jpeg",
          id: "6206a2abb4bca75598bd6ac0",
        },
        messageId: [],
        urlPicture:
          "https://storage.googleapis.com/instaface-back.appspot.com/instaface-Picture-angular-logo-1644602059648-.png",
        __v: 1,
        id: "6206a2ccb4bca75598bd6ac3",
      };

      const req = mockRequest();
      req.body = {
        description: "Test add Pictures",
      };
      req.userid = "619e87f964c30a7f3ddb2595";
      req.file = { fileURL: "algo" };

      const res = mockResponse();
      res.json = jest.fn();

      const next = jest.fn();

      Picture.create = jest.fn().mockResolvedValue(picture);

      await addPicture(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        picture: "Creada correctamente!",
      });
    });
  });
});
