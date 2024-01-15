const express = require('express')

// add our router
const vendorRouter = express.Router()
// add the vendor controller
const vendorController = require('../controllers/vendorController.js')

const validationPass = require('../controllers/validationPass.js')


/* -------------------------------
VENDOR ROUTES
-------------------------------- */

// handle POST request to create new vendor
vendorRouter.post("/", vendorController.addVendor)


//handle the get request to display the update vendor status page
vendorRouter.get("/vendorUpdate", (req, res) => {
    res.render('vendor-update');
});



//handle the POST request to update the vendor status
vendorRouter.post('/vendorUpdate', vendorController.updateVendorStatus)
//vendorRouter.post('/vendorUpdate', vendorController.testupdate)

//handle the GET request to get all vendors
vendorRouter.get('/', vendorController.getAllVendor)

// handle the GET request to get one vendor
vendorRouter.get('/id/:vendorId', vendorController.getOneVendor)

/* -------------------------------
ORDER ROUTES
-------------------------------- */


//handle the GET request to view the order details of an order
vendorRouter.get("/orderDetails/:orderId", vendorController.getOneOrder)

//handle the POST request to update the order status
vendorRouter.post('/orderUpdate/:orderId', vendorController.updateOrderStatus)

// handle the GET request to get outstanding orders of the vendor
vendorRouter.get("/id/:vendorId/outstanding", vendorController.getOutstandingOrders)

// handle the GET request to get in progress orders of the vendor
vendorRouter.get("/id/:vendorId/inProgress", vendorController.getInProgressOrders)

// handle the GET request to get fulfilled orders of the vendor
vendorRouter.get("/id/:vendorId/fulfilled", vendorController.getFulfilledOrders)


//handle the GET request to get all orders
vendorRouter.get("/id/:vendorId/allOrders", vendorController.getAllOrder)



/* -------------------------------
Vendor Login & SignUp
-------------------------------- */
//GET login form
vendorRouter.get("/vendor-login", (req, res) => {
    res.render('vendor-login');
});

// Post login form
vendorRouter.post('/vendor-login', vendorController.loginVendor);

// GET signup form
vendorRouter.get("/register", (req, res) => {
    res.render('register');
});

// POST signup form -- signup a new vendor
vendorRouter.post('/register', validationPass.vendorSignUpRule, vendorController.SignUpVednor);

vendorRouter.get('/logout',vendorController.logoutVendor)



//export the router
module.exports = vendorRouter
