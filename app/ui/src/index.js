import m from 'mithril';
import menu from './#menu.js';

var page = {
	oninit:function(vnode){
		m.render(document.getElementById('appMenu'), m(menu,{color:"red"}))
	},
	view:function(vnode){
		return (
			<section>
				<div id="appAlert"></div>
				<section class="flex-ns items-center">

					<div class="mw6 ph5 ">
						<img src="../../../assets/img/appimage.png"/>
					</div>
					<div class="tc tl-ns ph3">
						<h1 class="f3 f2-l fw3 mb3 mt4 mt0-ns"><b>Password Delay</b> Intelligence Algorithms.</h1>
						<h2 class="f5 f4-l fw3 mb4 mb5-l lh-title">
							A demo application demonstrating close procedure
							crypto-analysis and fourth tier security development
							on input algorithms to a vulnerable interoperability
							telecommunication cyberspace scenario
						</h2>

						<a href="" class="dib grow no-underline gray ph3 ">
							<img class="db" height="40px" src="../../../assets/img/googlestore.png"/>
							&nbsp;
						</a>

						<a href="#" class="dib grow no-underline gray ph3 ">
							<img class="db" height="40px" src="../../../assets/img/applestore.png"/>
							<small>**coming Soon**</small>
						</a>
					</div>
				</section>

				<section class="center w-100 pv2 tc f6">
					<small class="tc gray">
						<a href="/privacy" class="gray no-underline br1 ph1">Privacy Policy</a>&nbsp; -
						<a href="/terms" class="gray no-underline br1 ph1">Terms of use</a>
					</small>
				</section>
			</section>
		)
	}
}

export default page;
