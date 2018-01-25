var m = require("mithril")
import {logHits} from '../#utils.js';

//Dashboard
import pageDashboard from './dashboard.js';
import pageProfile from './profile.js';
import pageUsers from './users.js';
import pageHits from './hits.js';

m.route.prefix("")
m.route(document.getElementById('appContent'), "/admin", {
	"/admin": {view: function() {return  m(pageDashboard)},},
	"/admin/profile": {view: function() {return  m(pageProfile)},},

	"/admin/users": {view: function() {return  m(pageUsers)},},
	"/admin/hits": {view: function() {return  m(pageHits)},},
});
