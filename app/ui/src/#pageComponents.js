var m = require("mithril");
import Icons from './#icons.js';

export var pageTitle = {view: function(vnode) {return( m("div", {class:"loginBG pa2 b tracked ttu f6 near-white"}, vnode.children ))}}

export var pageMenu = {view: function(vnode) { return(
	m("a", {class:"v-mid ttu link flex-ns fl pa3 items-center dark-gray hover-bg-gray", href:vnode.attrs.href}, vnode.children)
)}}


export var pageFormButton = {view: function(vnode) {return(
	<div class="fr tr w-100 mv0">
		<a onclick={vnode.attrs.onclick} href="#top"
			class="link pa2 loginBG near-white dim f6 br1">
			{vnode.attrs.title}
		</a>
	</div>
)}}



export var pageSearchForm = {view: function(vnode) {return(
	<p class="cf f6 ph2 pv2">
		<input type="text" class="fl pa2 mb2 w-100 mr2-ns w-auto-ns dib ba b--silver" id="searchText" onkeyup={vnode.attrs.searchForm} placeholder="Search" />
		<span class="fl dib">
			<select class="bn mt2 ba0 bg-light-gray" id="searchField" onchange={vnode.attrs.searchForm}>
				<option value="">*by field*</option>
				{vnode.attrs.searchFields}
			</select>
		 </span>

		<span class={vnode.attrs.classNewButton}>
			<span class="pointer mv2 pa1 fl-l fr dib loginBG near-white dim f6 br1" onclick={vnode.attrs.newForm}>
				+NEW
			</span>
		</span>
	</p>
)}}


export var pageSearchList = {view: function(vnode) {return(
	<div class="fl pa2 pb4 w-100">
		<div class="overflow-auto">
			<table class="f6 w-100" cellspacing="0">
				<thead class="">
					<tr class="loginBG near-white">
						<th class="fw6 tl pa2 w-100 br2 br--top">
							Search Results

							<Icons name="pencil" class="h1 pl2 fr"/>
						</th>
					</tr>
				</thead>
				<tbody class="">
					{vnode.attrs.searchList}
				</tbody>
			</table>
		</div>
	</div>
)}}



export var getPageSearchListItem = {view: function(vnode) {return(
	<tr class="stripe-dark">
		<td class="pa2 pr0">
			<span class="hover-green pointer" onclick={vnode.attrs.View}>
				<b>{vnode.attrs.POS}</b> - {vnode.attrs.Details}
			</span>

			<small style="font-size:60%" class="fr pointer hover-orange truncate" onclick={vnode.attrs.Edit}>
				{vnode.attrs.Date}
			</small>
		</td>
	</tr>
)}}
