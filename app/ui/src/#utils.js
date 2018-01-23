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


export var selectOptionsStates = [ m("option",{value:""},"--select--"),
	m("option","Outside Nigeria"),m("option","ABUJA"),m("option","ABIA"),m("option","ADAMAWA"),m("option","AKWA IBOM"),
	m("option","ANAMBRA"),m("option","BAUCHI"),m("option","BAYELSA"),m("option","BENUE"),m("option","BORNO"),m("option","CROSS RIVER"),
	m("option","DELTA"),m("option","EBONYI"),m("option","EDO"),m("option","EKITI"),m("option","ENUGU"),m("option","GOMBE"),m("option","IMO"),
	m("option","JIGAWA"),m("option","KADUNA"),m("option","KANO"),m("option","KATSINA"),m("option","KEBBI"),m("option","KOGI"),m("option","KWARA"),
	m("option","LAGOS"),m("option","NASSARAWA"),m("option","NIGER"),m("option","OGUN"),m("option","ONDO"),m("option","OSUN"),m("option","OYO"),
	m("option","PLATEAU"),m("option","RIVERS"),m("option","SOKOTO"),m("option","TARABA"),m("option","YOBE"),m("option","ZAMFARA"),
]

export var selectOptionsCountry = [ m("option",{value:""},"--select--"),
	m("option","Nigeria"),m("option","Afghanistan"),m("option","Aland Islands"),m("option","Albania"),m("option","Algeria"),m("option","American Samoa"),
	m("option","Andorra"),m("option","Angola"),m("option","Anguilla"),m("option","Antarctica"),m("option","Antigua and Barbuda"),m("option","Argentina"),m("option","Armenia"),m("option","Aruba"),
	m("option","Australia"),m("option","Austria"),m("option","Azerbaijan"),m("option","Bahamas"),m("option","Bahrain"),m("option","Bangladesh"),m("option","Barbados"),
	m("option","Belarus"),m("option","Belgium"),m("option","Belize"),m("option","Benin"),m("option","Bermuda"),m("option","Bhutan"),m("option","Bolivia, Plurinational State of"),
	m("option","Bonaire"),m("option","Bosnia and Herzegovina"),m("option","Botswana"),m("option","Bouvet Island"),m("option","Brazil"),
	m("option","British Indian Ocean Territory"),m("option","Brunei Darussalam"),m("option","Bulgaria"),m("option","Burkina Faso"),m("option","Burundi"),
	m("option","Cambodia"),m("option","Cameroon"),m("option","Canada"),m("option","Cape Verde"),m("option","Cayman Islands"),m("option","Central African Republic"),
	m("option","Chad"),m("option","Chile"),m("option","China"),m("option","Christmas Island"),m("option","Cocos (Keeling) Islands"),m("option","Colombia"),m("option","Comoros"),
	m("option","Congo"),m("option","Congo, DRC"),m("option","Cook Islands"),m("option","Costa Rica"),m("option","Côte d'Ivoire"),
	m("option","Croatia"),m("option","Cuba"),m("option","Curaçao"),m("option","Cyprus"),m("option","Czech Republic"),m("option","Denmark"),m("option","Djibouti"),m("option","Dominica"),
	m("option","Dominican Republic"),m("option","Ecuador"),m("option","Egypt"),m("option","El Salvador"),m("option","Equatorial Guinea"),m("option","Eritrea"),m("option","Estonia"),
	m("option","Ethiopia"),m("option","Falkland Islands (Malvinas)"),m("option","Faroe Islands"),m("option","Fiji"),m("option","Finland"),m("option","France"),m("option","French Guiana"),
	m("option","French Polynesia"),m("option","French Southern Territories"),m("option","Gabon"),m("option","Gambia"),m("option","Georgia"),m("option","Germany"),m("option","Ghana"),
	m("option","Gibraltar"),m("option","Greece"),m("option","Greenland"),m("option","Grenada"),m("option","Guadeloupe"),m("option","Guam"),m("option","Guatemala"),
	m("option","Guernsey"),m("option","Guinea"),m("option","Guinea-Bissau"),m("option","Guyana"),m("option","Haiti"),m("option","Heard Island and McDonald Islands"),m("option","Holy See (Vatican City State)"),
	m("option","Honduras"),m("option","Hong Kong"),m("option","Hungary"),m("option","Iceland"),m("option","India"),m("option","Indonesia"),m("option","Iran"),
	m("option","Iraq"),m("option","Ireland"),m("option","Isle of Man"),m("option","Israel"),m("option","Italy"),m("option","Jamaica"),m("option","Japan"),m("option","Jersey"),m("option","Jordan"),
	m("option","Kazakhstan"),m("option","Kenya"),m("option","Kiribati"), m("option","Korea, (South)"),m("option","Korea, (North)"),
	m("option","Kuwait"),m("option","Kyrgyzstan"),m("option","Lao People's Democratic Republic"),m("option","Latvia"),m("option","Lebanon"),m("option","Lesotho"),
	m("option","Liberia"),m("option","Libya"),m("option","Liechtenstein"),m("option","Lithuania"),m("option","Luxembourg"),m("option","Macao"),
	m("option","Macedonia"),m("option","Madagascar"),m("option","Malawi"),m("option","Malaysia"),m("option","Maldives"),
	m("option","Mali"),m("option","Malta"),m("option","Marshall Islands"),m("option","Martinique"),m("option","Mauritania"),m("option","Mauritius"),
	m("option","Mayotte"),m("option","Mexico"),m("option","Micronesia, Federated States of"),m("option","Moldova, Republic of"),m("option","Monaco"),m("option","Mongolia"),
	m("option","Montenegro"),m("option","Montserrat"),m("option","Morocco"),m("option","Mozambique"),m("option","Myanmar"),m("option","Namibia"),m("option","Nauru"),m("option","Nepal"),m("option","Netherlands"),
	m("option","New Caledonia"),m("option","New Zealand"),m("option","Nicaragua"),m("option","Niger"),m("option","Niue"),m("option","Norfolk Island"),m("option","Northern Mariana Islands"),
	m("option","Norway"),m("option","Oman"),m("option","Pakistan"),m("option","Palau"),m("option","Palestinian Territory, Occupied"),m("option","Panama"),m("option","Papua New Guinea"),
	m("option","Paraguay"),m("option","Peru"),m("option","Philippines"),m("option","Pitcairn"),m("option","Poland"),m("option","Portugal"),m("option","Puerto Rico"),m("option","Qatar"),m("option","Réunion"),
	m("option","Romania"),m("option","Russian Federation"),m("option","Rwanda"),m("option","Saint Barthélemy"),
	m("option","Saint Kitts and Nevis"),m("option","Saint Lucia"),m("option","Saint Martin (French part)"),m("option","Saint Pierre and Miquelon"),
	m("option","Saint Vincent and the Grenadines"),m("option","Samoa"),m("option","San Marino"),m("option","Sao Tome and Principe"),m("option","Saudi Arabia"),
	m("option","Senegal"),m("option","Serbia"),m("option","Seychelles"),m("option","Sierra Leone"),m("option","Singapore"),m("option","Sint Maarten (Dutch part)"),m("option","Slovakia"),
	m("option","Slovenia"),m("option","Solomon Islands"),m("option","Somalia"),m("option","South Africa"),
	m("option","South Sudan"),m("option","Spain"),m("option","Sri Lanka"),m("option","Sudan"),m("option","Suriname"),m("option","Svalbard and Jan Mayen"),m("option","Swaziland"),m("option","Sweden"),
	m("option","Switzerland"),m("option","Syrian Arab Republic"),m("option","Taiwan, Province of China"),m("option","Tajikistan"),
	m("option","Tanzania, United Republic of"),m("option","Thailand"),m("option","Timor-Leste"),m("option","Togo"),m("option","Tokelau"),m("option","Tonga"),
	m("option","Trinidad and Tobago"),m("option","Tunisia"),m("option","Turkey"),m("option","Turkmenistan"),m("option","Turks and Caicos Islands"),m("option","Tuvalu"),
	m("option","Uganda"),m("option","Ukraine"),m("option","United Arab Emirates"),m("option","United Kingdom"),m("option","United States"),m("option","United States Minor Outlying Islands"),
	m("option","Uruguay"),m("option","Uzbekistan"),m("option","Vanuatu"),m("option","Venezuela, Bolivarian Republic of"),m("option","Viet Nam"),m("option","Virgin Islands, British"),
	m("option","Virgin Islands, U.S."),m("option","Wallis and Futuna"),m("option","Western Sahara"),m("option","Yemen"),m("option","Zambia"),m("option","Zimbabwe"),
]
