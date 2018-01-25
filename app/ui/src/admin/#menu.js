var m = require("mithril");
import Icons from '../#icons.js';

var menu = {
	menuItem : {
	 view: function(vnode) {
		 return(
			 <a class="link" oncreate={m.route.link} href={vnode.attrs.href}>
				 <li onclick={menu.toggle}>
					 <p class="ph2 pv3 mv0 near-white dim bb b--white-50">
						 <Icons name={vnode.attrs.icon} class="h1 pr2"/> {vnode.children}
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

				<div id="dashboardMenu"  class="vh-100 w-70 w-40-m w-20-l fl dn bg-primary" style="">
					<ul class="list pt0 pl0 w-100 mt0 overflow-scroll vh-100" style="">

						{m(menu.menuItem,{href:"/admin",icon:"dashboard"},"Dashboard")}
						{m(menu.menuItem,{href:"/admin/users",icon:"people"},"User Manager")}
						{m(menu.menuItem,{href:"/admin/hits",icon:"lock-locked"},"Security Log")}

						<a class="link " oncreate="{m.route.link}" href="/logout">
							<li><p class="ph2 pv3 mv0 near-white dim">
								<Icons name="logout" class="h1 pr2" />
								Logout
							</p></li>
						</a>
					</ul>
				</div>


				<nav class="w-100 bg-secondary dark-red shadow-4 z-5 cf dark-gray " style="height:53px;" onclick={menu.toggle} >
					<Icons id="menuBtn" name="menu" class="pv2 ph1 h1 dib ma2 dim"/>
					<img alt=""  class="absolute pt2" src="../../assets/img/logo.png" style="max-height:30px;"/>
				</nav>

			</section>
		)
	}
}
export default menu;
