import m from 'mithril';
import {menu} from './#menu.js';
import {appAlert} from './#utils.js';

var page = {Form: {Username:"", Password:"", CharSec:[]}, timer:0, timerLabel:"dn", timerInterval:"",
	startTimer: function() { page.timer = 0; clearInterval(page.timerInterval);
		page.timerInterval = setInterval( function() { page.timer++; m.redraw()}, 1000);
	},
	submit: function() {
		if (page.Form.Username.length == 0) { appAlert([{ message: "Username is required" }]); return }
		if (page.Form.Password.length == 0) { appAlert([{ message: "Password is required" }]); return }

		startLoader();
		m.request({ method: 'POST', url: "/api/login", data: page.Form, }).then(function(response) {

			var lStoploader = true;
			if (response.Body !== null && response.Body !== undefined) {
				if (response.Body.Redirect !== undefined && response.Body.Redirect !== null &&
					response.Body.Redirect !== "") {
					window.location.href = response.Body.Redirect
					lStoploader = false;
				}
			}
			appAlert([{ message: response.Message }]);
			if(lStoploader) { stopLoader();}
		}).catch(function(error) {
			appAlert([{ message: error }]);
			stopLoader();
		});
	},
	oninit:function(vnode){
		m.render(document.getElementById('appMenu'), m(menu,{color:"white"}))
	},
	view:function(vnode){
		return (
			<article class="vh-100 dt w-100 bg-primary">
				<div id="appAlert"></div>
				<div class="dtc v-mid tc white ph3 ph4-l">

					<section class="mw9-ns center pa2 near-white flex flex-row justify-center">
						<div class="dt w-100 w-60-m w-30-l">
							<div class=" pa3 w-100 ">
								<div class="f6 cf">

									<div class="pb3 f5 tracked fw5 fl">
										Welcome back!
									</div>

									<input type="hidden" id="action"/>

									{m("input",{ placeholder: "username", type:"text", value:page.Form.Username, class: "w-100 bn bg-secondary br1 pa3 f6",
										oninput: m.withAttr("value",function(value) {page.Form.Username = value}),
										onkeyup: function(event) {
											if(event.key=="Enter"){page.submit()}
										}
									 })}

									<div class="cf mv2">
										<small class={page.timerLabel}>{page.timer} seconds left</small>
									</div>

									{m("input",{ placeholder: "Password", type:"password", value:page.Form.Password, class: "w-100 bn bg-secondary br1 pa3 f6",
										oninput: m.withAttr("value",function(value) {page.Form.Password = value}),
										onblur: function(){
											page.timerLabel = "dn"; page.timer = 0; clearInterval(page.timerInterval);
											m.redraw();
										}, onfocus: function(){
											page.timerLabel = "";
											page.Form.CharSec = [];
											page.Form.Password = "";
											page.startTimer();
											m.redraw();
										},
										onkeyup: function(event) {
											if(event.key=="Enter"){page.submit(); return;}
											console.log(event.key);
											if(event.key=="Backspace" || event.key=="Delete"){
												page.Form.CharSec = [];
												page.Form.Password = "";
												page.startTimer();
												m.redraw();
												return;
											}
											page.Form.CharSec.push(page.timer);
											page.startTimer();
										}
									 })}

									<div class="cf mv1"></div>

									<div class="pv2 tc">
										<button class="bg-secondary bn dark-red shadow-4 pointer fl w-100 dim pv3 br1" onclick={page.submit}>Log me in » </button>
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
