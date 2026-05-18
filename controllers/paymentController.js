const paymentModel = require('../models/paymentModel');

const getPaymentsPage = async (req, res) => {
  try {
    const payments = await paymentModel.getAllPayments();

    res.render('payments', {
      title: 'Payments - IronForge GMS',
      payments
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    req.flash('error', 'Failed to load payments.');
    res.redirect('/dashboard');
  }
};

const getAddPaymentPage = async (req, res) => {
  try {
    const members = await paymentModel.getMemberOptions();
    res.render('add-payment', {
      title: 'Add Payment - IronForge GMS',
      payment: null,
      members: members || [],
      formAction: '/payments/add',
      submitLabel: 'Save Payment'
    });
  } catch (error) {
    console.error('Error loading add payment page:', error);
    req.flash('error', 'Failed to load payment form.');
    res.redirect('/payments');
  }
};

const addPayment = async (req, res) => {
  try {
    await paymentModel.createPayment(req.body);
    req.flash('success', 'Payment added successfully.');
    res.redirect('/payments');
  } catch (error) {
    console.error('Error adding payment:', error);
    req.flash('error', 'Failed to add payment.');
    res.redirect('/payments/add');
  }
};

const getEditPaymentPage = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      req.flash('error', 'Invalid payment ID.');
      return res.redirect('/payments');
    }
    const payment = await paymentModel.getPaymentById(id);
    const members = await paymentModel.getMemberOptions();

    if (!payment) {
      req.flash('error', 'Payment not found.');
      return res.redirect('/payments');
    }

    res.render('add-payment', {
      title: 'Edit Payment - IronForge GMS',
      payment,
      members: members || [],
      formAction: `/payments/update/${payment.id}`,
      submitLabel: 'Update Payment'
    });
  } catch (error) {
    console.error('Error loading edit payment page:', error);
    req.flash('error', 'Failed to load edit page.');
    res.redirect('/payments');
  }
};

const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await paymentModel.updatePaymentById(id, req.body);

    if (affectedRows === 0) {
      req.flash('error', 'Payment not found.');
      return res.redirect('/payments');
    }

    req.flash('success', 'Payment updated successfully.');
    res.redirect('/payments');
  } catch (error) {
    console.error('Error updating payment:', error);
    req.flash('error', 'Failed to update payment.');
    res.redirect(`/payments/edit/${req.params.id}`);
  }
};

const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    await paymentModel.deletePaymentById(id);
    req.flash('success', 'Payment deleted successfully.');
    res.redirect('/payments');
  } catch (error) {
    console.error('Error deleting payment:', error);
    req.flash('error', 'Failed to delete payment.');
    res.redirect('/payments');
  }
};

module.exports = {
  getPaymentsPage,
  getAddPaymentPage,
  addPayment,
  getEditPaymentPage,
  updatePayment,
  deletePayment
};
