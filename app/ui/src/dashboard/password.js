import m from 'mithril';

import {menu} from './#menu.js';
import Icons from '../#icons.js';

import {pageTitle} from '../#pageComponents.js';
import {defaultImage} from '../#pageFunctions.js';
import {displayImage} from '../#pageFunctions.js';

import {switchPageMode} from '../#pageFunctions.js';
import {saveForm} from '../#pageFunctions.js';

var viewHeader = {
	view: function(vnode){
		return (
			m("nav",{class:"w-100 bg-black white-90 shadow-4 z-5 cf tc relative fixed top-0"},[
				m("a",{class:"link",oncreate:m.route.link,href:"/customer"},[
					m(Icons,{name:"x",class:"absolute white-90 h1 dim left-0 top-0 pa3"})
				]),
				m("p","PROFILE"),
				m(Icons,{name:"pencil",class:"absolute white-90 h1 dim right-0 top-0 pa3 pointer",onclick:page.editForm}),
			])
		)
	}
}

var editHeader = {
	view: function(vnode){
		return (
			m("nav",{class:"w-100 bg-black white-90 shadow-4 z-5 cf tc relative fixed top-0"},[
				m(Icons,{name:"chevron-left",class:"absolute white-90 h1 dim left-0 top-0 pa3 pointer",onclick:page.viewForm}),
				m("p","EDIT PROFILE"),
				m(Icons,{name:"check",class:"absolute white-90 h1 dim right-0 top-0 pa3",onclick:page.saveForm}),
			])
		)
	}
}

