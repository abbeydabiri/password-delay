var m = require("mithril")

import {appAlert} from './#utils.js';
import {checkRedirect} from './#utils.js';

import {pageFormButton} from './#pageComponents.js';
import {pageFormValidate} from './#pageFormValidate.js';

import {pageSearchList} from './#pageComponents.js';
import {getPageSearchListItem} from './#pageComponents.js';

export function defaultImage(idName) {
	document.getElementById(idName).src = "/assets/img/default.jpg";
}

export function encodeFileBase64(e, page, field) {
	var reader = new FileReader();
	if (e.target.files[0] !== undefined) {
		reader.readAsDataURL(e.target.files[0]);
		reader.onload = function () {
			page.Form[field] = reader.result;
			m.redraw()
		};
		reader.onerror = function (error) {
			appAlert([{ type: 'bg-red', message: "File Error: " +error, }]);
		};
	} else {page.Form[field] = ""; m.redraw() }
}

export function displayImage(e, pageForm, field) {
	var reader = new FileReader();
	var selectedFile = e.target.files[0]; e.target.value = '';
	reader.readAsDataURL(selectedFile);
	reader.onload = function () {
		if(selectedFile.size > 500000){
			appAlert([{ type: 'bg-red', message: "Image File must be less than 512kb", }]);
		} else {
			switch(selectedFile.type){
				case "image/gif":
				case "image/png":
				case "image/jpg":
				case "image/jpeg":
					pageForm[field] = reader.result;
					var tagName = "Image"
					if(pageForm["imagePos"] != undefined){
						tagName += pageForm["imagePos"];
					}
					document.getElementById(tagName).setAttribute("src",reader.result);
					m.redraw()
					break;

				default:
					appAlert([{ type: 'bg-red', message: "File Must be a valid Image", }]);
					break
			}
		}
		m.redraw()
	};
	reader.onerror = function (error) {
		appAlert([{ type: 'bg-red', message: "Image Error: " +error, }]);
	};
}

export var searchXHR = null
export var searchTimer;

export function getDropdownList(page, Field, dropdownList, dropdownFunc, searchUrl, searchText ) {

	var searchList = [];
	page.Form[Field] = searchText;
	if (searchText.length == 0) {
		page[dropdownList] = searchList;
		// page[dropdownFunc](0,"");
		return
	}

	if (searchTimer){ clearTimeout(searchTimer); }
	if (searchXHR !== null) { searchXHR.abort() } searchXHR = null;

	searchTimer = setTimeout(function(){
		//abort previous search
		var liClass="link pa0 mt0 hover-bg-light-gray pa2";
		m.request({ method: 'GET', url: searchUrl+"?search="+searchText,
			config: function(xhr) {searchXHR = xhr}, }).then(function(response) {
			checkRedirect(response);
			if (response.Code == 200) {
				if (response.Body !== null && response.Body !== undefined ){

					response.Body.map(function(result) {
						if (result.ID > 0) {
							var listComponent = m("li", { ID: result.ID, class:liClass,
									onclick:()=>page[dropdownFunc](result.ID,result.Details)
								}, result.Details)

							if (result.Code !== undefined && result.Code !== "") {
							var	listComponent = m("li", { Code: result.Code, class:liClass,
									onclick:()=>page[dropdownFunc](result.Code,result.Details)
								}, result.Details)
							}
							searchList.push(listComponent)
						}
					})
				}
			}
			page[dropdownList] = searchList; m.redraw();
		}).catch(function(error) {
			appAlert([{ type: 'bg-red', message: "Network Connectivity Error \n Please Check Your Network Access", }]);
			m.redraw();
		});
	}, 750);
}

export function getPageSearchList(page) {


	var searchList = [];
	var searchText = document.getElementById("searchText").value;
	var searchField = document.getElementById("searchField").value;
	var pageSearchUrl = page.Url+"/search?search="+searchText+"&field="+searchField;

	// if (searchText.length == 0) { return }

	if (searchTimer){ clearTimeout(searchTimer); }
	if (searchXHR !== null) { searchXHR.abort() } searchXHR = null;

	searchTimer = setTimeout(function(){

		m.request({ method: 'GET', url: pageSearchUrl,
			config: function(xhr) {searchXHR = xhr}, }).then(function(response) {

			checkRedirect(response);
			if (response.Code == 200) {
				if (response.Body !== null && response.Body !== undefined ){
					var POS = 1;
					response.Body.map(function(result) { if (result.ID > 0) {
						searchList.push( m(getPageSearchListItem, {POS: POS++, Details: result.Details,
							View: ()=>page.viewForm(result.ID), Edit: ()=>page.editForm(result.ID),
							Delete: ()=>page.deleteForm(result.ID),
								Date: result.Date, }
						))
					}})
				}
			}
			page.pageSearchList = m(pageSearchList,{searchList: searchList});
		}).catch(function(error) {
			appAlert([{ type: 'bg-red', message: "Network Connectivity Error \n Please Check Your Network Access", }]);
		});
	}, 750);
}

