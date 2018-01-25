import m from 'mithril';
import menu from './#menu.js';

import Icons from '../#icons.js';

import {defaultImage} from '../#pageFunctions.js';
import {displayImage} from '../#pageFunctions.js';

import {switchPageMode} from '../#pageFunctions.js';
import {saveForm} from '../#pageFunctions.js';

import dashboardHits from './hits.js';
import dashboardUsers from './users.js';

var page = {
	Url: "/api/dashboard", Form: {},
	formCurrent : dashboardUsers,
	editForm:function(ID){ if(ID>0){page.Form.ID = ID} switchPageMode(page, "edit");},
	viewForm:function(ID){ switchPageMode(page, "view"); },
	saveForm:function(){ saveForm(page); },
	oninit:function(){ m.render(document.getElementById('appMenu'), m(menu)) },

	showForm: function(form) {
		startLoader();
		page.Menuusers = page.Menuhits = "near-white dim";
		switch (form.Url) {
			case "/api/hits":
				page.Menuhits = "dark-red bg-secondary dim";
				break;
			case "/api/users":
				page.Menuusers = "dark-red bg-secondary dim";
				break;
		}
		page.formCurrent = form
		stopLoader();
	},
	oncreate:function(){ switchPageMode(page, "view"); page.showForm(dashboardUsers) },
	view:function(){
	return  (
		<section>

			<div id="appAlert"></div>

			<div class="dark-red ph2 pt1 pb3 bg-primary">
				<div class="near-white">
					<div class="cf">
						<div class="fl w-100 w-50-m w-25-l pv2">
							<div class="bg-white-10 br2 pa2">
								<a class="fr" oncreate="{m.route.link}" href="/admin/profile">
									<Icons name="pencil" class="h1 near-white"/>
								</a>

								<p class="mv1 pv1 f4">Profile</p>
								<small class="dt pa1"> {page.Form.Fullname} </small>
								<small class="dt pa1"> {page.Form.Email} </small>
								<small class="dt pa1"><span class="fw6">Username: </span> {page.Form.Username} </small>
								<small class="dt pa1"><span class="fw6">Status: </span> {page.Form.Workflow} </small>
							</div>
						</div>

					</div>
				</div>
			</div>

			<div class="pv0 cf w-100">
				<section>
					<div class="flex ph2 h-100 f6 i bg-primary">
						<span class={"v-mid pointer link h-100 flex pa3 items-center br1 ba b--white-10 "+page.Menuusers} onclick={()=>page.showForm(dashboardUsers)}>
							<Icons name="people" class="h1 pr2"/>
							User Manager
						</span>
						&nbsp;
						<span class={"v-mid pointer link h-100 flex pa3 items-center br1 ba b--white-10 "+page.Menuhits} onclick={()=>page.showForm(dashboardHits)}>
							<Icons name="lock-locked" class="h1 pr2"/>
							Security Log
						</span>
					</div>
				</section>


				{m(page.formCurrent)}

			</div>
		</section>
	)},
}

export default page;
