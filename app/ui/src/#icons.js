var m = require("mithril");

//Icons used come from https://useiconic.com/open#icons

var Icons = {
  view:function(vnode){
    switch(vnode.attrs.name){
      case "dashboard":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M4 0c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 1c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 1c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm-1.66 1a.5.5 0 0 0-.19.84l.91.91c-.02.08-.06.16-.06.25 0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1c-.09 0-.17.04-.25.06l-.91-.91a.5.5 0 0 0-.44-.16.5.5 0 0 0-.06 0zm3.16 0c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z" />
        </svg>);

      case "logout":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M3 0v1h4v5h-4v1h5v-7h-5zm-1 2l-2 1.5 2 1.5v-1h4v-1h-4v-1z" />
        </svg>);

      case "caret-right":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M0 0v8l4-4-4-4z" transform="translate(2)" />
        </svg>);

      case "cog":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M3.5 0l-.5 1.19c-.1.03-.19.08-.28.13l-1.19-.5-.72.72.5 1.19c-.05.1-.09.18-.13.28l-1.19.5v1l1.19.5c.04.1.08.18.13.28l-.5 1.19.72.72 1.19-.5c.09.04.18.09.28.13l.5 1.19h1l.5-1.19c.09-.04.19-.08.28-.13l1.19.5.72-.72-.5-1.19c.04-.09.09-.19.13-.28l1.19-.5v-1l-1.19-.5c-.03-.09-.08-.19-.13-.28l.5-1.19-.72-.72-1.19.5c-.09-.04-.19-.09-.28-.13l-.5-1.19h-1zm.5 2.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"
          />
        </svg>);

      case "person":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M4 0c-1.1 0-2 1.12-2 2.5s.9 2.5 2 2.5 2-1.12 2-2.5-.9-2.5-2-2.5zm-2.09 5c-1.06.05-1.91.92-1.91 2v1h8v-1c0-1.08-.84-1.95-1.91-2-.54.61-1.28 1-2.09 1-.81 0-1.55-.39-2.09-1z" />
        </svg>);

      case "briefcase":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M3 0c-.55 0-1 .45-1 1v1h-1.91c-.06 0-.09.04-.09.09v2.41c0 .28.22.5.5.5h7c.28 0 .5-.22.5-.5v-2.41c0-.06-.04-.09-.09-.09h-1.91v-1c0-.55-.45-1-1-1h-2zm0 1h2v1h-2v-1zm-3 4.91v2c0 .05.04.09.09.09h7.81c.05 0 .09-.04.09-.09v-2c-.16.06-.32.09-.5.09h-7c-.18 0-.34-.04-.5-.09z"
          />
        </svg>);

      case "file":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M0 0v8h7v-4h-4v-4h-3zm4 0v3h3l-3-3z" />
        </svg>);

      case "inbox":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M.19 0c-.11 0-.19.08-.19.19v7.63c0 .11.08.19.19.19h7.63c.11 0 .19-.08.19-.19v-7.63c0-.11-.08-.19-.19-.19h-7.63zm.81 2h6v3h-1l-1 1h-2l-1-1h-1v-3z" />
        </svg>);

      case "pencil":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M6 0l-1 1 2 2 1-1-2-2zm-2 2l-4 4v2h2l4-4-2-2z" />
        </svg>);

      case "task":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M0 0v7h7v-3.59l-1 1v1.59h-5v-5h3.59l1-1h-5.59zm7 0l-3 3-1-1-1 1 2 2 4-4-1-1z" />
        </svg>);

      case "plus":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M3 0v3h-3v2h3v3h2v-3h3v-2h-3v-3h-2z" />
        </svg>);

     case "envelope-open":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M4 0l-4 2v6h8v-6l-4-2zm0 1.13l3 1.5v1.88l-3 1.5-3-1.5v-1.88l3-1.5zm-2 1.88v1l2 1 2-1v-1h-4z" />
        </svg>);

      case "envelope-closed":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M0 0v1l4 2 4-2v-1h-8zm0 2v4h8v-4l-4 2-4-2z" transform="translate(0 1)" />
        </svg>);

      case "data-transfer-upload":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M0 0v1h8v-1h-8zm4 2l-3 3h2v3h2v-3h2l-3-3z" />
        </svg>);

       case "graph":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M7.03 0l-3.03 3-1-1-3 3.03 1 1 2-2.03 1 1 4-4-.97-1zm-7.03 7v1h8v-1h-8z" />
        </svg>);

     case "bullhorn":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M6 0v6c.03.01.07 0 .09 0h.81c.05 0 .09-.04.09-.09v-5.81c0-.06-.04-.09-.09-.09h-.91zm-1 .5l-2.91 1.47c-.05.02-.13.03-.19.03h-1.81c-.06 0-.09.04-.09.09v1.81c0 .06.04.09.09.09h.91l1.03 2.72c.11.25.44.36.69.25.25-.11.36-.44.25-.69l-.75-1.78c.03-.14.13-.22.28-.22v-.03l2.5 1.25v-5z"/>
        </svg>);

      case "bar-chart":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
        <path d="M0 0v7h8v-1h-7v-6h-1zm5 0v5h2v-5h-2zm-3 2v3h2v-3h-2z" />
        </svg>);

      case "users":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
        <path d="M5.5 0c-.51 0-.95.35-1.22.88.45.54.72 1.28.72 2.13 0 .29-.03.55-.09.81.19.11.38.19.59.19.83 0 1.5-.9 1.5-2s-.67-2-1.5-2zm-3 1c-.83 0-1.5.9-1.5 2s.67 2 1.5 2 1.5-.9 1.5-2-.67-2-1.5-2zm4.75 3.16c-.43.51-1.02.82-1.69.84.27.38.44.84.44 1.34v.66h2v-1.66c0-.52-.31-.97-.75-1.19zm-6.5 1c-.44.22-.75.67-.75 1.19v1.66h5v-1.66c0-.52-.31-.97-.75-1.19-.45.53-1.06.84-1.75.84s-1.3-.32-1.75-.84z"/>
        </svg>);

      case "shield":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
        <path d="M4 0l-.19.09-3.5 1.47-.31.13v.31c0 1.66.67 3.12 1.47 4.19.4.53.83.97 1.25 1.28.42.31.83.53 1.28.53.46 0 .86-.22 1.28-.53.42-.31.85-.75 1.25-1.28.8-1.07 1.47-2.53 1.47-4.19v-.31l-.31-.13-3.5-1.47-.19-.09zm0 1.09v5.91c-.04 0-.33-.07-.66-.31s-.71-.63-1.06-1.09c-.64-.85-1.14-2.03-1.22-3.28l2.94-1.22z"/>
        </svg>);

      case "folder":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
        <path d="M0 0v2h8v-1h-5v-1h-3zm0 3v4.5c0 .28.22.5.5.5h7c.28 0 .5-.22.5-.5v-4.5h-8z" />
        </svg>);

      case "graph":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
        <path d="M7.03 0l-3.03 3-1-1-3 3.03 1 1 2-2.03 1 1 4-4-.97-1zm-7.03 7v1h8v-1h-8z" />
        </svg>);

      case "calculator":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M.09 0c-.06 0-.09.04-.09.09v7.81c0 .05.04.09.09.09h6.81c.05 0 .09-.04.09-.09v-7.81c0-.06-.04-.09-.09-.09h-6.81zm.91 1h5v2h-5v-2zm0 3h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v3h-1v-3zm-4 2h1v1h-1v-1zm2 0h1v1h-1v-1z" />
        </svg>);

      case "person":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
        <path d="M4 0c-1.1 0-2 1.12-2 2.5s.9 2.5 2 2.5 2-1.12 2-2.5-.9-2.5-2-2.5zm-2.09 5c-1.06.05-1.91.92-1.91 2v1h8v-1c0-1.08-.84-1.95-1.91-2-.54.61-1.28 1-2.09 1-.81 0-1.55-.39-2.09-1z" />
        </svg>);

      case "book":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
        <path d="M1 0c-.07 0-.13.01-.19.03-.39.08-.7.39-.78.78-.03.06-.03.12-.03.19v5.5c0 .83.67 1.5 1.5 1.5h5.5v-1h-5.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h5.5v-5.5c0-.28-.22-.5-.5-.5h-.5v3l-1-1-1 1v-3h-3z" />
        </svg>);

      case "rss-alt":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
        <path d="M0 0v2c3.33 0 6 2.67 6 6h2c0-4.41-3.59-8-8-8zm0 3v2c1.67 0 3 1.33 3 3h2c0-2.75-2.25-5-5-5zm0 3v2h2c0-1.11-.9-2-2-2z" />
        </svg>);

      case "people":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
        <path d="M5.5 0c-.51 0-.95.35-1.22.88.45.54.72 1.28.72 2.13 0 .29-.03.55-.09.81.19.11.38.19.59.19.83 0 1.5-.9 1.5-2s-.67-2-1.5-2zm-3 1c-.83 0-1.5.9-1.5 2s.67 2 1.5 2 1.5-.9 1.5-2-.67-2-1.5-2zm4.75 3.16c-.43.51-1.02.82-1.69.84.27.38.44.84.44 1.34v.66h2v-1.66c0-.52-.31-.97-.75-1.19zm-6.5 1c-.44.22-.75.67-.75 1.19v1.66h5v-1.66c0-.52-.31-.97-.75-1.19-.45.53-1.06.84-1.75.84s-1.3-.32-1.75-.84z"/>
        </svg>);

      case "clipboard":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
        <path d="M3.5 0c-.28 0-.5.22-.5.5v.5h-.75c-.14 0-.25.11-.25.25v.75h3v-.75c0-.14-.11-.25-.25-.25h-.75v-.5c0-.28-.22-.5-.5-.5zm-3.25 1c-.14 0-.25.11-.25.25v6.5c0 .14.11.25.25.25h6.5c.14 0 .25-.11.25-.25v-6.5c0-.14-.11-.25-.25-.25h-.75v2h-5v-2h-.75z" />
        </svg>);

      case "eye":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M4.03 0c-2.53 0-4.03 3-4.03 3s1.5 3 4.03 3c2.47 0 3.97-3 3.97-3s-1.5-3-3.97-3zm-.03 1c1.11 0 2 .9 2 2 0 1.11-.89 2-2 2-1.1 0-2-.89-2-2 0-1.1.9-2 2-2zm0 1c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1c0-.1-.04-.19-.06-.28-.08.16-.24.28-.44.28-.28 0-.5-.22-.5-.5 0-.2.12-.36.28-.44-.09-.03-.18-.06-.28-.06z" transform="translate(0 1)" />
        </svg>);

      case "layers":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M0 0v4h4v-4h-4zm5 2v3h-3v1h4v-4h-1zm2 2v3h-3v1h4v-4h-1z" />
        </svg>);

      case "menu":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M0 0v1h8v-1h-8zm0 2.97v1h8v-1h-8zm0 3v1h8v-1h-8z" transform="translate(0 1)" />
        </svg>);

      case "x":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M1.41 0l-1.41 1.41.72.72 1.78 1.81-1.78 1.78-.72.69 1.41 1.44.72-.72 1.81-1.81 1.78 1.81.69.72 1.44-1.44-.72-.69-1.81-1.78 1.81-1.81.72-.72-1.44-1.41-.69.72-1.78 1.78-1.81-1.78-.72-.72z" />
        </svg>);

      case "external-link":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M0 0v8h8v-2h-1v1h-6v-6h1v-1h-2zm4 0l1.5 1.5-2.5 2.5 1 1 2.5-2.5 1.5 1.5v-4h-4z" />
        </svg>);

      case "chevron-right":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M1.5 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z" transform="translate(1)" />
        </svg>);

      case "hard-drive":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M.19 0c-.11 0-.19.08-.19.19v3.31c0 .28.22.5.5.5h6c.28 0 .5-.22.5-.5v-3.31c0-.11-.08-.19-.19-.19h-6.63zm-.19 4.91v2.91c0 .11.08.19.19.19h6.63c.11 0 .19-.08.19-.19v-2.91c-.16.06-.32.09-.5.09h-6c-.18 0-.34-.04-.5-.09zm5.5 1.09c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5z"/>
        </svg>);

      case "data-transfer-upload":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M0 0v1h8v-1h-8zm4 2l-3 3h2v3h2v-3h2l-3-3z" />
        </svg>);

      case "lock-locked":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M3 0c-1.1 0-2 .9-2 2v1h-1v4h6v-4h-1v-1c0-1.1-.9-2-2-2zm0 1c.56 0 1 .44 1 1v1h-2v-1c0-.56.44-1 1-1z" />
        </svg>);

      case "credit-card":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M.25 0c-.14 0-.25.11-.25.25v.75h8v-.75c0-.14-.11-.25-.25-.25h-7.5zm-.25 2v3.75c0 .14.11.25.25.25h7.5c.14 0 .25-.11.25-.25v-3.75h-8zm1 2h1v1h-1v-1zm2 0h1v1h-1v-1z" transform="translate(0 1)" />
        </svg>);

      case "magnifying-glass":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M3.5 0c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5c.59 0 1.17-.14 1.66-.41a1 1 0 0 0 .13.13l1 1a1.02 1.02 0 1 0 1.44-1.44l-1-1a1 1 0 0 0-.16-.13c.27-.49.44-1.06.44-1.66 0-1.93-1.57-3.5-3.5-3.5zm0 1c1.39 0 2.5 1.11 2.5 2.5 0 .66-.24 1.27-.66 1.72-.01.01-.02.02-.03.03a1 1 0 0 0-.13.13c-.44.4-1.04.63-1.69.63-1.39 0-2.5-1.11-2.5-2.5s1.11-2.5 2.5-2.5z"/>
        </svg>);

      case "pulse":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M3.25 0l-.47 1.53-.78 2.56-.03-.06-.09-.34h-1.88v1h1.1600000000000001l.38 1.16.47 1.47.47-1.5.78-2.5.78 2.5.41 1.34.53-1.28.59-1.47.13.28h2.31v-1h-1.69l-.38-.75-.5-.97-.41 1.03-.47 1.19-.84-2.66-.47-1.53z" />
        </svg>);

      case "image":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M0 0v8h8v-8h-8zm1 1h6v3l-1-1-1 1 2 2v1h-1l-4-4-1 1v-3z" />
        </svg>);

      case "account-login":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M3 0v1h4v5h-4v1h5v-7h-5zm1 2v1h-4v1h4v1l2-1.5-2-1.5z" />
        </svg>);

      case "aperture":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M4 0c-.69 0-1.34.19-1.91.5l3.22 2.34.75-2.25c-.6-.36-1.31-.59-2.06-.59zm-2.75 1.13c-.76.73-1.25 1.74-1.25 2.88 0 .25.02.48.06.72l3.09-2.22-1.91-1.38zm5.63.13l-1.22 3.75h2.19c.08-.32.16-.65.16-1 0-1.07-.44-2.03-1.13-2.75zm-4.72 3.22l-1.75 1.25c.55 1.13 1.6 1.99 2.88 2.22l-1.13-3.47zm1.56 1.53l.63 1.97c1.33-.12 2.46-.88 3.09-1.97h-3.72z"/>
        </svg>);

      case "medical-cross":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M2 0v2h-2v4h2v2h4v-2h2v-4h-2v-2h-4z" />
        </svg>);

      case "location":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M8 0l-8 4 3 1 1 3 4-8z" />
        </svg>);

      case "video":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M.5 0c-.28 0-.5.23-.5.5v4c0 .28.23.5.5.5h5c.28 0 .5-.22.5-.5v-1.5l1 1h1v-3h-1l-1 1v-1.5c0-.28-.22-.5-.5-.5h-5z" transform="translate(0 1)" />
        </svg>);

      case "camera-slr":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M4.09 0c-.05 0-.1.04-.13.09l-.94 1.81c-.02.05-.07.09-.13.09h-1.41c-.83 0-1.5.67-1.5 1.5v4.41c0 .05.04.09.09.09h7.81c.05 0 .09-.04.09-.09v-5.81c0-.06-.04-.09-.09-.09h-.81c-.05 0-.1-.04-.13-.09l-.94-1.81c-.03-.05-.07-.09-.13-.09h-1.81zm-2.59 3c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5zm3.5 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 1c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
        </svg>);

      case "check":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M6.41 0l-.69.72-2.78 2.78-.81-.78-.72-.72-1.41 1.41.72.72 1.5 1.5.69.72.72-.72 3.5-3.5.72-.72-1.44-1.41z" transform="translate(0 1)" />
        </svg>);

      case "script":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M3 0c-.55 0-1 .45-1 1v5.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-1.5h-1v2c0 .55.45 1 1 1h5c.55 0 1-.45 1-1v-3h-4v-2.5c0-.28.22-.5.5-.5s.5.22.5.5v1.5h4v-2c0-.55-.45-1-1-1h-4z" />
        </svg>);

      case "globe":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M4 0c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 1c.33 0 .64.09.94.19-.21.2-.45.38-.41.56.04.18.69.13.69.5 0 .27-.42.35-.13.66.35.35-.64.98-.66 1.44-.03.83.84.97 1.53.97.42 0 .53.2.5.44-.54.77-1.46 1.25-2.47 1.25-.38 0-.73-.09-1.06-.22.22-.44-.28-1.31-.75-1.59-.23-.23-.72-.14-1-.25-.09-.27-.18-.54-.19-.84.03-.05.08-.09.16-.09.19 0 .45.38.59.34.18-.04-.74-1.31-.31-1.56.2-.12.6.39.47-.16-.12-.51.36-.28.66-.41.26-.11.45-.41.13-.59-.06-.03-.13-.1-.22-.19.45-.27.97-.44 1.53-.44zm2.31 1.09c.18.22.32.46.44.72 0 .01 0 .02 0 .03-.04.07-.11.11-.22.22-.28.28-.32-.21-.44-.31-.13-.12-.6.02-.66-.13-.07-.18.5-.42.88-.53z"/>
        </svg>);

      case "spreadsheet":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M.75 0c-.41 0-.75.34-.75.75v5.5c0 .41.34.75.75.75h6.5c.41 0 .75-.34.75-.75v-5.5c0-.41-.34-.75-.75-.75h-6.5zm.25 1h1v1h-1v-1zm2 0h4v1h-4v-1zm-2 2h1v1h-1v-1zm2 0h4v1h-4v-1zm-2 2h1v1h-1v-1zm2 0h4v1h-4v-1z" />
        </svg>);

      case "cloud-download":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M4.5 0c-1.21 0-2.27.86-2.5 2-1.1 0-2 .9-2 2 0 .37.11.71.28 1h2.72v-.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v.5h1.91c.06-.16.09-.32.09-.5 0-.65-.42-1.29-1-1.5v-.5c0-1.38-1.12-2.5-2.5-2.5zm-.16 4a.5.5 0 0 0-.34.5v1.5h-1.5l2 2 2-2h-1.5v-1.5a.5.5 0 0 0-.59-.5.5.5 0 0 0-.06 0z"/>
        </svg>);

      case "print":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M2 0v2h4v-2h-4zm-1.91 3c-.06 0-.09.04-.09.09v2.81c0 .05.04.09.09.09h.91v-2h6v2h.91c.05 0 .09-.04.09-.09v-2.81c0-.06-.04-.09-.09-.09h-7.81zm1.91 2v3h4v-3h-4z" />
        </svg>);

      case "fork":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M1.5 0c-.83 0-1.5.67-1.5 1.5 0 .66.41 1.2 1 1.41v2.19c-.59.2-1 .75-1 1.41 0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5c0-.6-.34-1.1-.84-1.34.09-.09.21-.16.34-.16h2c.82 0 1.5-.68 1.5-1.5v-.59c.59-.2 1-.75 1-1.41 0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5c0 .66.41 1.2 1 1.41v.59c0 .28-.22.5-.5.5h-2c-.17 0-.35.04-.5.09v-1.19c.59-.2 1-.75 1-1.41 0-.83-.67-1.5-1.5-1.5z"
          />
        </svg>);

      case "chevron-top":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M4 0l-4 4 1.5 1.5 2.5-2.5 2.5 2.5 1.5-1.5-4-4z" transform="translate(0 1)" />
        </svg>);

      case "chevron-bottom":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M1.5 0l-1.5 1.5 4 4 4-4-1.5-1.5-2.5 2.5-2.5-2.5z" transform="translate(0 1)" />
        </svg>);

      case "basket":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
        <path d="M3.97 0c-.13.01-.26.08-.34.19l-2.34 2.81h-1.28v1h1v3.66c0 .18.16.34.34.34h5.31c.18 0 .34-.16.34-.34v-3.66h1v-1h-1.28c-.27-.33-2.39-2.86-2.41-2.88-.11-.09-.22-.14-.34-.13zm.03 1.28l1.44 1.72h-2.88l1.44-1.72zm-1.5 3.72c.28 0 .5.22.5.5v1c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-1c0-.28.22-.5.5-.5zm3 0c.28 0 .5.22.5.5v1c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-1c0-.28.22-.5.5-.5z"
        />
        </svg>);

      case "monitor":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M.34 0a.5.5 0 0 0-.34.5v5a.5.5 0 0 0 .5.5h2.5v1h-1c-.55 0-1 .45-1 1h6c0-.55-.45-1-1-1h-1v-1h2.5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.09 0 .5.5 0 0 0-.06 0zm.66 1h6v4h-6v-4z" />
        </svg>);

      case "wrench":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
        <path d="M5.5 0c-1.38 0-2.5 1.12-2.5 2.5 0 .32.08.62.19.91l-2.91 2.88c-.39.39-.39 1.05 0 1.44.2.2.46.28.72.28.26 0 .52-.09.72-.28l2.88-2.91c.28.11.58.19.91.19 1.38 0 2.5-1.12 2.5-2.5 0-.16 0-.32-.03-.47l-.97.97h-2v-2l.97-.97c-.15-.03-.31-.03-.47-.03zm-4.5 6.5c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5z"/>
        </svg>);

      case "link-intact":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
        <path d="M5.88.03c-.18.01-.36.03-.53.09-.27.1-.53.25-.75.47a.5.5 0 1 0 .69.69c.11-.11.24-.17.38-.22.35-.12.78-.07 1.06.22.39.39.39 1.04 0 1.44l-1.5 1.5c-.44.44-.8.48-1.06.47-.26-.01-.41-.13-.41-.13a.5.5 0 1 0-.5.88s.34.22.84.25c.5.03 1.2-.16 1.81-.78l1.5-1.5c.78-.78.78-2.04 0-2.81-.28-.28-.61-.45-.97-.53-.18-.04-.38-.04-.56-.03zm-2 2.31c-.5-.02-1.19.15-1.78.75l-1.5 1.5c-.78.78-.78 2.04 0 2.81.56.56 1.36.72 2.06.47.27-.1.53-.25.75-.47a.5.5 0 1 0-.69-.69c-.11.11-.24.17-.38.22-.35.12-.78.07-1.06-.22-.39-.39-.39-1.04 0-1.44l1.5-1.5c.4-.4.75-.45 1.03-.44.28.01.47.09.47.09a.5.5 0 1 0 .44-.88s-.34-.2-.84-.22z"/>
        </svg>);

      case "trash":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M3 0c-.55 0-1 .45-1 1h-1c-.55 0-1 .45-1 1h7c0-.55-.45-1-1-1h-1c0-.55-.45-1-1-1h-1zm-2 3v4.81c0 .11.08.19.19.19h4.63c.11 0 .19-.08.19-.19v-4.81h-1v3.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-3.5h-1v3.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-3.5h-1z" />
        </svg>);

      case "bug":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
        <path d="M3.5 0c-1.19 0-1.98 1.69-1.19 2.5-.09.07-.2.14-.28.22l-1.31-.66a.5.5 0 0 0-.34-.06.5.5 0 0 0-.09.94l1.16.56c-.09.16-.19.33-.25.5h-.69a.5.5 0 0 0-.09 0 .5.5 0 1 0 .09 1h.5c0 .23.02.45.06.66l-.78.41a.5.5 0 1 0 .44.88l.66-.34c.25.46.62.85 1.03 1.09.35-.19.59-.44.59-.72v-1.44a.5.5 0 0 0 0-.09v-.81a.5.5 0 0 0 0-.22c.05-.23.26-.41.5-.41.28 0 .5.22.5.5v.88a.5.5 0 0 0 0 .09v.06a.5.5 0 0 0 0 .09v1.34c0 .27.24.53.59.72.41-.25.79-.63 1.03-1.09l.66.34a.5.5 0 1 0 .44-.88l-.78-.41c.04-.21.06-.43.06-.66h.5a.5.5 0 1 0 0-1h-.69c-.06-.17-.16-.34-.25-.5l1.16-.56a.5.5 0 0 0-.31-.94.5.5 0 0 0-.13.06l-1.31.66c-.09-.08-.19-.15-.28-.22.78-.83 0-2.5-1.19-2.5z"/>
        </svg>);

      case "chevron-left":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M4 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z" transform="translate(1)" />
        </svg>);

      case "cancel":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M1.41 0l-1.41 1.41.72.72 1.78 1.81-1.78 1.78-.72.69 1.41 1.44.72-.72 1.81-1.81 1.78 1.81.69.72 1.44-1.44-.72-.69-1.81-1.78 1.81-1.81.72-.72-1.44-1.41-.69.72-1.78 1.78-1.81-1.78-.72-.72z" />
        </svg>);

      case "arrow-left":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M3 0l-3 2.53 3 2.47v-2h5v-1h-5v-2z" transform="translate(0 1)" />
        </svg>);

      case "caret-bottom":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
           <path d="M0 0l4 4 4-4h-8z" transform="translate(0 2)" />
        </svg>);

      case "grid-three-up":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M0 0v2h2v-2h-2zm3 0v2h2v-2h-2zm3 0v2h2v-2h-2zm-6 3v2h2v-2h-2zm3 0v2h2v-2h-2zm3 0v2h2v-2h-2zm-6 3v2h2v-2h-2zm3 0v2h2v-2h-2zm3 0v2h2v-2h-2z" />
        </svg>);

      case "cart":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
        <path d="M.34 0a.5.5 0 0 0 .16 1h1.5l.09.25.41 1.25.41 1.25c.04.13.21.25.34.25h3.5c.14 0 .3-.12.34-.25l.81-2.5c.04-.13-.02-.25-.16-.25h-4.44l-.38-.72a.5.5 0 0 0-.44-.28h-2a.5.5 0 0 0-.09 0 .5.5 0 0 0-.06 0zm3.16 5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm3 0c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"
