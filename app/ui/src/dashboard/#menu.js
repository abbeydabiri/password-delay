var m = require("mithril");
import Icons from '../#icons.js';

function dashboardMenu() {
	var appMenuDiv = document.getElementById("dashboardMenu");
	appMenuDiv.classList.toggle('dn');
	appMenuDiv.classList.toggle('animated');
	appMenuDiv.classList.toggle('bounceInLeft');
	document.getElementById("html").classList.toggle('overflow-hidden');
}

function dashboardSubMenu(subMenu) {
	document.getElementById(subMenu).classList.toggle('dn');
	document.getElementById(subMenu+"chevron-right").classList.toggle('dn');
	document.getElementById(subMenu+"chevron-bottom").classList.toggle('dn');
}

export function menu() {
	m.render(document.getElementById('appMenu'), m(menu))
}

var menuItem = {
	view: function(vnode) {
		return(
			<a class="link" oncreate={m.route.link} href={vnode.attrs.href}>
				<li class="tc" onclick={()=>dashboardMenu()}>
					<p class="ph2 pv3 mv0 near-white dim bb b--gray">
						{vnode.children}
					</p>
				</li>
			</a>
		)
	}
}

var linkItem = {
	view: function(vnode) {
		return(
			<a class="link" href={vnode.attrs.href}>
				<li class="tc" onclick={()=>dashboardMenu()}>
					<p class="ph2 pv3 mv0 near-white dim bb b--gray">
						{vnode.children}
					</p>
				</li>
			</a>
		)
	}
}

var menuGroup = {
	view: function(vnode) {
		return(
			<li onclick={()=>dashboardSubMenu(vnode.attrs.id)}>
				<p class="ph2 pv3 mv0 near-white dim bb b--gray">
					<Icons id={vnode.attrs.id+"chevron-right"} name="chevron-right" class="h1 pr2"/>
					<Icons id={vnode.attrs.id+"chevron-bottom"} name="chevron-bottom" class="h1 pr2 dn"/>
					{vnode.attrs.title}
				</p>
				<ul class="list pt0 pl0 dn" id={vnode.attrs.id} >{vnode.children}</ul>
			</li>
		)
	}
}

var menu = {
	oninit: function() {
		document.getElementById("appContent").style.paddingTop = "53px";
		m.redraw()
	},
	view: function(vnode) {
		return (
			<section class="w-100 z-max fixed">

				<nav class="w-100 bg-black-90 near-white shadow-4 z-5 cf dark-gray tc" style="height:53px;" onclick={dashboardMenu} >
						<Icons id="menuBtn" name="menu" class="absolute pv2 ph1 h1 dib ma2 dim left-0"/>
						<img alt=""  class="pt2" src="../../assets/img/logo.png" style="max-height:30px;"/>

				</nav>

				<div id="dashboardMenu"  class="w-70 w-30-m w-20-l fl dn bg-black-80 pa0 br2 br--bottom" style="">
					<ul class="list pt0 pl0 w-100 ma0 overflow-scroll" style="">
						{m(linkItem,{href:"/logout",icon:"logout"},"Logout")}
						{m(menuItem,{href:"/agent/myprofile",icon:"user"},"Profile")}
						{m(menuItem,{href:"/agent/taskmanager",icon:"user"},"Task Manager")}
						{m(menuItem,{href:"/agent/notifications",icon:"user"},"Notifications")}
						{m(menuItem,{href:"/agent/gethelp",icon:"user"},"Get Help")}
					</ul>
				</div>
			</section>
		)
	}
}
