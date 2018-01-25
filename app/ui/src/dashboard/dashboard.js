import m from 'mithril';
import menu from './#menu.js';
import {footerItem} from './#footer.js';
import {footerLink} from './#footer.js';

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
	oninit_NOMENU:function(){ m.render(document.getElementById('appMenu'), m(menu)) },

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

			{m("nav",{class:"w-100 z-max fixed loginBG bottom-0 tc center"},[
				m(footerItem,{color:"near-white hover-bg-white hover-red", href:"/dashboard/profile",icon:"person"},"My Profile"),
				m(footerItem,{color:"near-white hover-bg-white hover-red", href:"/dashboard/password",icon:"lock-locked"},"Set Password"),
				m(footerItem,{color:"near-white hover-bg-white hover-red", href:"/dashboard/history",icon:"spreadsheet"},"Security Log"),
				m(footerLink,{color:"near-white hover-bg-white hover-red", href:"/logout",icon:"logout"},"Logout")
			])}

		</section>
	)},
}

export default page;
