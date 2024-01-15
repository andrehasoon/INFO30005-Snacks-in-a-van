const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator');

const discount = require("../controllers/discountTime.js")

// import vendor model
const Vendor = mongoose.model("Vendor")
// import order model
const Order = mongoose.model("Order")
// import customer model
const Customer = mongoose.model("Customer")
// import snacks model
const Snack = mongoose.model("Snack")




// handle request to get all vendors
const getAllVendor = async (req, res) => {
    //res.send(vendors) // send list to browser
	try {
		const vendors = await Vendor.find()
		return res.send(vendors)
	} catch (err) {
		res.status(400)
		return res.send("Database query failed")
	  }
}

// handle request to get one vendor
const getOneVendor = async (req, res) => {
	try {
		const vendor = await Vendor.findOne({"_id": req.params.vendorId})
		if (vendor === null) {
			res.status(404)
			res.send("Vendor not found")
		}
		return res.send(vendor)
	} catch(err) {
		res.status(400)
		return res.send("Database query failed")
	}
}



// Handle request to create a new vendor
const addVendor = async (req, res) => {
	const newVendor = new Vendor({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		vanName: req.body.vanName,
		status: req.body.status,
		locationDesc: req.body.locationDesc,
		locationLong: req.body.locationLong,
		locationLat: req.body.locationLat
	})
	newVendor.save( (err, result) => {
		// Handle errors
			if (err) res.send(err)
			return res.send(result)
	})
}


// handle request to get all Order except picked-up order
const getAllOrder = async (req, res) => {
	try {
		// get all order except picked-up order
		const orders = await Order.find(
			{vendorId: req.params.vendorId,
				orderStatus: {$not:/^p.*/ }},
      		{orderStatus: true, items: true,customerId: true, createdAt: true}
		).lean()
		// sort the orderlist according to the created time from old to new
		orders.sort(orderTimeCompare);


		for (var i = 0; i < orders.length; i++) {
			// Add the customer lastname to each object in the query
			const customerDoc = await Customer.findOne({_id: orders[i].customerId}).lean()
			if (customerDoc === null) {
				res.status(400)
				return res.send("Customer not found in database")
			}
			orders[i].customerLastName = customerDoc.lastName
			// Prettify timestamp
			const createdAt = orders[i].createdAt
			orders[i].prettyDateTime = Intl.DateTimeFormat(
			  "default",
			  {hour: "numeric", minute: "numeric", second: "numeric",
			year: "numeric", month: "numeric", day: "numeric"}
			).format(createdAt)

		}
		return res.render("vendorOrderList",{"orders": orders, "vendorId": req.session.vendor})
	  } catch (err) {
		res.status(400)
		return res.send("Database query failed")
	  }

}

// handle request to get all outstanding orders
const getOutstandingOrders = async (req, res) => {
	try {
		const orders = await Order.find(
			{vendorId: req.params.vendorId,
			orderStatus: "outstanding"},
      		{orderStatus: true, items: true,customerId: true, createdAt: true}
		).lean()

		// sort the orderlist according to the created time from old to new
		orders.sort(orderTimeCompare);

		for (var i = 0; i < orders.length; i++) {
			// Add the customer lastname to each object in the query
			const customerDoc = await Customer.findOne({_id: orders[i].customerId}).lean()
			orders[i].customerLastName = customerDoc.lastName

			if (customerDoc === null) {
				res.status(400)
				return res.send("Customer not found in database")
			}

			orders[i].discountMessage = discount.discountMessage(
				orders[i].createdAt,
				"LATE ORDER: customer requires 20% discount"
			)

			// Prettify timestamp
			const createdAt = orders[i].createdAt
			orders[i].prettyDateTime = Intl.DateTimeFormat(
			  "default",
			  {hour: "numeric", minute: "numeric", second: "numeric",
			year: "numeric", month: "numeric", day: "numeric"}
			).format(createdAt)

		}

		return res.render("vendorOrderList",{"orders": orders, "vendorId": req.session.vendor})
	  } catch (err) {
		res.status(400)
		return res.send("Database query failed")
	  }
  }

