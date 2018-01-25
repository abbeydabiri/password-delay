import m from 'mithril';
import menu from './#menu.js';
import {footerItem} from './#footer.js';
import {footerLink} from './#footer.js';

import Icons from  '../#icons.js';
import {appAlert} from '../#utils.js';
import {checkRedirect} from '../#utils.js';

import {defaultImage} from '../#pageFunctions.js';
import {switchPageMode} from '../#pageFunctions.js';


var page = {
	Url: "/api/dashboard", Form: {}, searchXHR: null,
	oninit_NOMENU:function(){ m.render(document.getElementById('appMenu'), m(menu)) },

	oncreate:function(){switchPageMode(page, "view");},
	view:function(vnode){
	return  (
		<section class="bg-primary min-vh-100">

			<div id="appAlert"></div>

			<div class="dark-red ph2 pt1 pb3 bg-primary">
				<div class="cf center w-100 w-50-m w-25-l pv2 avenir near-white">

					<div class="tc w-100 pv2">
						{m("img",{class: "br-100 pa1 ba b--white-10 h4 w4 pointer", style:"", id: "image", src:page.Form.Image,
							onerror: m.withAttr("id",function(id){defaultImage(id)})
						})}
						<p class="mv1"> {page.Form.Fullname} </p>
						<small class="i">{page.Form.Username}</small>
					</div>

					<div class="cf bg-white-10 br2 pt1">
						<span class="flex pa1 items-center f6 bb b--white-30">
							<Icons name="person" class="h1 pr2"/>
							Private Details
						</span>
					</div>

					<div class="cf mv2 f6">
						<span class="fl">{page.Form.Mobile}</span>
						<span class="fr">{page.Form.Email}</span>
					</div>
					<div class="cf mv3 f6">
						<p class="i f7 bb b--white-10">About Me</p>
						{page.Form.Description}
					</div>

				</div>
			</div>


			{m("div",{class:"cf w-100 mv2"})}

			{m("nav",{class:"w-100 z-max fixed bg-primary bottom-0 tc center"},[
				m(footerItem,{color:"near-white hover-bg-white hover-red", href:"/dashboard/profile",icon:"person"},"My Profile"),
				m(footerItem,{color:"near-white hover-bg-white hover-red", href:"/dashboard/password",icon:"lock-locked"},"Set Password"),
				m(footerItem,{color:"near-white hover-bg-white hover-red", href:"/dashboard/history",icon:"spreadsheet"},"Security Log"),
				m(footerLink,{color:"near-white hover-bg-white hover-red", href:"/logout",icon:"logout"},"Logout")
			])}

		</section>
	)},
}

export default page;
