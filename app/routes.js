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

// nunjucks version 

const serviceData = require('./data/data.json')

router.use(function(req, res, next){
  res.locals.serviceData = serviceData
  next()
})

// Route to display all services
router.get('/services', function (req, res) {
  res.render('services.html');  // No data passed; serviceData is directly accessed in the template
});

// Route to display details for a specific service (accessed via query parameter)
router.get('/service-detail', function (req, res) {
  const serviceId = req.query.id;  // Get service ID from query parameters
  res.render('service-detail.html', { serviceId: serviceId }); // Pass service ID to template
});

// second version of proto 

const newdata = require('./data/newdata.json');

// Route for listing Delivery Groups
router.get('/list-delivery', function (req, res) {
  // Extract unique delivery groups and filter out any empty or null values
  const deliveryGroups = [...new Set(newdata
    .map(item => item["Delivery Group"])
    .filter(group => group && group.trim()))]; // Filter out empty, null, or whitespace-only groups
  res.render('list-delivery.html', { deliveryGroups: deliveryGroups });
});

// Route for listing Services within a Delivery Group
router.get('/list-service/:groupIndex', function (req, res) {
  const groupIndex = parseInt(req.params.groupIndex);
  const deliveryGroup = [...new Set(newdata.map(item => item["Delivery Group"]))][groupIndex];
  const services = newdata
    .map((item, index) => ({ ...item, index })) // Attach the actual index of each service
    .filter(item => 
      item["Delivery Group"] === deliveryGroup && 
      item["User facing name"] && 
      item["User facing name"].trim() // Filter out services with empty or null "User facing name"
    );
  res.render('list-service.html', { services: services, group: deliveryGroup, groupIndex: groupIndex });
});

// Route for viewing details of a specific service by index
router.get('/view-service/:serviceIndex/:groupIndex', function (req, res) {
  const serviceIndex = parseInt(req.params.serviceIndex);
  const groupIndex = parseInt(req.params.groupIndex);
  const service = newdata[serviceIndex];
  if (service) {
    res.render('view-service.html', { service: service, groupIndex: groupIndex });
  } else {
    res.status(404).send('Service not found');
  }
});

module.exports = router;
