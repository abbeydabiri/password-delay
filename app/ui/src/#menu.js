var m = require("mithril");
import Icons from './#icons.js';

// export function menu() {
// 	m.render(document.getElementById('appMenu'), m(menu))
// }

export var menu = {
	color:"red",
	oninit: function() {
		// document.getElementById("appContent").style.paddingTop = "53px";
		// m.redraw()
	},
	linkItem : {
		view: function(vnode) {
			return(
				<a class="link" href={vnode.attrs.href}>
					<li class="tc" onclick={menu.toggle}>
						<p class="ph2 pv3 mv0 black dim bb b--gray">
							{vnode.children}
						</p>
					</li>
				</a>
			)
		}
	},
	menuItem : {
		view: function(vnode) {
			return(
				<a class="link f5" oncreate={m.route.link} href={vnode.attrs.href}>
					<li class="tc" onclick={menu.toggle}>
						<p class="ph2 pv3 mv0 gray hover-red dim">
							{vnode.children}
						</p>
					</li>
				</a>
			)
		}
	},
	toggle: function() {
		var appMenuDiv = document.getElementById("menuToggle");
		appMenuDiv.classList.toggle('dn');
		appMenuDiv.classList.toggle('animated');
		appMenuDiv.classList.toggle('bounceInDown');

		document.getElementById("nav").classList.toggle('dn');
		document.getElementById("menuBlur").classList.toggle('vh-100');
		document.getElementById("html").classList.toggle('overflow-hidden');
	},
	view: function(vnode) {
		return (
			<section id="menuBlur" class="w-100 z-max fixed  ">
				<div id="menuToggle"  class=" w-100 w-30-m w-20-l mw7 center fr dn menuCloudBG pa0" style="">
					<ul class="list pt0 pl0 w-100 ma0 overflow-scroll" style="">
						{m(menu.menuItem,{href:"/",icon:"user"},"ABOUT US")}
						{m(menu.menuItem,{href:"/signup",icon:"user"},"SIGN UP")}
						{m(menu.menuItem,{href:"/login",icon:"logout"},"LOG IN")}
						<li class="tc" onclick={menu.toggle}>
							<p class="ph2 pv3 mv0 near-white loginBG">
								CLOSE
							</p>
						</li>
					</ul>
				</div>

				<nav id="nav" class={"w-100 black z-5 ph2 mw7 center  "+vnode.attrs.color} style="height:53px" >
						<img class="fl f5 ma2 tracked fw5" src="../../assets/img/logo.png" height="40px"/>
						<Icons name="menu" class="fr mr4 mv3 h1 dim" onclick={menu.toggle}/>
				</nav>
			</section>
		)
	}
}

export default menu;