var page = {
	Url: "/api/profile", Form: {},
	editForm:function(){
		switchPageMode(page, "edit");
		m.render(document.getElementById('appMenu'), m(editHeader));
	},
	viewForm:function(){
		switchPageMode(page, "view");
		m.render(document.getElementById('appMenu'), m(viewHeader));
	},
	saveForm:function(){ saveForm(page); },
	oninit: function() {
		m.render(document.getElementById('appMenu'), m(viewHeader));
		document.getElementById("appContent").style.paddingTop = "53px";
		m.redraw()
	},
	oncreate:function(){ switchPageMode(page, "view"); defaultImage("image")},
	view:function(){
	return  (

		<section>


			<div class="cf mv4"></div>
			<div id="appAlert"></div>

			<section id="formView" class={page.formView}>

				<div class="fl w-100 ">
				<header class="tc pv2">
					{m("input",{ type:"file", disabled: page.editMode, class: "dn", id: "imageFile",value: "",
						onchange: function(event){displayImage(event, page.Form, "Image")}})}
					{m("img",{class: "br-100 pa1 ba b--gray h4 w4 pointer", style:"", id: "image", src:page.Form.Image,
						onerror: m.withAttr("id",function(id){ defaultImage(id); }),
						onclick:function(){document.getElementById("imageFile").click()}
					})}

					<h2 class="f5 f4-ns fw4 mid-gray pb0 mb0"> {page.Form.Firstname} {page.Form.Lastname} </h2>
					<h2 class="f6 gray fw2 tracked i pt0 mt0">{page.Form.Username} </h2>
				</header>

				</div>


				<div class="fl w-100 gray">

							<div class="cf w-100 pa2 f6 fw5">
								Private Details
							</div>

							<div class="cf w-100">
								<div class="fl pa2 "> <small class="gray b">Title:</small>
									{m("select",{ class: "w-100 pa1", disabled: page.editMode, value:page.Form.Title,
										onchange: m.withAttr("value",function(value) {page.Form.Title = value})},
										[m("option",{value:""},""), m("option","Mr"), m("option","Mrs"),m("option","Miss"),])}
								</div>
							</div>

							<div class="cf w-100">

								<div class="fl w-100 pa2 w-50-m w-25-l"> <small class="gray b">Firstname:</small>
									{m("input",{ type: "text", class: "w-100 pa1", disabled: page.editMode, value:page.Form.Firstname,
										onchange: m.withAttr("value",function(value) {page.Form.Firstname = value}) })}
								</div>

								<div class="fl w-100 pa2 w-50-m w-25-l"> <small class="gray b">Lastname:</small>
									{m("input",{ type: "text", class: "w-100 pa1", disabled: page.editMode, value:page.Form.Lastname,
										onchange: m.withAttr("value",function(value) {page.Form.Lastname = value}) })}
								</div>

								<div class="fl w-100 pa2 w-50-m w-25-l"> <small class="gray b">Othername:</small>
									{m("input",{ type: "text", class: "w-100 pa1", disabled: page.editMode, value:page.Form.Othername,
										onchange: m.withAttr("value",function(value) {page.Form.Othername = value}) })}
								</div>

								<div class="fl w-100 w-50-m w-25-l pa2"> <small class="gray b">Mobile:</small>
									{m("input",{ type: "text", class: "w-100 pa1", disabled: page.editMode, value:page.Form.Mobile,
										onchange: m.withAttr("value",function(value) {page.Form.Mobile = value}) })}
								</div>
							</div>

							<div class="cf w-100">

								<div class="fl w-100 w-50-ns pa2"> <small class="gray b">Email:</small>
									{m("input",{ type: "email", class: "w-100 pa1", disabled: page.editMode, value:page.Form.Email,
										onchange: m.withAttr("value",function(value) {page.Form.Email = value}) })}
								</div>


								<div class="fl w-100 w-50-ns pa2"> <small class="gray b">Website:</small>
									{m("input",{ type: "text", class: "w-100 pa1", disabled: page.editMode, value:page.Form.Website,
										onchange: m.withAttr("value",function(value) {page.Form.Website = value})})}
								</div>
							</div>

							<div class="cf w-100 ">
								<div class="fl w-100 w-50-l pa2"> <small class="gray b">Address:</small>
									{m("input",{ type: "text", class: "w-100 pa1", disabled: page.editMode, value:page.Form.Address,
										onchange: m.withAttr("value",function(value) {page.Form.Address = value})})}
								</div>

								<div class="fl w-100 w-50-m w-30-l pa2"> <small class="gray b">City:</small>
									{m("input",{ type: "text", class: "w-100 pa1", disabled: page.editMode, value:page.Form.City,
										onchange: m.withAttr("value",function(value) {page.Form.City = value})})}
								</div>

								<div class="fl w-100 w-25-m w-10-l pa2"> <small class="gray b">State:</small>
									{m("input",{ type: "text", class: "w-100 pa1", disabled: page.editMode, value:page.Form.State,
										onchange: m.withAttr("value",function(value) {page.Form.State = value})})}
								</div>

								<div class="fl w-100 w-25-m w-10-l pa2"> <small class="gray b">Country:</small>
									{m("input",{ type: "text", class: "w-100 pa1", disabled: page.editMode, value:page.Form.Country,
										onchange: m.withAttr("value",function(value) {page.Form.Country = value})})}
								</div>

								<div class="fl w-100 w-50-ns pa2"> <small class="gray b">Bank Name:</small>
									{m("input",{ type: "email", class: "w-100 pa1", disabled: page.editMode, value:page.Form.BankName,
										onchange: m.withAttr("value",function(value) {page.Form.BankName = value}) })}
								</div>

								<div class="fl w-100 w-50-ns pa2"> <small class="gray b">Account Type:</small>
									{m("input",{ type: "text", class: "w-100 pa1", disabled: page.editMode, value:page.Form.BankAccountType,
										onchange: m.withAttr("value",function(value) {page.Form.BankAccountType = value}) })}
								</div>

								<div class="fl w-100 w-50-ns pa2"> <small class="gray b">Account Name:</small>
									{m("input",{ type: "text", class: "w-100 pa1", disabled: page.editMode, value:page.Form.BankAccountName,
										onchange: m.withAttr("value",function(value) {page.Form.BankAccountName = value})})}
								</div>

								<div class="fl w-100 w-50-ns pa2"> <small class="gray b">Account Number:</small>
									{m("input",{ type: "text", class: "w-100 pa1", disabled: page.editMode, value:page.Form.BankAccountNumber,
										onchange: m.withAttr("value",function(value) {page.Form.BankAccountNumber = value})})}
								</div>



								<div class="fl w-100 pa2"> <small class="gray b">About Customer:</small>
									{m("textarea",{ class: "w-100 h3 tl pa2 ba b--black-10", disabled: page.editMode, value:page.Form.Description,
										onchange: m.withAttr("value",function(value) {page.Form.Description = value}) })}
								</div>

							</div>

				</div>

			</section>

		</section>
	)
  }
}

export default page;
