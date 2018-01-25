var m = require("mithril");
import Icons from '../#icons.js';

var menu = {
	menuItem : {
	 view: function(vnode) {
		 return(
			 <a class="link" oncreate={m.route.link} href={vnode.attrs.href}>
				 <li onclick={menu.toggle}>
					 <p class="ph2 pv3 mv0 near-white dim bb b--gray">
						 <Icons name={vnode.attrs.icon} class="h1 pr2"/> {vnode.children}
					 </p>
				 </li>
			 </a>
		 )
	 }
	},

	linkItem : {
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
	},

	menuGroup : {
	 view: function(vnode) {
		 return(
			 <li onclick={()=>menu.toggleSub(vnode.attrs.id)}>
				 <p class="ph2 pv3 mv0 near-white dim bb b--gray">
					 <Icons id={vnode.attrs.id+"chevron-right"} name="chevron-right" class="h1 pr2"/>
					 <Icons id={vnode.attrs.id+"chevron-bottom"} name="chevron-bottom" class="h1 pr2 dn"/>
					 {vnode.attrs.title}
				 </p>
				 <ul class="list pt0 pl0 dn" id={vnode.attrs.id} >{vnode.children}</ul>
			 </li>
		 )
	 }
	},
	toggle: function() {
		var appMenuDiv = document.getElementById("dashboardMenu");
		appMenuDiv.classList.toggle('dn');
		appMenuDiv.classList.toggle('animated');
		appMenuDiv.classList.toggle('bounceInLeft');
		document.getElementById("html").classList.toggle('overflow-hidden');
	},
	toggleSub: function(subMenu) {
		document.getElementById(subMenu).classList.toggle('dn');
		document.getElementById(subMenu+"chevron-right").classList.toggle('dn');
		document.getElementById(subMenu+"chevron-bottom").classList.toggle('dn');
	},

	oninit: function() {
		document.getElementById("appContent").style.paddingTop = "53px";
		m.redraw()
	},
	view: function(vnode) {
		return (
			<section class="w-100 z-max fixed">
				<div id="dashboardMenu"  class="w-70 w-30-m w-20-l fl dn bg-black-80 pa0 br2 br--bottom" style="">
					<ul class="list pt0 pl0 w-100 ma0 overflow-scroll" style="">
						{m(menu.linkItem,{href:"/logout",icon:"logout"},"Logout")}
						{m(menu.menuItem,{href:"/agent/myprofile",icon:"user"},"Profile")}
						{m(menu.menuItem,{href:"/agent/taskmanager",icon:"user"},"Task Manager")}
						{m(menu.menuItem,{href:"/agent/notifications",icon:"user"},"Notifications")}
						{m(menu.menuItem,{href:"/agent/gethelp",icon:"user"},"Get Help")}
					</ul>
				</div>

				<nav class="w-100 bg-black-90 near-white shadow-4 z-5 cf dark-gray " style="height:53px;" onclick={menu.toggle} >
					<Icons id="menuBtn" name="menu" class="pv2 ph1 h1 dib ma2 dim"/>
					<img alt=""  class="absolute pt2" src="../../assets/img/logo.png" style="max-height:30px;"/>
				</nav>
			</section>
		)
	}
}
export default menu;
