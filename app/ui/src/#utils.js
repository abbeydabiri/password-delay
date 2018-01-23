var m = require("mithril")


export function splitMille(n, separator = ',') {
  // Cast to string
  let num = (n + '')

  if( num == ''){return n}
  if( num == 'undefined'){return n}

  // Test for and get any decimals (the later operations won't support them)
  let decimals = ''
  if (/\./.test(num)) {
    // This regex grabs the decimal point as well as the decimal numbers
    decimals = num.replace(/^.*(\..*)$/, '$1')
  }


  // Remove decimals from the number string
  num = num.replace(decimals, '')
    // Reverse the number string through Array functions
    .split('').reverse().join('')
    // Split into groups of 1-3 characters (with optional supported character "-" for negative numbers)
    .match(/[0-9]{1,3}-?/g)
    // Add in the mille separator character and reverse back
    .join(separator).split('').reverse().join('')

     switch(decimals.length) {
		case 2:
			decimals += "0";
			break;
		case 0:
			decimals = ".00";
			break;
    }

  // Put the decimals back and output the formatted number
  return `${num}${decimals}`
}

export function formCheckError(formObject, fieldList) {
	var alert = [];
	var error = false
	for (var fieldName in fieldList) {
		if (formObject[fieldName] == "" || formObject[fieldName] == undefined){
			var errorMsg = fieldName + " Is Required"
			if(fieldList[fieldName] !== ""){errorMsg = fieldList[fieldName]}
			alert.push({ type: 'bg-black', message: errorMsg, });
		} else {
			switch(fieldName) {
				case 'Email':
					if(!formObject[fieldName].match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
						alert.push({ type: 'bg-black', message: "Email is Invalid", })
					}
					break;

				case 'Phone', 'PhoneNumber':
					if( formObject[fieldName].length < 11){
						alert.push({ type: 'bg-black', message: "Phone Number is Incomplete", });
					} else if( formObject[fieldName].length > 11){
            alert.push({ type: 'bg-black', message: "Phone Number must be 11 digits", });
          }
					break;

				case 'MeterNumber':
					if( formObject[fieldName].length < 10){
						alert.push({ type: 'bg-black', message: "Meter Number is Incomplete", });
					}
					break;
			}
		}
	}
	if(alert.length > 0){ appAlert(alert); error = true}
	return error
}

export function defaultImage(idName) {
	document.getElementById(idName).src = "../..//assets/img/default.jpg";
}

export function displayImage(e, page, field) {
	var reader = new FileReader();
	var selectedFile = e.target.files[0]; e.target.value = '';
	reader.readAsDataURL(selectedFile);
	reader.onload = function () {
		if(selectedFile.size > 2000000){
			appAlert([{ type: 'bg-red', message: "Image File must be less than 2MB", }]);
		} else {
			switch(selectedFile.type){
				case "image/gif":
				case "image/png":
				case "image/jpg":
				case "image/jpeg":
					page.Form[field] = reader.result;
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

export function checkRedirect(response) {
	if (response.Body !== null) {
		if (response.Body.Redirect !== null && response.Body.Redirect !== undefined && response.Body.Redirect !== "") {
			window.location.href = response.Body.Redirect + "?" + new Date().getTime();
		}
	}
}


function appAlertFadeOut() {
    var element = document.getElementById('appAlert');
    element.style.opacity -= 0.1;
    if(element.style.opacity < 0.0) {
        element.style.opacity = 0.0;
        document.getElementById('appAlert').innerHTML = "";
    } else {
        setTimeout(appAlertFadeOut, 25);
    }
}

export function appAlert(Alert) {
	location.hash = ""
	if (Alert !== null && Alert !== undefined && Alert.length !== 0) {
		var alertReturn = [];
		for (var msg of Alert) {
      alertReturn.push(m("div", {class: "w-100 ma0 pa1 x"+msg["type"]}, msg["message"]),);
		}

		var alertComponent = { view: function() { return (
      <article class="pa3 right-0 absolute z-max" onclick={()=>appAlert()}>
				<div class="f6 dark-red">
					<div class="ph2 alertPrimary br2" style="animation-duration:5s">
						<pre class="avenir ">{alertReturn}</pre>
					</div>
				</div>
			</article>
		)}}
		document.getElementById('appAlert').style.opacity = 1;
		m.render(document.getElementById('appAlert'), m(alertComponent))
		setTimeout(appAlertFadeOut, 10000);
		location.hash = "#top" ;
	} else {
		m.render(document.getElementById('appAlert'), m("i", {class: "dn"}, ""))
	}
}

export function logVisitor() {
	m.request({method:'GET', url: "https://icanhazip.com/",
	deserialize: function(value) {return value}}).then(function(response){

    var formData = {
      ID:0, CampaignID:0,
      Url: location.href, Code: response,
      Title: response +" VISITED "+location.href,
      UserAgent:navigator.userAgent,
      IPAddress:response, Description:"",
      Workflow:"PAGE VISIT",
    };

		m.request({ method: 'POST', url: '/api/visitor', data: formData,}).then(
      function(response){formData.ID = response.Body}
    );
  });
}

export var appMenu = {
	Toggle: function(appMenuID) {
		var appMenuDiv = document.getElementById(appMenuID);
		appMenuDiv.classList.toggle('dn');
		appMenuDiv.classList.toggle('animated');
		appMenuDiv.classList.toggle('bounceInDown');
	},
};


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
