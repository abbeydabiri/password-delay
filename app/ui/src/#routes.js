var m = require("mithril")

//Website Routes
import indexPage from './index.js';
import loginPage from './login.js';
import forgotPage from './forgot.js';
import signupPage from './signup.js';
import termsPage from './terms.js';
import privcacyPage from './privacy.js';

m.route.prefix("")
m.route(document.getElementById('appContent'), "/", {
	"/":{ view: function() { return m(indexPage)},},

	"/login":{ view: function() { return m(loginPage)},},

	"/forgot":{ view: function() { return m(forgotPage)},},

	"/signup":{ view: function() { return m(signupPage)},},
	"/terms":{ view: function() { return m(termsPage)},},
	"/privacy":{ view: function() { return m(privcacyPage)},},
});
