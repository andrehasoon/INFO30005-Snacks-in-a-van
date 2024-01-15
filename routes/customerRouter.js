const express = require('express')
// add our router
const customerRouter = express.Router()
// require the snacks controller
const customerController = require('../controllers/customerController.js')
const validationPass = require('../controllers/validationPass.js')


/* -------------------------------
CUSTOMER APP VENDOR MAP FCUNTION
-------------------------------- */

// GET requests for show the vans in map
customerRouter.get("/vanMap", customerController.getVanMap)

//POST requests for the Van selection from the customer
customerRouter.post("/vanMap", customerController.selectAvan)




/* -------------------------------
Login & Sign Up
-------------------------------- */

//GET login form

customerRouter.get("/login",(req, res) => {
    res.render('login');
});

// Post login form
customerRouter.post('/login', customerController.loginCustomer);

// GET signup form
customerRouter.get("/signup", (req, res) => {
    res.render('signup');
});

// POST signup form -- signup a new user
customerRouter.post('/signup', validationPass.customerSignUpRule,customerController.SignUpCustomer);

// // POST LOGOUT
customerRouter.get('/logout',customerController.logoutCustomer)

customerRouter.get("/customer-info",customerController.isLoggedIn, customerController.getCustomerInfo);

customerRouter.get("/customer-edit", customerController.isLoggedIn,(req, res) => {
    res.render('customer-edit');
})

customerRouter.post("/customer-edit", customerController.updateCusomterInfo);





/* -------------------------------
SNACK FUNCTIONS
-------------------------------- */

// handle the GET request to get all snacks
customerRouter.get('/snacks', customerController.getAllSnacks)
// handle the GET request to get one snack
customerRouter.get('/snacks/:snackId', customerController.getOneSnack)



/*-------------------------------
ORDER FUNCTIONS
---------------------------------*/

// POST requests
// handle the POST request to add the order to database
customerRouter.post("/addOrder", customerController.addOrder)
customerRouter.get("/myOrders", customerController.getOrders)
customerRouter.post("/cancelOrder", customerController.cancelOrder)
customerRouter.post("/changeOrder", customerController.changeOrder)


/*-------------------------------
SHOPPING CART and ORDER FUNCTIONS
---------------------------------*/

customerRouter.post("/snacks", customerController.setVendor)
//handle the POST request to add the snack to shopping cart
customerRouter.post('/snacks/:snackId', customerController.addToCart)

// handle the GET request to check the shopping cart
customerRouter.get('/shoppingCart', customerController.getShoppingCart)

//handle the GET request to go to the Check out page
customerRouter.get('/checkOut', customerController.getCheckOutInfo)

//handle the GET request to remove an item from shopping cart

customerRouter.get('/shoppingCart/remove/:id', customerController.removeItem)

// customerRouter.post("/addOrder/:customerId", customerController.addOrder)


// export the router
module.exports = customerRouter
