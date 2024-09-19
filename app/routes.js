//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here


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

const newdata = require('./data/newdata-v2.json');

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
