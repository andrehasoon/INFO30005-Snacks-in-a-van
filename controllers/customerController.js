const mongoose = require("mongoose")

// YOU NEED TO INSTALL CORS: npm install bcrypt
const bcrypt = require('bcrypt')
// YOU NEED TO INSTALL CORS: npm install express-validator
const { validationResult } = require('express-validator');

const discount = require("../controllers/discountTime.js")

// import cusomer model
const Customer = mongoose.model("Customer")
// import vendor model
const Vendor = mongoose.model("Vendor")
// import snacks model
const Snack = mongoose.model("Snack")
// import order model
const Order = mongoose.model("Order")
const OrderItem = mongoose.model("OrderItem")
// import shopping cart model
const Cart = require('../models/cart.js')

const LARGE_DIST = 99999




// create an instance of shopping cart
const shoppingcart = new Cart();

/* -------------------------------
CUSTOMER APP VENDOR MAP FCUNTION
-------------------------------- */

const getVanMap = async (req, res) => {
	return res.render("getLocation")
}

const selectAvan = async (req, res) => {
	const MAX_VENDORS_SHOWN = 6
	const clientLatitude = req.body.latitude
	const clientLongitude = req.body.longitude

	// Find closest vendors
	var closestVendors = [];
	var distances = [];
	var largestDistance = LARGE_DIST
	var indexLargest = 0


	const vendors = await Vendor.find({}, {
		_id: true, vanName: true,
		locationLat:true, locationLong: true, locationDesc: true
	}).lean()

	for (var i=0; i<vendors.length; i++) {
		// Euclidian distance
		const diffLat = vendors[i].locationLat - clientLatitude
		const diffLong = vendors[i].locationLong - clientLongitude
		vendors[i].distance = Math.sqrt(diffLat^2 + diffLong^2)
	}
	vendors.sort((vendor1, vendor2) => {
		return vendor1.distance - vendor2.distance
	})

	// Obtain reduced info from each vendor record for privacy
	vendorsReduced = []
	for (i=0; i<MAX_VENDORS_SHOWN && i<vendors.length; i++) {
		vendorsReduced.push(vendors[i])
	}
	return res.render(
		"vendorMap",
		{clientLat: req.body.latitude, clientLong: req.body.longitude,
			vendors: vendorsReduced}
	)
}


/* -------------------------------
LOGIN IN & SIGN UP
-------------------------------- */
// Initialise with placeholder
// var loggedInCustomer = "607e9849d1bf49399a6effa1"
//
const SignUpCustomer = async (req, res) => {
	try {
	//validate the password whether meets the password policy
	/*
		Reference: https://express-validator.github.io/docs/validation-result-api.html
	*/

		//Settting the error formatter
		const errorFormatter = ({ msg, param }) => {
			// Build your resulting errors however you want! String, object, whatever - it works!
			return `${param} ${msg}`;
		  };

		  const result = validationResult(req).formatWith(errorFormatter);
		  //Check if result is empty

  		if (!result.isEmpty()) {
	    		// Send the wrong message releated to the invalid password

				return res.render("error",{ message: result.array({ onlyFirstError: true })[0]})

			}

		if (req.body.password !== req.body.confirmPassword){
				return res.render ('error',{message:"Passwords don't match!"})
			}

		// Try and find a customer with this email
		const customer = await Customer.findOne({"email": req.body.email})

		if (customer === null) {

			//hash passwords
			/*
			Reference : https://www.npmjs.com/package/bcrypt
			*/
			const salt = await bcrypt.genSalt(10)
			const hashPassword = await bcrypt.hash(req.body.password,salt)

			//create a new customers and store in DB
			const newCustomer = new Customer({
				email: req.body.email,
				password: hashPassword,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				locationLong: req.body.locationLong,
				locationLat: req.body.locationLat,
			})
		  	newCustomer.save((err, result) => {
				// Handle errors
				if (err) console.log(err)
				// res.send(result)
				return res.render('SignUpFeedback',
        {message:'Create an account Successfully !!',
        role:'customer',router:'login'})
				// return res.redirect('/customer/login')
			})
		}
		else {
			return res.render('error',{message: "Customer already exists."})
			}

	}catch(err) {
		res.status(400)
		return res.redirect("/customer/signup")
	}
}


