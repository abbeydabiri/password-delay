import m from 'mithril';
import {menu} from './#menu.js';
import {validateSubmit} from './#validateSubmit.js';

var action = {
	Submit: function() {
		var actionFields = [
			{validationType : 'email', fieldID : 'email'},
		]
		validateSubmit( "/api/forgot", actionFields);
	},
};


export var page = {
	oninit:function(vnode){
		m.render(document.getElementById('appMenu'), m(menu,{color:"white"}))
	},
	view:function(vnode){
		return (
			<section class="loginBG min-vh-100">
				<div id="appAlert"></div>
				<section class="mw9-ns center pa2 black-80 flex flex-row justify-center">

				<div class="dib mv4 w-100 w-60-m w-30-l">
					<div class="mv4 w-100 tc">
						<a href="/" oncreate={m.route.link} class="no-underline pointer">
							<img alt=""  src="../../assets/img/logoBlack.png" class="cf"/>
						</a>
					</div>


					<div class=" pa3 w-100 bg-white br2 ba b--silver shadow-1">
						<div class="f6 avenir cf pv3">

							<div class="pb3 f5 tracked fw5">
								Forgotten password
							</div>

							<input type="hidden" id="action"/>

							<small class="fw6">Email address</small>
							{m("div", {class:"br1 ba b--silver"} ,m("input",{ placeholder: "you@domain", type:"text", class: "w-100  bw0 br1 pa2 f6", id:"username",
								oninput: m.withAttr("value",function(value) {page.Username = value}),
								onkeyup: function(event) {if(event.key=="Enter"){action.Submit()}}
							 }))}

							 <br/><br/>

							<div class="pv3 tc">
								<span class="btnPrimary near-white shadow-4 pointer fl w-100 dim pv3 br1" onclick={action.Submit}>Send me reset instructions </span>
							</div>
						</div>
					</div>

					<div class="w-100 pv4 cf tc f6">
						<p class="near-white">
							Dont have an account? <a href="/signup" oncreate={m.route.link} class="near-white no-underline ph1 br1">Sign up  today</a>
						</p>

						<p class="">
							<a href="/login" oncreate={m.route.link} class="near-white no-underline ph1 br1">Log me in</a>
						</p>
					</div>

				</div>
				</section>
			</section>
		)
	}
}


export default page;
