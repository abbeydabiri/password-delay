import m from 'mithril';
import {menu} from './#menu.js';
import {footerItem} from './#footer.js';
import Icons from  '../#icons.js';
import {appAlert} from '../#utils.js';
import {checkRedirect} from '../#utils.js';

var viewTaskManager = {
	view: function(vnode){
		return (
			m("li",{class:"fl w-100 lh-copy pa3 ph0-l bb b--black-10"},[
				m("div",{id:vnode.attrs.id+"Task", class:"flex items-center "+vnode.attrs.color},[
					m("div",{class:"pa2 near-white "+vnode.attrs.prioritycolor ,onclick:()=>page.openTaskManager(vnode.attrs.id)},vnode.attrs.priority),
					m("div",{class:"ph2 flex-auto"},[
						m("span",{class:"f6 db black-70 truncate"},vnode.attrs.title),
						m("small",{class:"gray db i"},vnode.attrs.days),
					]),
					m("div",m(Icons,{name:"chevron-top", class:"dn w1 h1 dim", id:vnode.attrs.id+"Open",onclick:()=>page.openTaskManager(vnode.attrs.id)})),
					m("div",m(Icons,{name:"chevron-bottom", class:" w1 h1 dim", id:vnode.attrs.id+"Closed",onclick:()=>page.openTaskManager(vnode.attrs.id)}))
				]),
				m("div",{class:" fl w-100 black-70 tl dn pv2", id:vnode.attrs.id+"Message"}),
			])
		)
	}
}

var page = {
	Url: "", Form: {}, searchXHR: null,
	oninit:function(){ menu(); },

	loadTasks: function(){
		var searchList = [];
		var pageSearchUrl = "/api/tasks/search?workflow=publish&search="
		if (page.searchXHR !== null) { page.searchXHR.abort() } page.searchXHR = null;
		m.request({ method: 'GET', url: pageSearchUrl,
			config: function(xhr) {page.searchXHR = xhr}, }).then(function(response) {

			checkRedirect(response);
			if (response.Code == 200) {
				if (response.Body !== null && response.Body !== undefined ){
					var POS = 1;
					var color = "";

					response.Body.map(function(result) { if (result.ID > 0) {

						var priority = "";
						var prioritycolor = "";
						var subDetails = result.SubDetails.split("|");

						switch(subDetails[0]) {
							default: //case "low":
								priority = "L";
								prioritycolor = "bg-green";
								break;
							case "medium":
								priority = "M";
								prioritycolor = "bg-orange";
								break;
							case "high":
								priority = "H";
								prioritycolor = "bg-red";
								break;
						}


						color = (result.Workflow == "pending") ?  "black" : "gray";
						searchList.push(m(viewTaskManager,{id:result.ID, color: color,
							title: result.Details, prioritycolor: prioritycolor,
							priority: priority, days: subDetails[1]}
						))
					}})
				}
			}
			page.pageSearchList = searchList;
		}).catch(function(error) {
			appAlert([{ type: 'bg-red', message: "Network Connectivity Error \n Please Check Your Network Access", }]);
		});
	},

	checkBtnText: "CHECK IN",
	checkBtnColor: "bg-green",
	checkInOut:function(){
		switch(page.checkBtnColor){
			case "bg-green":
				page.checkBtnText = "CHECK-OUT";
				page.checkBtnColor = "bg-red";
				break;

			default:
				page.checkBtnText = "CHECK IN";
				page.checkBtnColor = "bg-green";
				break;
		}
	},

	oncreate:function(){page.loadTasks()},
	view:function(vnode){
	return  (
		<section class="">

			<div id="appAlert"></div>

			<div class="cf w-100 pv2"></div>

			<ul class="list pl0 mv0 measure center cf ">
				{page.pageSearchList}
			</ul>


			{m("ul",{class:"list pl0 mt0 measure center cf"},[
				m("li",{class:"fl w-100 lh-copy pa3 ph0-l bb b--black-10"},[
					m("div",{class:"f6"},"Fullname"),
					m("div", {class:"br1  b--white "} ,m("input",{ type:"text", style:"", class: "bg-light-gray w-100 black bw0 br1 pa2 f6", id:"username",
						oninput: m.withAttr("value",function(value) {page.Username = value}),
						onkeyup: function(event) {if(event.key=="Enter"){action.Submit()}}
					 }))
				]),
				m("li",{class:"fl w-100 lh-copy pa3 ph0-l bb b--black-10"},[
					m("div",{class:"f6"},"Outlet Name"),
					m("div", {class:"br1  b--white "} ,m("input",{ type:"text", style:"", class: "bg-light-gray w-100 black bw0 br1 pa2 f6", id:"username",
						oninput: m.withAttr("value",function(value) {page.Username = value}),
						onkeyup: function(event) {if(event.key=="Enter"){action.Submit()}}
					 }))
				]),
			])}

			{m("div",{class:"cf w-100 pv2"})}

			{m("div", {class:"pa2 tc cf center"}, m("span",{
				class:"pa3 white-90 w-100 br2 shadow-4 bw0 link dim pointer "+page.checkBtnColor,
			 		onclick:page.checkInOut },page.checkBtnText))}

			{m("div",{class:"cf w-100 pv2"})}

			{m("nav",{class:"w-100 z-max fixed bg-black bottom-0 tc center"},[
				m(footerItem,{color:"red bg-white hover-bg-black hover-white", href:"/customer",icon:"person"},"CATEGORY"),
				m(footerItem,{color:"near-white hover-bg-white hover-red", href:"/customer/consumer",icon:"basket"},"BASKET"),
				m(footerItem,{color:"near-white hover-bg-white hover-red", href:"/customer/outlet",icon:"basket"},"BIDS"),
				m(footerItem,{color:"near-white hover-bg-white hover-red", href:"/customer/media",icon:"aperture"},"WALLET")
			])}

		</section>
	)},
}

export default page;