const loginCustomer = async (req, res) => {
	try {
		// Try and find a customer with this email
		const customer = await Customer.findOne({
			"email": req.body.email
		})
		if (customer === null) {

			return res.status(404).render('error',{message: "Customer not found."})
		}else{

			//Compared the body password and customer's password in DB
			if (bcrypt.compareSync(req.body.password, customer.password)) {

				// send this user_email infromation to session
				req.session.customer = customer._id;
				req.session.save()

				return res.redirect('/customer/snacks');
			}else{
				return res.render('error',{message: "Oops! Wrong Password."})
			}
		}
	} catch(err) {
		res.status(400)
		return res.send("Database query failed")
	}
}


// Middleware for loggedIn status
const isLoggedIn = async (req, res, next) =>{
    if (req.session.customer) {
        return next();
    }else{
		req.session.msg = [{message: "Please login to your account"}];
        req.session.save();
        return res.redirect('/customer/login');
	}
};

const logoutCustomer = async (req,res)=>{

	//Let session is null
    req.session.customer = null;
	req.session.save();
    return res.redirect('/customer/login')
}



const getCustomerInfo = async (req, res) => {
	try {
    	// Try and find a customer with this id
		// req.params.customerId = req.session.customer

		const customer = await Customer.findOne({"_id": req.session.customer})
		if (customer === null) {
			res.status(404)
			res.send("Customer not found")
		}
		return res.render('customer-info',{customer: customer.toJSON()})
	} catch(err) {
		res.status(400)
		return res.send("Database query failed")
	}
}

const updateCusomterInfo = async (req, res) => {
		try {
			const newInfo = {
				email: req.body.newPassword,
				firstName: req.body.newFirstName,
				lastName: req.body.newLastName
			}
		  	const customer = await Customer.findOne({"_id": req.session.customer})
			// if order with this id is not found, return an error
		  if (!customer) {
			return res.redirect("/customer/snacks")
		  }

		  if (bcrypt.compareSync(req.body.oldPassword, customer.password)){
			Object.assign(customer, newInfo)
			const result = await customer.save()
			return res.render('customer-info', {customer: result.toJSON()})
		  }else{
			return res.render('error',{message:'Oops ! enter a wrong current password!'})
		  }

		  } catch (err) {
			  res.status(400)
			  return res.send("Database update failed")
		  }
	  }


/* -------------------------------
-------------------------------- */


/* -------------------------------
SNACK FUNCTIONS
-------------------------------- */
// get list of foods, and render it
const getAllSnacks = async (req, res) => {
	try {
		// we only need names and photos
		const snacks = await Snack.find( {name:new RegExp(req.query.foodName, 'i')},
			{name:true, price:true, imageId:true}).lean()


		res.render('index', {"foods": snacks})
	} catch (err) {
		console.log(err)
	}
}

const getOneSnack =  async (req, res) => {
	try {
		const snack = await Snack.findOne( {_id: req.params.snackId} ).lean()
    snack.formattedPrice = snack.price.toFixed(2)
		res.render('showFood', {"thisfood": snack})
	} catch (err) {
		console.log(err)
	}
}


/*----------------------------------
START A NEW ORDER FUNCTIONS
----------------------------------*/
const addOrder = async (req, res) => {

  let newOrder = new Order({
    items: shoppingcart.items,
    customerId: req.body.customerId,
    vendorId: req.body.vendorId
  })
  //return res.send(newOrder)
  newOrder.save( (err, result) => {
    // Handle errors
      if (err) res.send(err)
      // Now that order is sent through, reset the cart for next order
      shoppingcart.emptyCart
      return res.render('orderFeedback', {"customerId": req.body.customerId,
			"message": "Order Successfully Placed!!"})
  })
}


