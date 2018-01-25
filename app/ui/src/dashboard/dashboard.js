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
		<section class="bg-primary">

			<div id="appAlert"></div>

			<div class="cf w-100 pv2"></div>

			<div class="pv0 cf w-100">
				<section>
					<div class="flex ph2 h-100 f6 i bg-primary">
						<span class={"v-mid pointer link h-100 flex pa3 items-center br1 ba b--white-10 ">
							<Icons name="people" class="h1 pr2"/>
							User Manager
						</span>
						&nbsp;
						<span class={"v-mid pointer link h-100 flex pa3 items-center br1 ba b--white-10 ">
							<Icons name="lock-locked" class="h1 pr2"/>
							Security Log
						</span>
					</div>
				</section>

			<div class="cf w-100 pv2"></div>

		</section>
	)},
}

export default page;
