import express from 'express';
import {
  GetChecklistReferences,
  GetChecklistRecipe,
  GetChecklistRegions,
  GetChecklistSchemas,
  PutChecklistReference,
  PutReferenceToSchema,
  PostImage,
} from './pages';
import { isAuthorized, isAuthenticated } from '../auth';

const router = express.Router();

router.get('/references', isAuthenticated, isAuthorized(['master', 'builder']), GetChecklistReferences);
router.get('/regions/:id', isAuthenticated, isAuthorized(['master', 'builder']), GetChecklistRegions);
router.get('/recipe', GetChecklistRecipe);
router.get('/schemas', isAuthenticated, isAuthorized(['master', 'builder']), GetChecklistSchemas);
router.put('/reference', isAuthenticated, isAuthorized(['master', 'builder']), PutChecklistReference);
router.put('/reference-to-schema', isAuthenticated, isAuthorized(['master', 'builder']), PutReferenceToSchema);
router.post('/image', PostImage);

export default router;
