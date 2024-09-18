import express from 'express';
import * as documentsController from './document.controller';

const router = express.Router();

router.get('/', documentsController.getAll);

router.get('/:id', documentsController.get);

router.post('/', documentsController.create);

router.put('/:id', documentsController.update);

router.delete('/:id', documentsController.remove);

export default router;