// handle request to get all In progress orders
const getInProgressOrders = async (req, res) => {
	try {
		const orders = await Order.find(
			{vendorId: req.params.vendorId,
			orderStatus: "in progress"},
      		{orderStatus: true, items: true,customerId: true, createdAt: true}
		).lean()
			// sort the orderlist according to the created time from old to new
			orders.sort(orderTimeCompare);

		for (var i = 0; i < orders.length; i++) {
			// Add the customer lastname to each object in the query
			const customerDoc = await Customer.findOne({_id: orders[i].customerId}).lean()
			orders[i].customerLastName = customerDoc.lastName

			if (customerDoc === null) {
				res.status(400)
				return res.send("Customer not found in database")
			}
			// Prettify timestamp
			const createdAt = orders[i].createdAt
			orders[i].prettyDateTime = Intl.DateTimeFormat(
			  "default",
			  {hour: "numeric", minute: "numeric", second: "numeric",
			year: "numeric", month: "numeric", day: "numeric"}
			).format(createdAt)

		}

		return res.render("vendorOrderList",{"orders": orders, "vendorId": req.session.vendor})
	  } catch (err) {
		res.status(400)
		return res.send("Database query failed")
	  }
  }

  // handle request to get all fulfilled orders
const getFulfilledOrders = async (req, res) => {
	try {
		const orders = await Order.find(
			{vendorId: req.params.vendorId,
			orderStatus: "fulfilled"},
      		{orderStatus: true, items: true,customerId: true, createdAt: true}
		).lean()

			// sort the orderlist according to the created time from old to new
			orders.sort(orderTimeCompare);

		for (var i = 0; i < orders.length; i++) {
			// Add the customer lastname to each object in the query
			const customerDoc = await Customer.findOne({_id: orders[i].customerId}).lean()
			orders[i].customerLastName = customerDoc.lastName

			if (customerDoc === null) {
				res.status(400)
				return res.send("Customer not found in database")
			}
			// Prettify timestamp
			const createdAt = orders[i].createdAt
			orders[i].prettyDateTime = Intl.DateTimeFormat(
			  "default",
			  {hour: "numeric", minute: "numeric", second: "numeric",
			year: "numeric", month: "numeric", day: "numeric"}
			).format(createdAt)

		}

		return res.render("vendorOrderList",{"orders": orders, "vendorId": req.session.vendor})
	  } catch (err) {
		res.status(400)
		return res.send("Database query failed")
	  }
  }



// handle request to get one Order

const getOneOrder = async (req, res) => {
	try {
		const order = await Order.findOne({"_id": req.params.orderId},
		{orderStatus: true, items: true, customerId: true, createdAt: true}).lean()

		if (order === null) {
			res.status(404)
			res.send("Order not found")
		}


		// Add the customer last name to the object
		const customerDoc = await Customer.findOne({"_id": order.customerId}).lean()
		order.customerLastName = customerDoc.lastName

		// Prettify timestamp
		const createdAt = order.createdAt
		order.prettyDateTime = Intl.DateTimeFormat(
		  "default",
		  {hour: "numeric", minute: "numeric", second: "numeric",
		year: "numeric", month: "numeric", day: "numeric"}
		).format(createdAt)

		// Get snack names
		const orderItems = order.items
		var totalAmount = 0
		for (var j = 0; j < orderItems.length; j++) {
		  const snackDoc = await Snack.findOne({
			_id: orderItems[j].snackId
		  }).lean()
		  orderItems[j].snackName = snackDoc.name
		  totalAmount += orderItems[j].quantity * snackDoc.price
		}
		return res.render("vendorOrderDetails", {"order":order,
		"totalAmount": totalAmount.toFixed(2), "vendorId": req.session.vendor})
		//return res.send(orderItems)
	} catch(err) {
		res.status(400)
		return res.send("Database query failed")
	}
}



// update a vendor status(POST)
const updateVendorStatus = async (req, res) => {
	const updated_vendor = req.body

	try {


	 const vendor = await Vendor.findOne( {"_id": req.session.vendor} )

		// if vendor with this id is not found, return an error
	  if (!vendor) {
		res.status(400)
		return res.send("Vendor not found in database")
	  }

		// replace properties that are listed in the POST body
	  Object.assign(vendor, updated_vendor)

		// save and return updated vendor
	  	 await vendor.save((err, result) => {
		// Handle errors
			if (err) res.send(err)
	})
		res.redirect('/vendor/id/'+ req.session.vendor +'/allOrders')
		//res.redirect('/vendor/id/607e5568bd78ba2d97aaf2fb/allOrders');
		// Error handling
	  } catch (err) {
		  res.status(400)
		  return res.send("Database update failed")
	  }
  }