export function getData(page) {

	return m.request({ method: 'GET', url: page.Url, data: {id: page.Form.ID}, }).then(function(response) {
		var Alert = [];
		var alertType = "bg-green";
		checkRedirect(response);

		if (response.Code == 200) {
			if (response.Body !== null && response.Body !== undefined ){
				page.Form = response.Body;

				if (page.dropdownFuncRecipients !== undefined && page.Form.RecipientsID !== undefined){
					page.dropdownFuncRecipients(0,"");
				}

				if (page.dropdownFuncUsernames !== undefined && page.Form.UsernamesID !== undefined){
					page.dropdownFuncUsernames(0,"");
				}

				if (page.dropdownFuncRoles !== undefined && page.Form.RolesID !== undefined){
					page.dropdownFuncRoles(0,"");
				}
			}

		} else {
			alertType = "bg-red";
		}


		if (response.Message !== null
			 && response.Message !== undefined && response.Message !== "" ){
			Alert.push({ type: alertType, message: response.Message });
		}
		appAlert(Alert);

	}).catch(function(error) {
		appAlert([{ type: 'bg-red', message: "Network Connectivity Error \n Please Check Your Network Access \n"+error, }]);
	});
}

export function saveForm(page) {
	startLoader("");

	for (var field in page.Form) {
		if (page.Form[field] == ""){
			delete page.Form[field]
		}
	}

	var Alert = [];
	m.request({ method: 'POST', url: page.Url, data: page.Form, }).then(function(response) {
		checkRedirect(response);

		var alertType = 'bg-green';
		if (response.Code !== 200) { alertType = 'bg-red'; }
		else {
			if (response.Body !== null && response.Body !== undefined ){
				page.viewForm(response.Body);
			}
		}

		if (response.Message !== null && response.Message !== undefined && response.Message !== "" ){
			Alert.push({ type: alertType, message: response.Message });
		}

		if (response.Error !== null && response.Error !== undefined && response.Error !== "" ){
			Alert.push({ type: 'bg-red', message: response.Error });
		}

		if(Alert.length > 0) {
			appAlert(Alert);
		}
		stopLoader();
	}).catch(function(error) {
		appAlert([{ type: 'bg-red', message: "Network Connectivity Error \n Please Check Your Network Access", }]);
		stopLoader();
	});
}

export function deleteForm(page) {

	if (!confirm("Are you sure?!!!")) {
		return
	}

	startLoader("");

	for (var field in page.Form) {
		if (page.Form[field] == ""){
			delete page.Form[field]
		}
	}

	var Alert = [];
	m.request({ method: 'POST', url: page.Url+"/delete", data: page.Form, }).then(function(response) {
		checkRedirect(response);

		var alertType = 'bg-green';
		if (response.Code !== 200) { alertType = 'bg-red'; }
		else {
			if (response.Body !== null && response.Body !== undefined ){
				page.searchForm();
			}
		}

		if (response.Message !== null && response.Message !== undefined && response.Message !== "" ){
			Alert.push({ type: alertType, message: response.Message });
		}

		if (response.Error !== null && response.Error !== undefined && response.Error !== "" ){
			Alert.push({ type: 'bg-red', message: response.Error });
		}

		if(Alert.length > 0) {
			appAlert(Alert);
		}
		stopLoader();
	}).catch(function(error) {
		appAlert([{ type: 'bg-red', message: "Network Connectivity Error \n Please Check Your Network Access", }]);
		stopLoader();
	});
}


function resetFields(page) {
	for (var objectField of page.formFields) {
		page.Form.fieldID = "";
		var element = document.getElementById(objectField.fieldID);
		switch (element.tagName) {
			case "SELECT":
				element.selectedIndex = 0;
				break;
			case "IMG":
				if (element.src.substring(0, 5) == "data:") {
					defaultImage(element.id);
				}
				break;
			default:
				element.value = "";
				break;
		}
	}
}

export function switchPageMode(page, mode) {
	startLoader();

	if (mode !== "search"){ location.hash = "" }
	page.Mode = mode; page.formView = ""; page.viewMode = ""; page.editMode = ""; page.searchView = "";

	for (var field in page.Form) {
		if ((mode == "edit" || mode == "view") && field == "ID") { continue; }
		page.Form[field] = "";
	}


	switch (mode) {
		case "edit": case "view":
		getData(page);
		case "new": page.searchView = "dn"; break;
	}

	switch (mode) {
	case "new":
	case "edit":
		page.viewMode = "dn";
		page.formButton = m(pageFormButton,{title:"SAVE",onclick:page.saveForm})
		break;

	case "view":
		page.editMode = "disabled dn";
		page.formButton = m(pageFormButton,{title:"EDIT",onclick:page.editForm})
		break;

	case "search":
		page.formView = "dn";
		getPageSearchList(page);
		break;
	}
	if (mode !== "search"){ location.hash = "#top" }

	stopLoader();
}
