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
	Url: "/api/users", Form: {}, formView : "dn",
	newForm:function(){ switchPageMode(page, "new"); },
	editForm:function(ID){ if(ID>0){page.Form.ID = ID} switchPageMode(page, "edit");},
	viewForm:function(ID){ page.Form.ID = ID; switchPageMode(page, "view"); },
	saveForm:function(){ saveForm(page); },
	searchForm:function(){ switchPageMode(page, "search"); },
	oninit:function(){ m.render(document.getElementById('appMenu'), m(menu));
	 	page.pageSearchList = m(pageSearchList);
		page.pageSearchForm = m(pageSearchForm,{ classNewButton: "dn", newForm: page.newForm, searchForm: page.searchForm,
			searchFields: [ m("option","Username"), m("option","Fullname"), m("option","Workflow"), m("option","Created"), ]
		});
	},
	oncreate:function(){ page.searchForm() },
	view:function(){
	return  (
		<section>
			{m(pageTitle,"Users")}



			<div id="appAlert"></div>

			<div class="pa1 pa2-ns ph4-l mw9 center">

				<section id="searchView" class={page.searchView}>
					{page.pageSearchForm}
					{page.pageSearchList}
				</section>

				<section id="formView" class={page.formView}>

					<div class="fl w-100 pa2 ph3-ns dark-red">
						<Icons name="delete" class="h1 dark-red dim pointer" onclick={page.searchForm}/>
						<small class="i pa2 b ttu">{page.Mode} USERs Details </small>
						{page.formButton}
					</div>


					<div class="fl w-100 ph2">
						<article class="center ">

							<div class="cf w-100">
								<div class="fl w-100 pa2 f6">
									{m("input",{ type:"file", disabled: page.editMode, class: "dn", id: "imageFile",value: "",
										onchange: function(event){displayImage(event, page.Form, "Image")}})}

									{m("img",{class: "dib pointer br2", style:"max-width:150px", id: "Image", src:page.Form.Image,
										onerror: m.withAttr("id",function(id){ defaultImage(id); }),
										onclick:function(){document.getElementById("imageFile").click()}
									})}
								</div>
							</div>

							<div class="cf w-100">
								<div class="fl pa2">
									<small class="gray b db">
										Workflow:
									</small>
									{m("select",{ class: "pa1", disabled: page.editMode, value:page.Form.Workflow,
										onchange: m.withAttr("value",function(value) {page.Form.Workflow = value})},
										[m("option",{value:""},""), m("option","enabled"), m("option","disabled"), m("option","blocked"),]
									)}
									<small class="pl2">
										Admin: {m("input",{ type: "checkbox", class: "pa1 mr2", disabled: page.editMode, checked:page.Form.IsAdmin,
											onchange: m.withAttr("checked",function(checked) {page.Form.IsAdmin = checked; })
										})}
										</small>
								</div>
							</div>

							<div class="cf w-100">
								{m("input",{ type:"hidden", value:page.Form.ID, onchange: m.withAttr("value",function(value) {page.Form.ID = value})})}

								<div class="fl w-50 w-25-l pa2"> <small class="gray b">Username:</small>
									{m("input",{ type: "email", class: "w-100 pa1", disabled: page.editMode, value:page.Form.Username,
										onchange: m.withAttr("value",function(value) {page.Form.Username = value}) })}
								</div>

								<div class="fl w-50 w-25-l pa2"> <small class="gray b">Password:</small>
									{m("input",{ type: "email", class: "w-100 pa1", disabled: page.editMode, value:page.Form.Password,
										onchange: m.withAttr("value",function(value) {page.Form.Password = value}) })}
								</div>

								<div class="fl w-50 w-auto-ns  pa2"> <small class="gray b">Delay Character:</small>
									{m("select",{ class: "db pa1", disabled: page.editMode, value:page.Form.DelayChar,
										onchange: m.withAttr("value",function(value) {page.Form.DelayChar = parseInt(value)})},
										[ m("option","0"), m("option","1"), m("option","2"),m("option","3"), m("option","4"),
											m("option","5"), m("option","6"), m("option","7"),m("option","8"), m("option","9"),
											m("option","10"), m("option","11"), m("option","12"),m("option","13"), m("option","14"),
										]
									)}
								</div>

								<div class="fl w-50 w-auto-ns  pa2"> <small class="gray b">Delay Seconds:</small>
									{m("select",{ class: "db pa1", disabled: page.editMode, value:page.Form.DelaySec,
										onchange: m.withAttr("value",function(value) {page.Form.DelaySec = parseInt(value)})},
										[ m("option","0"), m("option","1"), m("option","2"),m("option","3"), m("option","4"),
											m("option","5"), m("option","6"), m("option","7"),m("option","8"), m("option","9"),
											m("option","10"), m("option","11"), m("option","12"),m("option","13"), m("option","14"),
										]
									)}
								</div>

								<div class="fl w-50 w-auto-ns  pa2"> <small class="gray b">Max Failed:</small>
									{m("select",{ class: "db pa1", disabled: page.editMode, value:page.Form.FailedMax,
										onchange: m.withAttr("value",function(value) {page.Form.FailedMax = parseInt(value)})},
										[ m("option","0"), m("option","1"), m("option","2"),m("option","3"), m("option","4"),m("option","5"),]
									)}
								</div>

								<div class="fl w-50 w-auto-ns  pa2"> <small class="gray b">Failed:</small>
									{m("select",{ class: "db pa1", disabled: page.editMode, value:page.Form.Failed,
										onchange: m.withAttr("value",function(value) {page.Form.Failed = parseInt(value)})},
										[ m("option","0"), m("option","1"), m("option","2"),m("option","3"), m("option","4"),m("option","5"),]
									)}
								</div>
							</div>

							<div class="cf w-100">
								<div class="fl w-50 pa2 w-25-l"> <small class="gray b">Fullname:</small>
									{m("input",{ type: "text", class: "w-100 pa1", disabled: "disabled", value:page.Form.Fullname,
										onchange: m.withAttr("value",function(value) {page.Form.Fullname = value}) })}
								</div>

								<div class="fl w-50 pa2 w-25-l"> <small class="gray b">Mobile:</small>
									{m("input",{ type: "text", class: "w-100 pa1", disabled: "disabled", value:page.Form.Mobile,
										onchange: m.withAttr("value",function(value) {page.Form.Mobile = value}) })}
								</div>

								<div class="fl w-100 pa2 w-50-l"> <small class="gray b">Email:</small>
									{m("input",{ type: "text", class: "w-100 pa1", disabled: "disabled", value:page.Form.Email,
										onchange: m.withAttr("value",function(value) {page.Form.Email = value}) })}
								</div>
							</div>



							<div class="cf w-100 ">
								<div class="fl w-100 pa2"> <small class="gray b">About User:</small>
									{m("textarea",{ class: "w-100 h3 tl pa2 ba b--black-10", disabled: "disabled", value:page.Form.Description,
										onchange: m.withAttr("value",function(value) {page.Form.Description = value}) })}
								</div>
							</div>



						</article>
					</div>
				</section>
			</div>
		</section>
	)
  }
}

export default page;
