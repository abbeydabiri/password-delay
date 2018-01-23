var m = require("mithril")
import {appAlert} from './#utils.js';
import {resetFields} from './#utils.js';

export function validateSubmit(postUrl, actionFields) {

	var actionObject = { Form: {}, Alert: [] }
	for (var objectField of actionFields) {
		var error = false;

		if (document.getElementById(objectField.fieldID) == null) {
			actionObject.Alert.push({ type: 'bg-black', message: "html element with ID " +objectField.fieldID + " is missing", });
		} else {

			switch (objectField.fieldID) {
				case "username":
					var username = document.getElementById(objectField.fieldID).value
					document.getElementById(objectField.fieldID).value = username.replace(/\s/g, "")
					break;
			}

			actionObject.Form[objectField.fieldID] = document.getElementById(objectField.fieldID).value.trim();

			switch(objectField.validationType) {
				default: if(actionObject.Form[objectField.fieldID].trim() == "") {error = true;}  break;
				case "sentence": if(!actionObject.Form[objectField.fieldID].match(/^\s*\S+(?:\s+\S+){2,}\s*$/)) {error = true;} break;
				case "email": if(!actionObject.Form[objectField.fieldID].match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {error = true;} break;
			}

			switch (objectField.fieldID) {
				case "confirmpassword":
					if(!error && actionObject.Form.password !== actionObject.Form.confirmpassword ) {
						actionObject.Alert.push({ type: 'bg-red', message: "Password and Confirm Password do not Match", });
					}
					break;
			}

			if(error) {
				var errorMessage = objectField.fieldID.charAt(0).toUpperCase() + objectField.fieldID.slice(1)+" Field is Required";
				if (document.getElementById(objectField.fieldID).hasAttribute("error")) {
					errorMessage = document.getElementById(objectField.fieldID).getAttribute("error")
				}
				actionObject.Alert.push({ type: 'bg-red', message: errorMessage, });
			}
		}
	}

	if (actionObject.Alert.length === 0) {
		startLoader();
		m.request({ method: 'POST', url: postUrl, data: actionObject.Form, }).then(function(response) {
			var lStoploader = true;
			var alertType = 'bg-green';
			if (response.Code !== 200) {
				alertType = 'bg-red';
			} else {

				for (var objectField of actionFields) {
					var element = document.getElementById(objectField.fieldID);
					if(element.tagName === 'SELECT') {
						element.selectedIndex = 0;
					} else {
						element.value = "";
					}
				}

				if (response.Body !== null) {
					if (response.Body.Redirect !== null &&  response.Body.Redirect !== "") {
						window.location.href = response.Body.Redirect + "?" + new Date().getTime();
						lStoploader = false;
					}
				}
			}
			actionObject.Alert.push({ type: alertType, message: response.Message });
			appAlert(actionObject.Alert);

			if(lStoploader) {
				stopLoader();
			}

		}).catch(function(error) {
			actionObject.Alert.push({ type: 'bg-red', message: error });
			appAlert(actionObject.Alert);
			stopLoader();
		});
	}

	if (actionObject.Alert.length != 0) {
		appAlert(actionObject.Alert)
		return false;
	} else {
		return true;
	}
}