transform="translate(0 1)" />
        </svg>);

      case "home":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M4 0l-4 3h1v4h2v-2h2v2h2v-4.03l1 .03-4-3z" />
        </svg>);

      case "microphone":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M2.91-.03a1 1 0 0 0-.13.03 1 1 0 0 0-.78 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1.09-1.03zm-2.56 2.03a.5.5 0 0 0-.34.5v.5c0 1.48 1.09 2.69 2.5 2.94v1.06h-.5c-.55 0-1 .45-1 1h4.01c0-.55-.45-1-1-1h-.5v-1.06c1.41-.24 2.5-1.46 2.5-2.94v-.5a.5.5 0 1 0-1 0v.5c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2v-.5a.5.5 0 0 0-.59-.5.5.5 0 0 0-.06 0z" transform="translate(1)" />
        </svg>);

      case "headphones":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M4 0c-1.65 0-3 1.35-3 3v1h-.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-3.5c0-1.11.89-2 2-2 1.11 0 2 .89 2 2v3.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-.5v-1c0-1.65-1.35-3-3-3z" />
        </svg>);

      case "phone":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M.19 0c-.11 0-.19.08-.19.19v7.63c0 .11.08.19.19.19h4.63c.11 0 .19-.08.19-.19v-7.63c0-.11-.08-.19-.19-.19h-4.63zm.81 1h3v5h-3v-5zm1.5 5.5c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5z" transform="translate(1)" />
        </svg>);

      case "terminal":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M.09 0c-.06 0-.09.04-.09.09v7.81c0 .05.04.09.09.09h7.81c.05 0 .09-.04.09-.09v-7.81c0-.06-.04-.09-.09-.09h-7.81zm1.41.78l1.72 1.72-1.72 1.72-.72-.72 1-1-1-1 .72-.72zm2.5 2.22h3v1h-3v-1z" />
        </svg>);

      case "document":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M0 0v8h7v-4h-4v-4h-3zm4 0v3h3l-3-3zm-3 2h1v1h-1v-1zm0 2h1v1h-1v-1zm0 2h4v1h-4v-1z" />
        </svg>);

      case "cloudy":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M2.5 0c-1.38 0-2.5 1.12-2.5 2.5 0 .39.09.74.25 1.06.3-.21.64-.37 1-.47.55-1.25 1.82-2.09 3.25-2.09-.46-.6-1.18-1-2-1zm2 2c-1.21 0-2.27.86-2.5 2-1.1 0-2 .9-2 2s.9 2 2 2h4.5c.83 0 1.5-.67 1.5-1.5 0-.65-.42-1.29-1-1.5v-.5c0-1.38-1.12-2.5-2.5-2.5z"/>
        </svg>);

      case "ban":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M4 0c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 1c.66 0 1.26.21 1.75.56l-4.19 4.19c-.35-.49-.56-1.09-.56-1.75 0-1.66 1.34-3 3-3zm2.44 1.25c.35.49.56 1.09.56 1.75 0 1.66-1.34 3-3 3-.66 0-1.26-.21-1.75-.56l4.19-4.19z" />
        </svg>);

      case "target":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M4 0c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 1c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 1c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 1c.56 0 1 .44 1 1s-.44 1-1 1-1-.44-1-1 .44-1 1-1z" />
        </svg>);

      case "browser":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M.34 0a.5.5 0 0 0-.34.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.09 0 .5.5 0 0 0-.06 0zm1.16 1c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5zm2 0h3c.28 0 .5.22.5.5s-.22.5-.5.5h-3c-.28 0-.5-.22-.5-.5s.22-.5.5-.5zm-2.5 2h6v4h-6v-4z"/>
        </svg>);

      case "tag":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M0 0v3l5 5 3-3-5-5h-3zm2 1c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
        </svg>);

      case "box":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M0 0v1h8v-1h-8zm0 2v5.91c0 .05.04.09.09.09h7.81c.05 0 .09-.04.09-.09v-5.91h-2.97v1.03h-2.03v-1.03h-3z" />
        </svg>);

      case "list-rich":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M0 0v3h3v-3h-3zm4 0v1h4v-1h-4zm0 2v1h3v-1h-3zm-4 2v3h3v-3h-3zm4 0v1h4v-1h-4zm0 2v1h3v-1h-3z" />
        </svg>);

      case "minus":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M0 0v2h8v-2h-8z" transform="translate(0 3)" />
        </svg>);

      case "cloud":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M4.5 0c-1.21 0-2.27.86-2.5 2-1.1 0-2 .9-2 2s.9 2 2 2h4.5c.83 0 1.5-.67 1.5-1.5 0-.65-.42-1.29-1-1.5v-.5c0-1.38-1.12-2.5-2.5-2.5z" transform="translate(0 1)" />
        </svg>);

      case "bell":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
          <path d="M4 0c-1.1 0-2 .9-2 2 0 1.04-.52 1.98-1.34 2.66-.41.34-.66.82-.66 1.34h8c0-.52-.24-1-.66-1.34-.82-.68-1.34-1.62-1.34-2.66 0-1.1-.89-2-2-2zm-1 7c0 .55.45 1 1 1s1-.45 1-1h-2z" />
        </svg>);

      case "blank":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">

        </svg>);

      case "blank":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">

        </svg>);

      case "blank":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">

        </svg>);

      case "blank":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">

        </svg>);

      case "blank":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">

        </svg>);

      case "blank":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">

        </svg>);

      case "blank":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">

        </svg>);

      case "blank":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">

        </svg>);

      case "blank":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">

        </svg>);

      case "blank":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">

        </svg>);

      case "blank":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">

        </svg>);

      case "blank":
        return (<svg style="fill:currentcolor" {...vnode.attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">

        </svg>);

        default:
          return ""
    }
  }
}

export default Icons;
