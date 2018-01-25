import m from 'mithril';
import menu from './#menu.js';

import Icons from '../#icons.js';
import {pageMenu} from '../#pageComponents.js';
import {pageTitle} from '../#pageComponents.js';
import {pageSearchForm} from '../#pageComponents.js';
import {pageSearchList} from '../#pageComponents.js';

import {defaultImage} from '../#pageFunctions.js';
import {displayImage} from '../#pageFunctions.js';

import {switchPageMode} from '../#pageFunctions.js';
import {saveForm} from '../#pageFunctions.js';

var page = {
	Url: "/api/hits", Form: {}, formView : "dn",
	newForm:function(){ switchPageMode(page, "new"); },
	editForm:function(ID){ if(ID>0){page.Form.ID = ID} switchPageMode(page, "edit");},
	viewForm:function(ID){ page.Form.ID = ID; switchPageMode(page, "view"); },
	saveForm:function(){ saveForm(page); },
	searchForm:function(){ switchPageMode(page, "search"); },
	oninit:function(){
		m.render(document.getElementById('appMenu'), m(menu));
		page.pageSearchList = m(pageSearchList);
		page.pageSearchForm = m(pageSearchForm,{ newForm: page.newForm, classNewButton: "dn", searchForm: page.searchForm,
			searchFields: [ m("option","Code"), m("option","Title"), m("option","Url"),m("option","IPAdress"),m("option","UserAgent"), m("option","Workflow"), m("option","Created"), ]
		});
	},
	oncreate:function(){  page.searchForm() },
	view:function(){
	return  (
		<section>

			{m(pageTitle,"Security Log")}



			<div id="appAlert"></div>

			<div class="pa1 pa2-ns ph4-l mw9 center">

				<section id="searchView" class={page.searchView}>
					{page.pageSearchForm}
					{page.pageSearchList}
				</section>

				<section id="formView" class={page.formView}>

					<div class="fl w-100 pa2 ph3-ns dark-red">
						<Icons name="x" class="h1 dark-red dim pointer" onclick={page.searchForm}/>
						<small class="i pa2 b ttu">{page.Mode} Security Log Details </small>
					</div>

					<div class="fl w-100 ph2">
						<article class="center ">

							<div class="cf w-100">
								{m("input",{ type:"hidden", value:page.Form.ID, onchange: m.withAttr("value",function(value) {page.Form.ID = value})})}
								<div class="fl w-100 w-50-m w-25-l pa2"> <small class="gray b">Code:</small>
									{m("input",{ type: "text", class: "w-100 pa1", disabled: page.editMode, value:page.Form.Code,
										onchange: m.withAttr("value",function(value) {page.Form.Code = value}) })}
								</div>



								<div class="fl w-100 w-50-m w-25-l pa2"> <small class="gray b">IP-Address:</small>
									{m("input",{ type: "email", class: "w-100 pa1", disabled: page.editMode, value:page.Form.IPAddress,
										onchange: m.withAttr("value",function(value) {page.Form.IPAddress = value}) })}
								</div>
							</div>




							<div class="cf w-100">
								<div class="fl w-100 w-50-l pa2"> <small class="gray b">Title:</small>
									{m("input",{ type: "text", class: "w-100 pa1", disabled: page.editMode, value:page.Form.Title,
										onchange: m.withAttr("value",function(value) {page.Form.Title = value}) })}
								</div>

								<div class="fl w-100  w-50-l pa2"> <small class="gray b">Url:</small>
									{m("input",{ type: "email", class: "w-100 pa1", disabled: page.editMode, value:page.Form.Url,
										onchange: m.withAttr("value",function(value) {page.Form.Url = value}) })}
								</div>
							</div>

							<div class="cf w-100">

								<div class="fl w-100 pa2"> <small class="gray b">User Agent:</small>
									{m("textarea",{ class: "w-100 h3 tl pa2 ba b--black-10", disabled: page.editMode, value:page.Form.UserAgent,
										onchange: m.withAttr("value",function(value) {page.Form.UserAgent = value}) })}
								</div>

								<div class="fl w-100 pa2"> <small class="gray b">Description:</small>
									{m("textarea",{ class: "w-100 h3 tl pa2 ba b--black-10", disabled: page.editMode, value:page.Form.Description,
										onchange: m.withAttr("value",function(value) {page.Form.Description = value}) })}
								</div>

							</div>

							{page.formButton}

						</article>
					</div>
				</section>
			</div>
		</section>
	)
  }
}

export default page;
