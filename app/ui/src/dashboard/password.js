import m from 'mithril';

import {menu} from './#menu.js';
import {footerItem} from './#footer.js';
import {footerLink} from './#footer.js';


import Icons from '../#icons.js';
import {pageTitle} from '../#pageComponents.js';


import {saveForm} from '../#pageFunctions.js';



var page = {
	Url: "/api/profile", Form: {},
	saveForm:function(){
		saveForm(page);
	},
	oninit: function() {
		m.render(document.getElementById('appMenu'), m(page.viewHeader));
		document.getElementById("appContent").style.paddingTop = "53px";
		m.redraw()
	},
	viewHeader : { view: function(vnode){ return (
		m("nav",{class:"w-100 bg-secondary dark-red shadow-4 z-5 cf tc relative fixed top-0"},[
			m("a",{class:"link",href:"/dashboard"},[
				m(Icons,{name:"dashboard",class:"absolute dark-red h1 dim left-0 top-0 pa3"})
			]),
			m("p", {class:"avenir"}, "SET PASSWORD"),
			m(Icons,{name:"check",class:"absolute dark-red h1 dim right-0 top-0 pa3",onclick:page.saveForm}),
		])
	)}},
	oncreate:function(){ },
	view:function(){
	return  (
		<section class="">

			<div id="appAlert"></div>
			<div class="cf w-100 pv2"></div>

			<div class="cf center w-100 w-90-m w-40-l pv2 avenir near-white">

				<div class="cf w-100">
					<div class="fl w-100 pa2"> <small class="gray ">Current Password:</small>
						{m("input",{ type: "text", class: "w-100 pa1", onchange: m.withAttr("value",function(value) {page.Form.CurrentPassword = value}) })}
					</div>

					<div class="fl w-100 pa2"> <small class="gray ">New Password:</small>
						{m("input",{ type: "text", class: "w-100 pa1", onchange: m.withAttr("value",function(value) {page.Form.NewPassword = value}) })}
					</div>

					<div class="fl w-100 pa2"> <small class="gray ">Confirm Password:</small>
						{m("input",{ type: "text", class: "w-100 pa1", onchange: m.withAttr("value",function(value) {page.Form.ConfirmPassword = value}) })}
					</div>
				</div>

				<div class="cf w-100 tc mt4 bb b--light-gray">
					<small class="gray db">Set Password Delay Character</small>
				</div>

				<div class="cf w-100">
					<div class="fl w-50  pa2"> <small class="gray db">Position:</small>
						{m("select",{ class: "db pa1 bg-white", value:page.Form.DelayChar,
							onchange: m.withAttr("value",function(value) {page.Form.DelayChar = parseInt(value)})},
							[ m("option","0"), m("option","1"), m("option","2"),m("option","3"), m("option","4"),
								m("option","5"),
							]
						)}
					</div>

					<div class="fl tr w-50  pa2"> <small class="gray db">Seconds:</small>
						{m("select",{ class: "fr db pa1 bg-white", value:page.Form.DelaySec,
							onchange: m.withAttr("value",function(value) {page.Form.DelaySec = parseInt(value)})},
							[ m("option","0"), m("option","1"), m("option","2"),m("option","3"), m("option","4"),
								m("option","5"), m("option","6"),
							]
						)}
					</div>
				</div>

			</div>


			{m("div",{class:"cf w-100 pv5"})}

			{m("nav",{class:"avenir w-100 z-max fixed bg-primary bottom-0 tc center"},[
				m(footerItem,{color:"near-white hover-bg-white hover-red", href:"/dashboard/profile",icon:"person"},"My Profile"),
				m(footerItem,{color:"red bg-white", href:"/dashboard/password",icon:"lock-locked"},"Set Password"),
				m(footerItem,{color:"near-white hover-bg-white hover-red", href:"/dashboard/history",icon:"spreadsheet"},"Security Log"),
				m(footerLink,{color:"near-white hover-bg-white hover-red", href:"/logout",icon:"logout"},"Logout")
			])}
		</section>
	)
  }
}

export default page;
