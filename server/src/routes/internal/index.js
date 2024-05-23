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
  GetComponents,
  PostComponent,
  GetComponentDocument,
  PutComponent,
  DeleteComponent,
  PutComponentName,
  DownloadAllScripts,
  DownloadAllComponents,
  GetQueriesPipelines,
  GetQueriesPipelinesDocument,
  PutQueryPipelines,
  PostQueryPipelines,
  PutQueryPipelinesName,
  DeleteQueryPipelines,
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
router.get("/scripts", isAuthenticated, GetScripts);

router.post(
  "/component",
  isAuthenticated,
  isAuthorized(["master", "builder"]),
  PostComponent
);
router.put(
  "/component",
  isAuthenticated,
  isAuthorized(["master", "builder"]),
  PutComponent
);
router.delete(
  "/component/:name",
  isAuthenticated,
  isAuthorized(["master", "builder"]),
  DeleteComponent
);
router.put(
  "/component/:name",
  isAuthenticated,
  isAuthorized(["master", "builder"]),
  PutComponentName
);
router.get("/components", isAuthenticated, GetComponents);

router.get("/queries-pipeline", isAuthenticated, GetQueriesPipelines);
router.post("/queries-pipeline", isAuthenticated, PostQueryPipelines);
router.put("/queries-pipeline", isAuthenticated, PutQueryPipelines);
router.put("/queries-pipeline/:name", isAuthenticated, PutQueryPipelinesName);
router.delete("/queries-pipeline/:name", isAuthenticated, DeleteQueryPipelines);
router.get(
  "/queries-pipeline/:name",
  isAuthenticated,
  GetQueriesPipelinesDocument
);

router.get("/scripts/download", isAuthenticated, DownloadAllScripts);
router.get("/components/download", isAuthenticated, DownloadAllComponents);

router.get("/script-document/:name", isAuthenticated, GetScriptDocument);
router.get("/component-document/:name", isAuthenticated, GetComponentDocument);
router.get("/from-to-document", isAuthenticated, GetFromToDocument);
router.get("/package-data", isAuthenticated, GetPackageData);
router.get("/languages-data", isAuthenticated, GetLanguagesData);
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
