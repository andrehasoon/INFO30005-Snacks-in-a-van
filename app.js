const express = require('express')
const app = express();
const req = require("request");
//import bcrypt model : npm install bcrypt
const bcrypt = require('bcrypt')
//encoded url
// app.use(express.urlencoded({extend:false}))
const bodyParser = require('body-parser')
app.use(bodyParser.json())

//Import session model : npm install express-session
const session = require('express-session')

require('./models');
const mongoose = require("mongoose")
const Vendor = mongoose.model("Vendor")
//const vendorController = require('./controllers/vendorController.js')

const N_MINUTES = 5;
const UNITS_PER_MIN = 1000 * 60;

// Configure session
app.use(session({
	secret: 'web30005', //The cookie associated with the session ID
	resave: false,
	saveUninitialized: true,
  	cookie: {
		maxAge : UNITS_PER_MIN * N_MINUTES // 5 minutes
		}
	}));



// YOU NEED TO INSTALL CORS: npm install cors
const cors = require('cors')
//app.use(express.json())
app.use(express.urlencoded({ extended: true })) // replaces body-parser
app.use(express.static('public'))	// define where static assets live

// load the handlebars module
const exphbs = require('express-handlebars')

// we set the template engine to handlebars. This registers the
// handlebars callback function as hbs. The function can be used to specify
// a set of defaults. For example, we provide the name of the default
// layout template and the name of the extension for the handlebars file
// below. We have also added the location of the custom helpers.
app.engine('hbs', exphbs({
	defaultlayout: 'main',
	extname: 'hbs',
	helpers: require(__dirname + "/public/js/helpers.js").helpers
}))

// next we set the view engine to engine specified previously, i.e. hbs
app.set('view engine', 'hbs')



// set up vendor routes
const vendorRouter = require('./routes/vendorRouter')

// set up customer/snacks routes
const customerRouter = require("./routes/customerRouter")



// GET home page
app.get('/', (req, res) => {
    //res.send('<h1>Snacks in a Van System</h1>')
		return res.render("main")
})

//app.get('/customer/profile')


// Handle vendor-management requests
// the vendor routes are added onto the end of '/vendor'
app.use('/vendor', vendorRouter)

// Handle customer snacks-management requests
// the snacks routes are added onto the end of '/customer'
app.use('/customer', customerRouter)


// app.use(express.static('images'))

app.all('*', (req, res) => {  // 'default' route to catch user errors
	res.status(404).render('error', {errorCode: '404', message: 'That route is invalid.'})
	// res.send('error')
})

app.listen(process.env.PORT || 3000, () => {
    console.log('The app is listening!')
})
