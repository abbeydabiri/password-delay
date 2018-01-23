var m = require("mithril")

//Dashboard Routes
import pageDashboard from './dashboard.js';
import pagePassword from './password.js';
import pageProfile from './profile.js';
import pageHistory from './history.js';

m.route.prefix("")
m.route(document.getElementById('appContent'), "/dashboard", {
	"/dashboard/":{ view: function() { return  m(pageDashboard)},},

	"/dashboard/profile":{ view: function() { return  m(pageProfile)},},

	"/dashboard/password":{ view: function() { return  m(pagePassword)},},

	"/dashboard/history":{view: function() {return  m(pageHistory)},},
});
