const membershipModel = require('../models/membershipModel');

const getMembershipsPage = async (req, res) => {
  try {
    const memberships = await membershipModel.getAllMemberships();

    res.render('memberships', {
      title: 'Memberships - IronForge GMS',
      memberships
    });
  } catch (error) {
    console.error('Error fetching memberships:', error);
    req.flash('error', 'Failed to load memberships.');
    res.redirect('/dashboard');
  }
};

const getAddMembershipPage = (req, res) => {
  res.render('add-membership', {
    title: 'Add Membership - IronForge GMS'
  });
};

const addMembership = async (req, res) => {
  try {
    await membershipModel.createMembership(req.body);
    req.flash('success', 'Membership plan added successfully.');
    res.redirect('/memberships');
  } catch (error) {
    console.error('Error adding membership plan:', error);
    req.flash('error', 'Failed to add membership plan.');
    res.redirect('/memberships/add');
  }
};

const getEditMembershipPage = async (req, res) => {
  try {
    const { id } = req.params;
    const membership = await membershipModel.getMembershipById(id);

    if (!membership) {
      req.flash('error', 'Membership plan not found.');
      return res.redirect('/memberships');
    }

    res.render('edit-membership', {
      title: 'Edit Membership - IronForge GMS',
      membership
    });
  } catch (error) {
    console.error('Error loading edit membership page:', error);
    req.flash('error', 'Failed to load edit page.');
    res.redirect('/memberships');
  }
};

const updateMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await membershipModel.updateMembershipById(id, req.body);

    if (affectedRows === 0) {
      req.flash('error', 'Membership plan not found.');
      return res.redirect('/memberships');
    }

    req.flash('success', 'Membership plan updated successfully.');
    res.redirect('/memberships');
  } catch (error) {
    console.error('Error updating membership plan:', error);
    req.flash('error', 'Failed to update membership plan.');
    res.redirect(`/memberships/edit/${req.params.id}`);
  }
};

const deleteMembership = async (req, res) => {
  try {
    const { id } = req.params;
    await membershipModel.deleteMembershipById(id);
    req.flash('success', 'Membership plan deleted successfully.');
    res.redirect('/memberships');
  } catch (error) {
    console.error('Error deleting membership plan:', error);
    req.flash('error', 'Failed to delete membership plan.');
    res.redirect('/memberships');
  }
};

module.exports = {
  getMembershipsPage,
  getAddMembershipPage,
  addMembership,
  getEditMembershipPage,
  updateMembership,
  deleteMembership
};
