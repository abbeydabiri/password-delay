var m = require("mithril");
import Icons from '../#icons.js';

export var footerItem = {
	view: function(vnode) {
		return(
			<a class={"f6 f5-l link bg-animate dib pv3 w-25 fl "+vnode.attrs.color}
				oncreate={m.route.link} href={vnode.attrs.href}>
				<Icons name={vnode.attrs.icon} class="h1 center"/>  <br/>
				<small>{vnode.children}</small>
			</a>
		)
	}
}


export var footerLink = {
	view: function(vnode) {
		return(
			<a class={"f6 f5-l link bg-animate dib pv3 w-25 fl "+vnode.attrs.color} href={vnode.attrs.href}>
				<Icons name={vnode.attrs.icon} class="h1 center"/>  <br/>
				<small>{vnode.children}</small>
			</a>
		)
	}
}