// update an order status(POST)
const updateOrderStatus = async (req, res) => {
	const new_status = req.body
	try {
	  const order = await Order.findOne( {"_id": req.params.orderId} )
		// if order with this id is not found, return an error
	  if (!order) {
		res.status(400)
		return res.send("Order not found in database")
	  }

		// replace properties that are listed in the POST body
	  Object.assign(order, new_status)
		// save and return updated order
	   	await order.save((err, result) => {
		// Handle errors
			if (err) res.send(err)})

	  //return res.send(result)
	  res.redirect('/vendor/id/'+ req.session.vendor +'/allOrders')
	  //res.redirect('/vendor/id/60b1fd041d4aca2dd84cf834/allOrders')
		// Error handling
	  } catch (err) {
		  res.status(400)
		  return res.send("Database update failed")
	  }
  }


/* -------------------------------
Vendor LOGIN IN & SING UP
-------------------------------- */
  const SignUpVednor = async (req, res) => {
	try {
	//validate the password whether meets the password policy
	/*Reference: https://express-validator.github.io/docs/validation-result-api.html*/
		//Settting the error formatter
		 const errorFormatter = ({ msg, param }) => {
			// Build your resulting errors however you want! String, object, whatever - it works!
			return `${param} ${msg}`;
		  };

		  const errors = validationResult(req).formatWith(errorFormatter);
		  console.log(validationResult(req))

		  //Check if result is empty
		  console.log(errors)
  		  if (!errors.isEmpty()) {
    	//   return res.json({ errors: result });
				console.log(errors.array())
				return res.render("error",{ message: errors.array({onlyFirstError: true})})
		}


		if (req.body.password !== req.body.confirmPassword){
			return res.render ('error',{message:"Passwords don't match!"})
		}

		//Hash password
		const salt = await bcrypt.genSalt(10)
		const hashPassword = await bcrypt.hash(req.body.password,salt)

		// Try and find a customer with this email
		const vendor = await Vendor.findOne({"vanName": req.body.vanName})
		//create a new customers and store in DB
		if (vendor === null) {
			const newVendor = new Vendor({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				vanName:  req.body.vanName, // as a login username
				password: hashPassword,
				status: req.body.status,
				locationDesc: req.body.locationDesc,
				locationLong: req.body.locationLong,
				locationLat: req.body.locationLat
			})
			newVendor.save( (err, result) => {
				// Handle errors
					if (err)
						res.send(err)
					return res.render('SignUpFeedback', {message:' Create an Vendor Account Successfully',
														role:'vendor',
														router:'vendor-login'})
			})
		}
		else {
			return res.render('error',{message: "Customer already existing."})
		}
	} catch(err) {
		res.status(400)
		return res.redirect("/vendor-login")
	}
}


const loginVendor = async (req, res) => {
	try {
	// Try and find a customer with this id
		const vendor = await Vendor.findOne({
			"vanName": req.body.vanName
		})
		if (vendor === null) {
			 return res.render('error',{errorCode:"Login",message: "Vendor not found."})
		}else{
			if (bcrypt.compareSync(req.body.password, vendor.password)) {
				// send vendor_id infromation to session
				req.session.vendor = vendor._id;

				return res.redirect('/vendor/vendorUpdate');
			}else{
				return res.render('error',{errorCode:"Password", message: "Oops! Wrong Password."})
			}
		}
	} catch(err) {
		res.status(400)
		return res.send("Database query failed")
	}
}


// Middleware of login Status
var isLoggedIn = async (req, res, next) =>{
    if (!req.session.vendor) {
        req.session.errors = [{message: "Please log in your account"}];
        req.session.redirect = req.url;
        req.session.save();
        return res.redirect('/vendor-login');
    }
    next();
}

//logout function
const logoutVendor = async (req,res)=>{
    req.session.vendor = null;
	req.session.save();
    return res.redirect('/vendor/vendor-login')
}


const testupdate = async (req, res) => {
	return res.send(req.body)
}

// sort the order list, displayed the urgent order (oldest order) at the top
const orderTimeCompare = function(a,b){
	if ( a.createdAt < b.createdAt ){
		return -1;
	  }
	  if ( a.createdAt > b.createdAt ){
		return 1;
	  }
	  return 0;
	}


module.exports = {
    getAllVendor, getOneVendor, getOutstandingOrders,
		addVendor, updateVendorStatus,
		getAllOrder, getOneOrder, getInProgressOrders,getFulfilledOrders,
		updateOrderStatus,SignUpVednor,loginVendor, testupdate,isLoggedIn, logoutVendor
}
