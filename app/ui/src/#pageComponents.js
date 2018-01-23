var m = require("mithril");
import Icons from './#icons.js';

export var pageTitle = {view: function(vnode) {return( m("div", {class:"bg-gray pa2 b tracked ttu f6 f4-nsnear-white"}, vnode.children ))}}

export var pageMenu = {view: function(vnode) { return(
	m("a", {class:"v-mid ttu link flex-ns fl pa3 items-center dark-gray hover-bg-gray", href:vnode.attrs.href}, vnode.children)
)}}


export var pageFormButton = {view: function(vnode) {return(
	<div class="fl pa2 w-50 dt">
		<a onclick={vnode.attrs.onclick} href="#top"
			class="link pa2 bg-dark-gray near-white dim f6 br1">
			{vnode.attrs.title}
		</a>
	</div>
)}}



export var pageSearchForm = {view: function(vnode) {return(
	<p class="cf f6 ph2 pv2">
		<input type="text" class="fl pa2 mb2 w-100 w-auto-ns dib ba b--silver" id="searchText" onkeyup={vnode.attrs.searchForm} placeholder="Search" />
		<span class="fl pa1 mv1">
			By:
			<select class="ml2" id="searchField" onchange={vnode.attrs.searchForm}>
				{vnode.attrs.searchFields}
			</select>
		 </span>

		<span class={vnode.attrs.classNewButton}>
		<span class="pointer mv2 pa1 fl-l fr dib bg-dark-gray near-white dim f6 br1" onclick={vnode.attrs.newForm}>
			+NEW
		</span>
		</span>
	</p>
)}}


export var pageSearchList = {view: function(vnode) {return(
	<div class="fl pa2 pb4 w-100">
		<div class="overflow-auto">
			<table class="f6" cellspacing="0">
				<thead class="">
					<tr class="bg-dark-gray near-white">
						<th class="fw6 tl pa2 w-100">Search Results</th>

						<th class="fw6 tr pa2 " style="min-width:130px">Modified</th>
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
			<b>{vnode.attrs.POS}</b> - {vnode.attrs.Details}
		</td>


		<td class="pv2 dt tr">
			<small> {vnode.attrs.Date} </small>
			<div class="w-100 cf tc">
				<Icons name="eye" class="fl h1 pointer dark-green dim" onclick={vnode.attrs.View}/>
				<Icons name="pencil" class=" h1 pointer orange dim" onclick={vnode.attrs.Edit}/>
				<Icons name="trash" class="fr h1 pointer dark-red dim" onclick={vnode.attrs.Delete}/>
			</div>
		</td>
	</tr>
)}}

/*OLD SEARCH RESULTS LOGIC BELOW*/

export var pageSearchListOLD = {view: function(vnode) {return(
	<div class="fl w-100">
		{vnode.attrs.searchList}
	</div>
)}}

export var getPageSearchListItemOLD = {view: function(vnode) {return(
	<article class="w-100 w-50-m w-25-l dib ph2 pv1 pointer" onclick={vnode.attrs.View}>
      <div class="w-100 bg-white">
	      <div class="v-mid pa1 pl2">
	        <h1 class="truncate f6 f5-ns fw6 mid-gray mv0">{vnode.attrs.Details} </h1>
	      </div>
	      <div class="tc pa0 pl2 bg-gray">
	      	<small class="near-white" style="font-size:10px">#{vnode.attrs.ID} - {vnode.attrs.Date}</small>
	      </div>
      </div>
    </article>
)}}
