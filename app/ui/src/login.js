import m from 'mithril';
import {menu} from './#menu.js';
import {logVisitor} from './#utils.js';
import {validateSubmit} from './#validateSubmit.js';

var action = {
	Submit: function() {
		var actionFields = [
			{validationType : '', fieldID : 'username'},
			{validationType : '', fieldID : 'password'},
		]
		validateSubmit( "/api/login", actionFields);
	},
};


var page = {
	oninit:function(vnode){
		m.render(document.getElementById('appMenu'), m(menu,{color:"white"}))
	},
	view:function(vnode){
		return (
			<article class="vh-100 dt w-100 loginBG">
				<div id="appAlert"></div>
				<div class="dtc v-mid tc white ph3 ph4-l">

					<section class="mw9-ns center pa2 near-white flex flex-row justify-center">
						<div class="dt w-100 w-60-m w-30-l">
							<div class=" pa3 w-100 ">
								<div class="f6 avenir cf">

									<div class="pb3 f5 tracked fw5 fl">
										Welcome back!
									</div>

									<input type="hidden" id="action"/>

									{m("input",{ placeholder: "username", type:"text", class: "w-100 bn menuCloudBG br1 pa3 f6", id:"username",
										oninput: m.withAttr("value",function(value) {page.Username = value}),
										onkeyup: function(event) {if(event.key=="Enter"){action.Submit()}}
									 })}

									<div class="cf mv2"></div>

									{m("input",{ placeholder: "Password", type:"password", class: "w-100 bn menuCloudBG br1 pa3 f6", id:"password",
										oninput: m.withAttr("value",function(value) {page.Password = value}),
										onkeyup: function(event) {if(event.key=="Enter"){action.Submit()}}
									 })}

									<div class="cf mv1"></div>

									<div class="pv2 tc">
										<span class="menuCloudBG dark-red shadow-4 pointer fl w-100 dim pv3 br1" onclick={action.Submit}>Log me in » </span>
									</div>
								</div>
							</div>

							<div class="center f6 bottom-0">
								<small class="near-white">
									Dont have an account? <a href="/signup" oncreate={m.route.link} class="near-white no-underline ph1 br1">Sign up  today</a>
								<br/>
									<a href="/forgot" oncreate={m.route.link} class="near-white no-underline ph1 br1">Forgot your password?</a>
								</small>
							</div>
						</div>
					</section>

				</div>
			</article>
		)
	}
}

export default page;
