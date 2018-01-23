var m = require("mithril");

function pageFormValidateImage(idName) {
	var lValid = false;
	var imageSrc =	document.getElementById(idName).src;
	if (imageSrc.indexOf("image/jpeg;base64") == 5) { lValid = true }
	if (imageSrc.indexOf("image/png;base64") == 5) { lValid = true }
	if (imageSrc.indexOf("image/gif;base64") == 5) { lValid = true }
	return lValid;
}

export function pageFormValidate(formFields) {

	var formObject = { Form: {}, Alert: [] }
	for (var objectField of formFields) {
		var error = false;

		if (document.getElementById(objectField.fieldID) == null) {
			formObject.Alert.push({ type: 'bg-black', message: "html element with ID " +objectField.fieldID + " is missing", });
		} else {

			switch (objectField.fieldID) {
				case "username":
					var username = document.getElementById(objectField.fieldID).value
					document.getElementById(objectField.fieldID).value = username.replace(/\s/g, "")
					break;
			}

			if (document.getElementById(objectField.fieldID).value !== undefined) {
				formObject.Form[objectField.fieldID] = document.getElementById(objectField.fieldID).value.trim();
			} else {
				formObject.Form[objectField.fieldID] = "";
			}

			switch(objectField.validationType) {
				default: if(formObject.Form[objectField.fieldID].trim() == "") {error = true;}  break;
				case "silentIfNull": break;
				case "sentence": if(!formObject.Form[objectField.fieldID].match(/^\s*\S+(?:\s+\S+){2,}\s*$/)) {error = true;} break;
				case "email": if(!formObject.Form[objectField.fieldID].match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {error = true;} break;
				case "imageOptional":
				case "imageRequired":
					if (pageFormValidateImage(objectField.fieldID)) {
						formObject.Form[objectField.fieldID] = document.getElementById(objectField.fieldID).src;
					}
				break;
					if (pageFormValidateImage(objectField.fieldID)) {
						formObject.Form[objectField.fieldID] = document.getElementById(objectField.fieldID).src;
					} else { error = true; }
				break;

			}

			switch (objectField.fieldID) {
				case "confirmpassword":
					if(!error && formObject.Form.password !== formObject.Form.confirmpassword ) {
						formObject.Alert.push({ type: 'bg-red', message: "Password and Confirm Password do not Match", });
					}
					break;
			}

			if(error) {
				var errorMessage = objectField.fieldID.charAt(0).toUpperCase() + objectField.fieldID.slice(1)+" is Required";
				if (document.getElementById(objectField.fieldID).hasAttribute("error")) {
					errorMessage = document.getElementById(objectField.fieldID).getAttribute("error")
				}
				formObject.Alert.push({ type: 'bg-red', message: errorMessage, });
			}
		}
	}

	return formObject;
}
