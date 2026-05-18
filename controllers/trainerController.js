const trainerModel = require('../models/trainerModel');

const getTrainersPage = async (req, res) => {
  try {
    const trainers = await trainerModel.getAllTrainers();

    res.render('trainers', {
      title: 'Trainers - IronForge GMS',
      trainers
    });
  } catch (error) {
    console.error('Error fetching trainers:', error);
    req.flash('error', 'Failed to load trainers.');
    res.redirect('/dashboard');
  }
};

const getAddTrainerPage = (req, res) => {
  res.render('add-trainer', {
    title: 'Add Trainer - IronForge GMS',
    trainer: null,
    formAction: '/trainers/add',
    submitLabel: 'Save Trainer'
  });
};

const addTrainer = async (req, res) => {
  try {
    await trainerModel.createTrainer(req.body);
    req.flash('success', 'Trainer added successfully.');
    res.redirect('/trainers');
  } catch (error) {
    console.error('Error adding trainer:', error);
    req.flash('error', 'Failed to add trainer.');
    res.redirect('/trainers/add');
  }
};

const getEditTrainerPage = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      req.flash('error', 'Invalid trainer ID.');
      return res.redirect('/trainers');
    }
    const trainer = await trainerModel.getTrainerById(id);

    if (!trainer) {
      req.flash('error', 'Trainer not found.');
      return res.redirect('/trainers');
    }

    res.render('add-trainer', {
      title: 'Edit Trainer - IronForge GMS',
      trainer,
      formAction: `/trainers/update/${trainer.id}`,
      submitLabel: 'Update Trainer'
    });
  } catch (error) {
    console.error('Error loading edit trainer page:', error);
    req.flash('error', 'Failed to load edit page.');
    res.redirect('/trainers');
  }
};

const updateTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await trainerModel.updateTrainerById(id, req.body);

    if (affectedRows === 0) {
      req.flash('error', 'Trainer not found.');
      return res.redirect('/trainers');
    }

    req.flash('success', 'Trainer updated successfully.');
    res.redirect('/trainers');
  } catch (error) {
    console.error('Error updating trainer:', error);
    req.flash('error', 'Failed to update trainer.');
    res.redirect(`/trainers/edit/${req.params.id}`);
  }
};

const deleteTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    await trainerModel.deleteTrainerById(id);
    req.flash('success', 'Trainer deleted successfully.');
    res.redirect('/trainers');
  } catch (error) {
    console.error('Error deleting trainer:', error);
    req.flash('error', 'Failed to delete trainer.');
    res.redirect('/trainers');
  }
};

module.exports = {
  getTrainersPage,
  getAddTrainerPage,
  addTrainer,
  getEditTrainerPage,
  updateTrainer,
  deleteTrainer
};
