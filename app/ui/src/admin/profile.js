import m from 'mithril';
import menu from './#menu.js';

import Icons from '../#icons.js';
import {pageTitle} from '../#pageComponents.js';
import {defaultImage} from '../#pageFunctions.js';
import {displayImage} from '../#pageFunctions.js';

import {switchPageMode} from '../#pageFunctions.js';
import {saveForm} from '../#pageFunctions.js';

var page = {
	Url: "/api/profile", Form: {},

	editForm:function(ID){ if(ID>0){page.Form.ID = ID} switchPageMode(page, "edit");},
	viewForm:function(ID){ switchPageMode(page, "view"); },
	saveForm:function(){ saveForm(page); },

	oninit:function(){ m.render(document.getElementById('appMenu'), m(menu))},
	oncreate:function(){ switchPageMode(page, "view"); defaultImage("Image")},
	view:function(){
	return  (<section class="min-vh-100">

			<div id="appAlert"></div>

			<div class="pa1 pa2-ns ph4-l mw7-l center">

				<section id="formView" class={page.formView}>

					<div class="fl w-100 pa2 dark-red">
						<a href="/admin"><Icons name="delete" class="h1 dark-red dim pointer" /></a>
						<small class="i pa2 b ttu">{page.Mode} Profile Details </small>
					</div>
					{page.formButton}

					<div class="fl w-100 ">
						<header class="tc pv2">
							{m("input",{ type:"file", disabled: page.editMode, class: "dn", id: "imageFile",value: "",
								onchange: function(event){displayImage(event, page.Form, "Image")}})}

							{m("img",{class: "br-100 pa1 ba b--gray h4 w4 pointer", style:"", id: "Image", src:page.Form.Image,
								onerror: m.withAttr("id",function(id){ defaultImage(id); }),
								onclick:function(){document.getElementById("imageFile").click()}
							})}

							<h2 class="f5 f4-ns fw4 mid-gray pb0 mb0"> {page.Form.Fullname} </h2>
							<h2 class="f6 gray fw2 tracked i pt0 mt0">{page.Form.Username} </h2>
						</header>
					</div>

					<div class="fl w-100 gray">
						<div class="cf w-100 pa2 f6 fw5">
							Private Details
						</div>

						<div class="cf w-100">
							<div class="fl w-50 pa2 w-25-l"> <small class="gray b">Fullname:</small>
								{m("input",{ type: "text", class: "w-100 pa1", disabled: page.editMode, value:page.Form.Fullname,
									onchange: m.withAttr("value",function(value) {page.Form.Fullname = value}) })}
							</div>

							<div class="fl w-50 pa2 w-25-l"> <small class="gray b">Mobile:</small>
								{m("input",{ type: "text", class: "w-100 pa1", disabled: page.editMode, value:page.Form.Mobile,
									onchange: m.withAttr("value",function(value) {page.Form.Mobile = value}) })}
							</div>

							<div class="fl w-100 pa2 w-50-l"> <small class="gray b">Email:</small>
								{m("input",{ type: "text", class: "w-100 pa1", disabled: page.editMode, value:page.Form.Email,
									onchange: m.withAttr("value",function(value) {page.Form.Email = value}) })}
							</div>
						</div>

						<div class="cf w-100 ">
							<div class="fl w-100 pa2"> <small class="gray b">About Me:</small>
								{m("textarea",{ class: "w-100 h3 tl pa2 ba b--black-10", disabled: page.editMode, value:page.Form.Description,
									onchange: m.withAttr("value",function(value) {page.Form.Description = value}) })}
							</div>
						</div>
					</div>

				</section>

			</div>
		</section>
	)
  }
}

export default page;
