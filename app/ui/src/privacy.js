import m from 'mithril';
import {menu} from './#menu.js';

var page = {
	oninit:function(){ m.render(document.getElementById('appMenu'), m(menu,{color:"dark-red"})); },
	view:function(){
	return (
		<section>

			<article class="dt w-100 deepspaceGradient" style="min-height:180px">
				<div class="dtc v-mid tc white ph3 ph4-l">
					<h1 class="f2 f1-l fw6 tc">Privacy Policy</h1>
				</div>
			</article>

			<section class="mw9-ns">
				<div class="w-90 cf center">
					<article class="avenir pa4-ns pa2 bg-white tracked black-80">

						<p class="mh3 pt3 f6">
							<b>OUR COMMITMENT TO PRIVACY</b> <br/>
							Essential Software Company, Limited, (“Essential Software Company”) is a premier provider of easy-to-use social engineering testing software to companies, audit firms, and consultants. As such, information security and your privacy are important to us. To better protect your privacy we provide this notice explaining our online information practices and the choices you can make about the way your information is collected and used. By accessing this site, you are consenting to the information collection and use practices described in this policy.
						</p>

						<p class="mh3 pt3 f6">
							<b>WHAT INFORMATION WE COLLECT</b> <br/>
							We collect two types of information – Personally Identifiable Information and Anonymous Information. The different categories of information are detailed below. Personally Identifiable Information Collected - The types of personal information collected, include, but are not limited to, the following: Name, Email Address, Company, Phone number, Product/Service Interest. In addition, users may be offered the opportunity to respond to surveys, questionnaires and other requests for information. The types of data that users provide to us is set out in the survey request.
						</p>

						<p class="mh3 pt3 f6">
							<b>ANONYMOUS INFORMATION COLLECTED</b> <br/>
							We collect certain anonymous information about your visit, including, but not limited to, the name of the Internet service provider and the Internet Protocol (IP) address through which you access the Internet; the date and time you access this site; the pages that you access while at this site and the Internet address of the website from which you linked to our site.
						</p>

						<p class="mh3 pt3 f6">
							In addition, this website uses online marketing tools that may gather non-identifying information via cookies or other means. A cookie is a small amount of identifier data that is sent to your browser from a web server and stored on your computer’s hard drive. By using cookies, information is potentially collected without your express knowledge. Most browsers are initially set to accept cookies but you can change the setting to refuse cookies or to be alerted when cookies are being sent. While refusal to accept cookies should not affect the use of this site, some portions of this site may not function properly without cookies.
						</p>

						<p class="mh3 pt3 f6">
							We also use cookies for ad serving through third-party advertisers, such as Google, that place a cookie on your computer. When you are browsing the Internet and visit other sites, this cookie is used to serve ads specific to you and your interests. The ads served will be targeted based on your previous browsing history. You can opt out of Google’s use of cookies by visiting Google’s Ads Settings.
						</p>


						<p class="mh3 pt3 f6">
							<b>HOW WE USE THE INFORMATION WE COLLECT</b> <br/>
							The personal information collected on this site is used only to provide the service(s) or carry out the transaction(s) you have requested or authorized. We use the anonymous information collected through this site to improve our marketing and promotional efforts.
						</p>

						<p class="mh3 pt3 f6">
							We do not sell or share personally identifiable information with third parties. However, we reserve the right to disclose your personally identifiable information as required by law and when we believe that disclosure is necessary to protect our rights and/or to comply with a judicial proceeding, court order, or other legal process.
						</p>

						<p class="mh3 pt3 f6">
							<b>OTHER SOURCES OF INFORMATION</b> <br/>
							This policy only addresses the use and disclosure of information we collect online through this site, not information that we collect through other sources.
						</p>

						<p class="mh3 pt3 f6">
							<b>INFORMATION SECURITY</b> <br/>
							We follow generally accepted industry standards to protect the personal information submitted to us, both during transmission and once we receive it. However, no method of transmission over the Internet, or method of electronic storage, is one hundred percent secure. Therefore, while we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
						</p>

						<p class="mh3 pt3 f6">
							<b>LINKS TO OTHER SITES</b> <br/>
							This web site may contain links to other sites that are not owned or controlled by us. Please be aware that we are not responsible for the privacy practices of such sites.
						</p>


						<p class="mh3 pt3 f6">
							<b>OPT OUT</b> <br/>
							If you no longer wish to receive our newsletter or promotional communications, you may opt-out of receiving them by following the instructions included in each newsletter or promotional communication. Optionally, you may contact us directly. Furthermore, users may opt out of Google’s use of cookies by visiting the Google advertising opt-out page.
						</p>


						<p class="mh3 pt3 f6">
							<b>CONTACTING US ABOUT YOUR INFORMATION</b> <br/>
							If you have any questions, complaints, or would like to verify the accuracy and completeness of your personal information that we may have collected via this site, please contact us at support@essentials.ng
						</p>


						<p class="mh3 pt3 f6">
							<b>CHANGES TO THIS PRIVACY STATEMENT</b> <br/>
							Please note that this policy may change from time to time. We will post any changes to our policy on this site. If the changes are significant, we will provide a more prominent notice, such as an email notification of the changes.
						</p>

						<p class="mh3 pt3 f6">
							<i>Revision: January 23, 2018</i>
						</p>

					</article>
				</div>
			</section>
		</section>
	)
  }
}

export default page;