const getOrders = async (req, res) => {
	try {
		const orders = await Order.find(
      {customerId: req.session.customer,
	  orderStatus: {$not:/^c.*/ }},  // skip all the cancelled orders
      {orderStatus: true, items: true, vendorId: true, createdAt: true, _Id: true}
    ).lean()

    for (var i = 0; i < orders.length; i++) {
      // Add the vendor name to each object in the query
      const vendorDoc = await Vendor.findOne({_id: orders[i].vendorId}).lean()
      orders[i].vanName = vendorDoc.vanName

			orders[i].discountMessage = discount.discountMessage(
				orders[i].createdAt,
				"Sorry for the wait, you are entitled to a 20% discount!"
			)

      // Prettify timestamp
      const createdAt = orders[i].createdAt
      orders[i].prettyDateTime = Intl.DateTimeFormat(
        "default",
        {hour: "numeric", minute: "numeric", second: "numeric",
      year: "numeric", month: "numeric", day: "numeric"}
      ).format(createdAt)

      // Get snack names
      const orderItems = orders[i].items
      for (var j = 0; j < orderItems.length; j++) {
        const snackDoc = await Snack.findOne({
          _id: orderItems[j].snackId
        }).lean()
        orderItems[j].snackName = snackDoc.name
      }
    }

		return res.render("orderList", {"orders": orders})
	} catch (err) {
		res.status(400)
    res.send("Database query failed")
    console.log(err)
	}
}

const cancelOrder = async (req, res) => {
	try {
		const order = await Order.findOne({_id: req.body.orderId})
		order.orderStatus = "cancelled"
		order.save((err, result) => {
	    // Handle errors
	      if (err) res.send(err)
	      return res.render('orderFeedback', {"customerId": req.body.customerId,
				"message": "Order cancelled"})
	  })
	} catch (err) {
		res.status(400)
    res.send("Database query failed")
    console.log(err)
	}
}

const changeOrder = async (req, res) => {
	try {
		const order = await Order.findOne({_id: req.body.orderId})
		order.orderStatus = "cancelled"
		order.save((err, result) => {
	    // Handle errors
	      if (err) res.send(err)

	  })

		// Add each orderItem to cart...
		for (var i=0; i<order.items.length; i++) {
			shoppingcart.addToCart(order.items[i].toJSON())
		}

		res.render('orderFeedback', {"customerId": req.body.customerId,
		"message": "You may now change your order."})
	} catch (err) {
		res.status(400)
    res.send("Database query failed")
    console.log(err)
	}
}


/*----------------------------------
ADD A SNACK TO CART FUNCTIONS
----------------------------------*/

// add an item to shopping cart
const addToCart = async (req, res) => {
	const newOrderItem = new OrderItem({
		snackId: req.params.snackId,
		quantity: req.body.quantity,

	  })
	shoppingcart.addToCart(newOrderItem.toJSON())
}


// remove an item from shopping cart
const removeItem = async (req, res) =>{
	const itemId = req.params.id;

  // Promise chain: ensure item is removed before cart page is reloaded
	shoppingcart.removeFromCart(itemId).then(() => {
    res.redirect('/customer/shoppingCart');
  });
}


// display the shopping cart page
const getShoppingCart = async (req, res) => {
  // Get snack names and prices
  const items = shoppingcart.items
  for (var i=0; i<items.length; i++) {
    const snackDoc = await Snack.findOne({_id: items[i].snackId}).lean()
    items[i].snackName = snackDoc.name
    items[i].snackPrice = snackDoc.price
    // Calculate total for this type of snack, forces to 2 dec. places
    items[i].snackTotal = (snackDoc.price * items[i].quantity).toFixed(2)
  }

	return res.render('cartlist', {items: shoppingcart.items, totalAmount: shoppingcart.totalAmount.toFixed(2)})
}


const setVendor = (req, res) => {
  req.session.chosenVendor = req.body.vendorId
  req.session.save()
  res.redirect("/customer/snacks")
}

// get the check out infomation of the order including: vendor and customer name and shopping items
const getCheckOutInfo = async (req, res) => {

	if (!req.session.customer) {
		return res.render('orderPlaceError')
	}

	const vendor = await Vendor.findOne({_id: req.session.chosenVendor})
  	const customer = await Customer.findOne({_id: req.session.customer})
	// const vendor = await Vendor.findOne({_id: '60b1fd041d4aca2dd84cf834'})

	return res.render('checkOut',{items: shoppingcart.items,
    totalAmount: shoppingcart.totalAmount.toFixed(2),
    customer: customer.toJSON(), vendor: vendor.toJSON()})
}

module.exports = {

	getVanMap,selectAvan,
	getAllSnacks, getOneSnack,
    addOrder, getOrders, cancelOrder, changeOrder,
    setVendor,
    addToCart,removeItem, getShoppingCart, getCheckOutInfo,
	SignUpCustomer: SignUpCustomer,loginCustomer,isLoggedIn,logoutCustomer,getCustomerInfo,updateCusomterInfo
}
