import m from 'mithril';

import {footerItem} from './#footer.js';
import {footerLink} from './#footer.js';

import Icons from  '../#icons.js';
import {appAlert} from '../#utils.js';
import {checkRedirect} from '../#utils.js';

import {getData} from '../#pageFunctions.js';
import {defaultImage} from '../#pageFunctions.js';

import {pageSearchList} from '../#pageComponents.js';


var page = {
	Url: "/api/dashboard", Form: {}, searchXHR: null,
	lastActivityComponent : { view:function(vnode){ return(
		<div class="cf f6">
			{vnode.attrs.lastActivityList}
		</div>
	)}},
	lastActivityItem: {view: function(vnode) {return(
		<div class="pa1 bb b--washed-red">
			<small style="font-size:80%" class=" pointer hover-dark-red truncate" onclick={vnode.attrs.Edit}>
			{vnode.attrs.Date}
			</small>
			<span class="db truncate hover-dark-red pointer" onclick={vnode.attrs.View}>
				<b>{vnode.attrs.POS}</b> - {vnode.attrs.Details}
			</span>

		</div>
	)}},
	getData: function(){
		return m.request({ method: 'GET', url: page.Url, data: {id: page.Form.ID}, }).then(function(response) {
			checkRedirect(response);
			if (response.Code == 200) {
				if (response.Body !== null && response.Body !== undefined ){
					page.Form = response.Body;
					page.lastActivity();
				}
			}
			if (response.Message !== null && response.Message !== undefined && response.Message !== "" ){
				appAlert([{message: response.Message}]);
			}
		}).catch(function(error) {
			appAlert([{message: "Network Connectivity Error \n Please Check Your Network Access \n"+error, }]);
		});
	},
	lastActivity: function(){
		var lastActivityList = [];
		m.request({ method: 'GET', url: "/api/hits/search?limit=5&field=code&search="+page.Form.Username, }).then(function(response) {
			checkRedirect(response);
			if (response.Code == 200) { if (response.Body !== null && response.Body !== undefined ){
				var POS = 1;
				response.Body.map(function(result) {
					if (result.ID > 0) {
						lastActivityList.push(m(page.lastActivityItem,
							{ Details: result.Details, Date: result.Date,}
						))
					}
				})
			}}
			page.lastActivityList = m(page.lastActivityComponent,{lastActivityList: lastActivityList});

			if (response.Message !== null && response.Message !== undefined && response.Message !== "" ){
				appAlert([{message: response.Message}]);
			}
		}).catch(function(error) {
			appAlert([{ message: "Network Connectivity Error \n Please Check Your Network Access", }]);
		});
	},
	oninit:function(){page.lastActivityList = m(page.lastActivityComponent);},
	oncreate:function(){page.getData(); defaultImage("Image")},
	view:function(vnode){
	return  (
		<section class="bg-primary min-vh-100">

			<div id="appAlert"></div>

			<div class="dark-red ph2 pt1 pb3 ">
				<div class="cf center w-100 w-90-m w-40-l pv2 avenir near-white">

					<div class="tc w-100 pv2">
						{m("img",{class: "br-100 pa1 ba b--white-10 h4 w4 pointer", style:"", id: "Image", src:page.Form.Image,
							onerror: m.withAttr("id",function(id){defaultImage(id)})
						})}
						<p class="mv1 fw4"> {page.Form.Fullname} </p>
						<small class="">{page.Form.Username}</small>
					</div>

					<div class="cf mt2 bg-white-10 br2 pt1">
						<span class="flex pa1 items-center f6 white-80">
							<Icons name="envelope-closed" class="h1 pr1"/>
							Contacts
						</span>
					</div>
					<div class="cf pv2 ph1 f6 bg-white-90 black-80">
						<span class="fl">{page.Form.Mobile}</span>
						<span class="fr">{page.Form.Email}</span>
					</div>

					{m("div",{class:"cf w-100 mv3"})}

					<div class="cf mt2 bg-white-10 br2 pt1">
						<span class="flex pa1 items-center f6 white-80">
							<Icons name="person" class="h1 pr1"/>
							About
						</span>
					</div>
					<div class="cf pv2 ph1 f6 bg-white-90 black-80">
						{page.Form.Description}
					</div>

					{m("div",{class:"cf w-100 mv3"})}

					<div class="cf  mt2 bg-white-10 br2 pt1">
						<span class="flex pa1 items-center f6 white-80">
							<Icons name="spreadsheet" class="h1 pr1"/>
							Last Activity
						</span>
					</div>
					<div class="cf ph1 f6 bg-white-90 black-80">
						{page.lastActivityList}
					</div>

				</div>
			</div>


			{m("div",{class:"cf w-100 pv5"})}

			{m("nav",{class:"avenir w-100 z-max fixed bg-primary bottom-0 tc center"},[
				m(footerItem,{color:"near-white hover-bg-white hover-red", href:"/dashboard/profile",icon:"person"},"My Profile"),
				m(footerItem,{color:"near-white hover-bg-white hover-red", href:"/dashboard/password",icon:"lock-locked"},"Set Password"),
				m(footerItem,{color:"near-white hover-bg-white hover-red", href:"/dashboard/history",icon:"spreadsheet"},"Security Log"),
				m(footerLink,{color:"near-white hover-bg-white hover-red", href:"/logout",icon:"logout"},"Logout")
			])}

		</section>
	)},
}

export default page;
