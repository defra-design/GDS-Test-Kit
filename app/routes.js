//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

router.post('/add-entry', function (req, res) {
  // Check if the session data for entries exists; if not, create an empty array
  if (!req.session.data.entries) {
	req.session.data.entries = [];
  }

  // Get the submitted name and address from the form
  const name = req.body.name;
  const address = req.body.address;

  // Add the new entry to the session array
  req.session.data.entries.push({ name: name, address: address });

  // Redirect back to the form or to the view page
  res.redirect('/view-entries');
});

router.get('/view-entries', function (req, res) {
  // Get the stored entries from the session, or default to an empty array if none exist
  const entries = req.session.data.entries || [];
  // Render the view-entries template, passing the list of entries
  res.render('view-entries', { entries: entries });
});

router.get('/remove-entry/:index', function (req, res) {
  // Get the index of the entry to be removed from the URL
  const index = req.params.index;
  // Check if entries exist in the session
  if (req.session.data.entries && req.session.data.entries.length > index) {
	// Remove the entry at the specified index
	req.session.data.entries.splice(index, 1);
  }
  // Redirect back to the view-entries page
  res.redirect('/view-entries');
});

// cards 

// Route to render the card view (GET)
router.get('/card-view', function (req, res) {
	res.render('card-view'); // Assuming 'card-view.html' is a Nunjucks template
});

// POST route to handle the form submission for details page
router.post('/details', function (req, res) {
	const id = req.body.id; // Capture the ID from the form submission
	res.redirect(`/details/${id}`); // Redirect to a URL that includes the ID
});

// Route to render the details page (GET)
router.get('/details/:id', function (req, res) {
	const id = req.params.id; // Get the ID from the URL
	res.render('details', { id: id }); // Pass the ID to the details page
});