var express = require('express');
var exphbs  = require('express-handlebars');
var port = process.env.PORT || 3000

var app = express();
 
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
const mercadopago = require("mercadopago");

// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
	access_token: "APP_USR-8709825494258279-092911-227a84b3ec8d8b30fff364888abeb67a-1160706432",
	
	integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',
});

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});
app.post("/create_preference", (req, res) => {

	let preference = {
		payer: {
			name: "Lalo",
			surname: "Landa",
			email: "test_user_36961754@testuser.com",
			phone: {
				area_code: "56",
				number: 937485958
			},
			address: {
				street_name: "calle falsa",
				street_number: 123,
				zip_code: "2490000"
			}
		},
		items: [
			{
				id:req.body.idprod,
				title: req.body.title,
				description:"Dispositivo móvil de Tienda e-commerce",
				picture_url: req.body.img,
				quantity: Number(Number(req.body.quantity)),
				unit_price: Number(Number(req.body.unit_price)),

			}
		],
		back_urls: {
			"success": "http://letex007-mp-ecommerce-nodejs.herokuapp.com/notificacion",
			"failure": "http://letex007-mp-ecommerce-nodejs.herokuapp.com/notificacion",
			"pending": "http://letex007-mp-ecommerce-nodejs.herokuapp.com/notificacion"
		},
		auto_return: "approved",
		payment_methods: {
			excluded_payment_methods: [
				{
					id: "visa"
				}
			],
			installments: 6
		},
		notification_url: "https://letex007-mp-ecommerce-nodejs.herokuapp.com/notificacion",
		external_reference: "rorolete02@gmail.com",
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
			res.json({
				id: response.body.id
			});
		}).catch(function (error) {
			console.log(error);
		});
});
app.get('/notificacion', function(req, res) {
	res.json({
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id,
		PaymentMethod: req.query.payment_method_id,
		external_reference: req.query.external_reference
	});
});

app.listen(port);