const memberModel = require('../models/memberModel');

const getMembersPage = async (req, res) => {
  try {
    const members = await memberModel.getAllMembers();

    res.render('members', {
      title: 'Members - IronForge GMS',
      members
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    req.flash('error', 'Failed to load members.');
    res.redirect('/dashboard');
  }
};

const getAddMemberPage = (req, res) => {
  return getMemberFormPage(req, res, null);
};

const addMember = async (req, res) => {
  try {
    await memberModel.createMember(req.body);
    req.flash('success', 'Member added successfully.');
    res.redirect('/members');
  } catch (error) {
    console.error('Error adding member:', error);
    req.flash('error', 'Failed to add member.');
    res.redirect('/members/add');
  }
};

const getEditMemberPage = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      req.flash('error', 'Invalid member ID.');
      return res.redirect('/members');
    }
    const member = await memberModel.getMemberById(id);

    if (!member) {
      req.flash('error', 'Member not found.');
      return res.redirect('/members');
    }

    return getMemberFormPage(req, res, member);
  } catch (error) {
    console.error('Error loading edit member page:', error);
    req.flash('error', 'Failed to load edit page.');
    res.redirect('/members');
  }
};

const getMemberFormPage = async (req, res, member) => {
  try {
    const membershipPlans = await memberModel.getMembershipPlanOptions();
    const trainers = await memberModel.getTrainerOptions();

    res.render('add-member', {
      title: member ? 'Edit Member - IronForge GMS' : 'Add Member - IronForge GMS',
      member: member || null,
      membershipPlans: membershipPlans || [],
      trainers: trainers || [],
      formAction: member ? `/members/update/${member.id}` : '/members/add',
      submitLabel: member ? 'Update Member' : 'Save Member'
    });
  } catch (error) {
    console.error('Error loading member form page:', error);
    req.flash('error', 'Failed to load member form.');
    res.redirect('/members');
  }
};

const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await memberModel.updateMemberById(id, req.body);

    if (affectedRows === 0) {
      req.flash('error', 'Member not found.');
      return res.redirect('/members');
    }

    req.flash('success', 'Member updated successfully.');
    res.redirect('/members');
  } catch (error) {
    console.error('Error updating member:', error);
    req.flash('error', 'Failed to update member.');
    res.redirect(`/members/edit/${req.params.id}`);
  }
};

const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    await memberModel.deleteMemberById(id);
    req.flash('success', 'Member deleted successfully.');
    res.redirect('/members');
  } catch (error) {
    console.error('Error deleting member:', error);
    req.flash('error', 'Failed to delete member.');
    res.redirect('/members');
  }
};

module.exports = {
  getMembersPage,
  getAddMemberPage,
  addMember,
  getEditMemberPage,
  updateMember,
  deleteMember
};
