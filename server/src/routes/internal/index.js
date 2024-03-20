import express from "express";
import {
  GetPackageData,
  GetIconInfo,
  PutActiveDataset,
  GetFromToDocument,
  GetLanguagesData,
  PutActiveLanguage,
  PutDefaultLanguage,
  GetParameters,
  GetParameterDocument,
  PutParameterDocument,
  GetScripts,
  PostScript,
  GetScriptDocument,
  PutScript,
  DeleteScript,
  PutScriptName,
} from "./pages";
import { isAuthorized, isAuthenticated } from "../auth";

const router = express.Router();

router.post(
  "/script",
  isAuthenticated,
  isAuthorized(["master", "builder"]),
  PostScript
);
router.put(
  "/script",
  isAuthenticated,
  isAuthorized(["master", "builder"]),
  PutScript
);
router.delete(
  "/script/:name",
  isAuthenticated,
  isAuthorized(["master", "builder"]),
  DeleteScript
);
router.put(
  "/script/:name",
  isAuthenticated,
  isAuthorized(["master", "builder"]),
  PutScriptName
);
router.get("/script-document/:name", isAuthenticated, GetScriptDocument);
router.get("/from-to-document", isAuthenticated, GetFromToDocument);
router.get("/package-data", isAuthenticated, GetPackageData);
router.get("/languages-data", isAuthenticated, GetLanguagesData);
router.get("/scripts", isAuthenticated, GetScripts);
router.get("/icon-info/:icon", isAuthenticated, GetIconInfo);
router.put("/active-dataset", isAuthenticated, PutActiveDataset);
router.put("/active-language", isAuthenticated, PutActiveLanguage);
router.put("/default-language", isAuthenticated, PutDefaultLanguage);
router.get("/parameters", isAuthenticated, GetParameters);
router.get("/parameter-document", isAuthenticated, GetParameterDocument);
router.put(
  "/parameter-document",
  isAuthenticated,
  isAuthorized(["master"]),
  PutParameterDocument
);

export default router;
