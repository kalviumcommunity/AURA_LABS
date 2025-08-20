import express from 'express';
import { getStates, getUniversitiesMeta } from '../controllers/metadataController.js';

const router = express.Router();

router.get('/states', getStates);
router.get('/universities/meta', getUniversitiesMeta);

export default router;


