const express = require('express');
const profileController = require('../controllers/profileController');

const router = express.Router();

router.get('/', profileController.getAllProfiles);

router.post('/', profileController.createProfile);

router.get('/:id', profileController.getProfileById);

router.patch('/:id', profileController.updateProfile);

router.delete('/:id', profileController.deleteProfile);

module.exports = router;
