import m from 'mithril';

import {menu} from './#menu.js';
import {footerItem} from './#footer.js';
import {footerLink} from './#footer.js';


import Icons from '../#icons.js';
import {pageTitle} from '../#pageComponents.js';
import {defaultImage} from '../#pageFunctions.js';
import {displayImage} from '../#pageFunctions.js';

import {switchPageMode} from '../#pageFunctions.js';
import {saveForm} from '../#pageFunctions.js';



var page = {
	Url: "/api/profile", Form: {},
	lastActivityComponent : { view:function(vnode){ return(
		<div class="cf mv3 f6">
			{vnode.attrs.lastActivityList}
		</div>
	)}},
	lastActivityItem: {view: function(vnode) {return(
		<div class="pa2 bb b--washed-red">
			<span class="hover-dark-red pointer" onclick={vnode.attrs.View}>
				<b>{vnode.attrs.POS}</b> - {vnode.attrs.Details}
			</span>

			<small style="font-size:80%" class="fr pr2 pointer hover-dark-red truncate" onclick={vnode.attrs.Edit}>
				{vnode.attrs.Date}
			</small>
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
		m.request({ method: 'GET', url: "/api/hits/search?limit=25&field=code&search="+page.Form.Username, }).then(function(response) {
			checkRedirect(response);
			if (response.Code == 200) { if (response.Body !== null && response.Body !== undefined ){
				var POS = 1;
				response.Body.map(function(result) {
					if (result.ID > 0) {
						lastActivityList.push(m(page.lastActivityItem,
							{POS: POS++, Details: result.Details,Date: result.Date,}
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
	oninit:function(){page.lastActivityList = m(page.lastActivityComponent);
		m.render(document.getElementById('appMenu'), m(page.viewHeader));
		document.getElementById("appContent").style.paddingTop = "53px";
		m.redraw()
	},
	viewHeader : { view: function(vnode){ return (
		m("nav",{class:"w-100 bg-secondary dark-red shadow-4 z-5 cf tc relative fixed top-0"},[
			m("a",{class:"link",href:"/dashboard"},[
				m(Icons,{name:"dashboard",class:"absolute dark-red h1 dim left-0 top-0 pa3"})
			]),
			m("p", {class:"avenir"}, "SECURITY LOG"),
			m(Icons,{name:"check",class:"absolute dark-red h1 dim right-0 top-0 pa3",onclick:page.saveForm}),
		])
	)}},
	oncreate:function(){ switchPageMode(page, "view"); defaultImage("Image")},
	view:function(){
	return  (
		<section class="">

			<div id="appAlert"></div>

			<div class="bg-primary">
				<div class="cf center w-100 w-90-m w-40-l pv2 avenir near-white">

					<div class="dark-red ph2 pt1 pb2">
						<div class="cf center w-100 w-90-m w-40-l pv2 avenir near-white">

							<div class="tc w-100 pv2">
								{m("img",{class: "br-100 pa1 ba b--white-10 h4 w4 pointer", style:"", id: "image", src:page.Form.Image,
									onerror: m.withAttr("id",function(id){defaultImage(id)})
								})}
								<p class="mv1 fw4"> {page.Form.Fullname} </p>
								<small class="">{page.Form.Username}</small>
							</div>

						</div>
					</div>
				</div>
			</div>

			<div class="cf center w-100 w-90-m w-40-l avenir near-white ">
				<div class="cf mt2 bg-white-10 br2 br--top pt1 bg-primary">
					<span class="flex pa1 items-center f6 white-80">
						<Icons name="spreadsheet" class="h1 pr1"/>
						Security Log
					</span>
				</div>
				<div class="cf pv2 ph1 f6 bg-white-90 black-80">
					{page.lastActivityList}
				</div>
			</div>

			{m("div",{class:"cf w-100 mv2"})}

			{m("nav",{class:" w-100 z-max fixed bg-primary bottom-0 tc center"},[
				m(footerItem,{color:"near-white hover-bg-white hover-red", href:"/dashboard/profile",icon:"person"},"My Profile"),
				m(footerItem,{color:"near-white hover-bg-white hover-red", href:"/dashboard/password",icon:"lock-locked"},"Set Password"),
				m(footerItem,{color:"red bg-white", href:"/dashboard/history",icon:"spreadsheet"},"Security Log"),
				m(footerLink,{color:"near-white hover-bg-white hover-red", href:"/logout",icon:"logout"},"Logout")
			])}
		</section>
	)
  }
}

export default page;
