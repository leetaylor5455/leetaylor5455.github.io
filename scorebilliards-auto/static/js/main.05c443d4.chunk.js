(this["webpackJsonpbar-billiards-auto"]=this["webpackJsonpbar-billiards-auto"]||[]).push([[0],{124:function(e,t,a){},125:function(e,t,a){},283:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a(114),s=a.n(r),c=(a(124),a(14)),i=a(2),o=a(29),l=a(4),d=(a(125),a.p+"static/media/brand.1bd2b222.svg"),u=a(0);var b=function(e){return Object(u.jsx)("header",{style:{transform:e.hidden?"translateY(-100%)":"translateY(0%)"},children:Object(u.jsx)("div",{className:"container",children:Object(u.jsx)("img",{src:d,alt:"Logo"})})})},j=a(3),h=a.n(j),p=a(8),m=a(9),f=a.n(m),O=a.p+"static/media/table-gradient.dba73456.svg",x="https://node-bar-billiards-auto.herokuapp.com";var g=function(e){var t=Object(l.f)(),a=Object(n.useState)(0),r=Object(i.a)(a,2),s=r[0],c=r[1],o=Object(n.useRef)(null),d=Object(n.useState)(""),b=Object(i.a)(d,2),j=b[0],m=b[1];function g(){c(o.current.offsetWidth)}function v(){return(v=Object(p.a)(h.a.mark((function a(){var n;return h.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,f()({method:"post",url:x+"/api/auth",data:{tableId:e.tableId,password:j}});case 2:n=a.sent,console.log(n),200===n.status&&n.data.jwt&&!n.data.gameId?t.push({pathname:"/setup",state:{jwt:n.data.jwt,tableName:e.name}}):200===n.status&&n.data.jwt&&n.data.gameId&&t.push({pathname:"/game",state:{jwt:n.data.jwt,gameId:n.data.gameId}});case 5:case"end":return a.stop()}}),a)})))).apply(this,arguments)}return Object(n.useEffect)((function(){g()}),[]),window.addEventListener("resize",g),Object(u.jsxs)("div",{className:"Table",ref:o,style:{height:s/3},children:[Object(u.jsxs)("div",{className:"table-text",children:[Object(u.jsx)("div",{className:"table-name",children:e.name}),Object(u.jsx)("input",{type:"password",className:"password",placeholder:"Password",value:j,onChange:function(e){return m(e.target.value)}})]}),Object(u.jsx)("div",{className:"table-connect",onClick:function(){return v.apply(this,arguments)},children:"Connect >"}),Object(u.jsx)("img",{className:"menu-background",src:x+"/api/images/"+e.imgName+".jpg",alt:"Bar Billiards Table"}),Object(u.jsx)("img",{className:"gradient",src:O,alt:"gradient"})]})};var v=function(){var e=Object(n.useState)([]),t=Object(i.a)(e,2),a=t[0];return t[1],Object(n.useEffect)((function(){(function(){var e=Object(p.a)(h.a.mark((function e(){return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f()("https://node-bar-billiards-auto.herokuapp.com/api/tables");case 2:e.sent;case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}})()()}),[]),Object(u.jsx)("div",{className:"container",children:a.map((function(e){return Object(u.jsx)(g,{name:e.name,tableId:e.tableId,imgName:e.imgName},e.tableId)}))})};var y=a.p+"static/media/tick.b047f327.svg";var k=function(e){var t=Object(n.useState)(!1),a=Object(i.a)(t,2),r=a[0],s=a[1],o=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:300,a=Object(n.useState)(!1),r=Object(i.a)(a,2),s=r[0],c=r[1];return Object(n.useEffect)((function(){var a;return s?a=setTimeout(e,t):clearTimeout(a),function(){clearTimeout(a)}}),[e,t,s]),{onMouseDown:function(){return c(!0)},onMouseUp:function(){return c(!1)},onMouseLeave:function(){return c(!1)},onTouchStart:function(){return c(!0)},onTouchEnd:function(){return c(!1)}}}((function(){r||s(!r)}),500),l=Object(n.useState)(!1),d=Object(i.a)(l,2),b=d[0],j=d[1],h="#7262F6",p="#4433D4",m="#707070",f="#4A4A4A",O={hidden:{opacity:0,pointerEvents:"none"},visible:{opacity:1,pointerEvents:"all"}};return Object(u.jsxs)("div",Object(c.a)(Object(c.a)({className:"player-option",onClick:function(){j(!b),e.selectPlayer(e.playerId)},style:b?{borderColor:h}:{borderColor:m}},o),{},{children:[Object(u.jsx)("div",{className:"player-name",style:b?{color:p}:{color:f},children:e.name}),Object(u.jsx)("div",{className:"selected-indicator",style:b?{borderColor:h,backgroundColor:h}:{borderColor:m,backgroundColor:"#fff"},children:Object(u.jsx)("img",{className:"tick",src:y,alt:"tick icon"})}),Object(u.jsxs)("div",{className:"delete-interface",style:r?O.visible:O.hidden,children:[Object(u.jsx)("div",{className:"delete",onClick:function(){e.deletePlayer(e.playerId)},children:"Delete"}),Object(u.jsx)("div",{className:"cancel",onClick:function(e){e.stopPropagation(),s(!1)},children:"Cancel"})]})]}),e.playerId)},N="https://node-bar-billiards-auto.herokuapp.com";var w=function(){var e=Object(l.g)().state,t=e.jwt,a=e.tableName,r=Object(l.f)(),s=Object(n.useState)([]),c=Object(i.a)(s,2),o=c[0],d=c[1],b=Object(n.useState)([]),j=Object(i.a)(b,2),m=j[0],O=j[1],x=Object(n.useState)(""),g=Object(i.a)(x,2),v=g[0],y=g[1];function w(e){var t=m,a=o.find((function(t){return t.playerId===e})),n=t.findIndex((function(e){return e.playerId===a.playerId}));-1===n?t.push({playerId:a.playerId}):t.splice(n,1),O(t)}function C(){return(C=Object(p.a)(h.a.mark((function e(){return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(v.length<1)){e.next=2;break}return e.abrupt("return",console.log("Name must to be at least 1 char in length"));case 2:if(!(v.length>18)){e.next=4;break}return e.abrupt("return",console.log("Name must be shorter than 18 chars"));case 4:return e.next=6,f()({method:"POST",url:N+"/api/players",data:{name:v},headers:{"x-auth-token":t}});case 6:if(200!==e.sent.status){e.next=10;break}return y(""),e.abrupt("return",S());case 10:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var S=Object(n.useCallback)(Object(p.a)(h.a.mark((function e(){var a;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f()({method:"GET",url:N+"/api/players",headers:{"x-auth-token":t}});case 2:a=e.sent,console.log(a),d(a.data);case 5:case"end":return e.stop()}}),e)}))),[t]);function I(e){return P.apply(this,arguments)}function P(){return(P=Object(p.a)(h.a.mark((function e(a){return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log(a),e.next=3,f()({method:"DELETE",url:N+"/api/players",data:{playerId:a},headers:{"x-auth-token":t}});case 3:if(200!==e.sent.status){e.next=6;break}return e.abrupt("return",S());case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function T(){return(T=Object(p.a)(h.a.mark((function e(){var a;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(m.length<2)){e.next=2;break}return e.abrupt("return",console.log("Need at least 2 players"));case 2:return e.prev=2,e.next=5,f()({method:"POST",url:N+"/api/games/newgame",data:m,headers:{"x-auth-token":t}});case 5:200===(a=e.sent).status&&r.push({pathname:"/game",state:{gameId:a.data,jwt:t}}),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(2),console.log(e.t0);case 12:case"end":return e.stop()}}),e,null,[[2,9]])})))).apply(this,arguments)}return Object(n.useEffect)((function(){S()}),[S]),Object(u.jsxs)("div",{className:"Setup container",children:[Object(u.jsxs)("div",{className:"table-info",children:[Object(u.jsx)("h1",{className:"table-name",children:a}),Object(u.jsxs)("div",{className:"table-status",children:["Online",Object(u.jsx)("div",{className:"status-indicator"})]})]}),Object(u.jsxs)("div",{className:"setup-form",children:[Object(u.jsx)("h2",{children:"Select Players"}),Object(u.jsx)("div",{className:"player-list",children:o.map((function(e){return Object(u.jsx)(k,{playerId:e.playerId,name:e.name,selectPlayer:w,deletePlayer:I},e.playerId)}))}),Object(u.jsxs)("div",{className:"register-new-player",children:[Object(u.jsx)("h2",{children:"Register New Player"}),Object(u.jsxs)("div",{className:"player-form",children:[Object(u.jsx)("input",{placeholder:"Name",value:v,onChange:function(e){y(e.target.value)}}),Object(u.jsx)("div",{className:"call-to-action",onClick:function(){return C.apply(this,arguments)},children:"Submit"})]})]})]}),Object(u.jsx)("div",{className:"call-to-action start-game",onClick:function(){return T.apply(this,arguments)},children:"Start Game"})]})},C=a(116),S=a.n(C),I=a(5),P=a(119);var T=function(e){var t=[],a=0;e.chartData.forEach((function(e){t.push({borderJoinStyle:"bevel",pointRadius:0,label:e.name,data:e.safePoints,borderColor:e.lineColor,borderWidth:2}),e.potentialPoints&&t.push({pointRadius:0,borderDash:[5],label:e.name+" Potential",data:e.potentialPoints,backgroundColor:"transparent",borderColor:e.lineColor,borderWidth:2}),a=e.safePoints.length+2}));var r=Object(n.useRef)(),s={labels:Object(I.a)(Array(a).keys()),datasets:t,options:{animation:{duration:0},scales:{y:{suggestedMin:0,suggestedMax:300}}}},c={opacity:e.visible?1:0,PointerEvent:e.visible?"all":"none"};return Object(u.jsx)("div",{className:"Chart",style:c,children:Object(u.jsx)(P.a,{ref:r,data:s,options:s.options,height:120})})};var E=function(e){return Object(u.jsxs)("div",{className:"toggle",onClick:e.onToggle,children:[Object(u.jsx)("div",{className:"label",children:e.label}),Object(u.jsx)("div",{className:"switch",style:{backgroundColor:e.on?"#7262F6":"#F8F6FF"},children:Object(u.jsx)("div",{className:"pip",style:{transform:e.on?"translateX(0px)":"translateX(-30px)",backgroundColor:e.on?"#fff":"#7262F6"}})})]})},B="https://node-bar-billiards-auto.herokuapp.com";var F=function(e){var t=Object(l.f)(),a=Object(l.g)().state,r=a.gameId,s=a.jwt,c=Object(n.useState)({players:[]}),o=Object(i.a)(c,2),d=o[0],b=o[1],j=Object(n.useState)(!0),m=Object(i.a)(j,2),O=m[0],x=m[1],g=Object(n.useState)(!0),v=Object(i.a)(g,2),y=v[0],k=v[1],N=Object(n.useCallback)((function(){t.push({pathname:"/summary",state:{gameId:r,jwt:s}})}),[t,r,s]);Object(n.useEffect)((function(){S()(B+"?data="+r).on("GameData",(function(e){if(console.log(e),e.isComplete)return N();b(e)}))}),[N,b,r]);var w={current:{backgroundColor:"#7262F6",color:"#fff"},notCurrent:{}};function C(e){return I.apply(this,arguments)}function I(){return(I=Object(p.a)(h.a.mark((function e(t){var a;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f()({method:"POST",url:B+"/api/games/nextplayer",data:{gameId:r,isSafeBreak:1===t,isFoulBreak:2===t,isBlackPin:3===t},headers:{"x-auth-token":s}});case 2:if(!(a=e.sent).data.isComplete){e.next=5;break}return e.abrupt("return",N());case 5:b(a.data);case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function P(){return(P=Object(p.a)(h.a.mark((function e(){var t;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f()({method:"POST",url:B+"/api/games/endgame",data:{gameId:r},headers:{"x-auth-token":s}});case 2:if(t=e.sent,console.log(t),200!==t.status){e.next=6;break}return e.abrupt("return",N());case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return Object(u.jsxs)("div",{className:"Game container",children:[Object(u.jsx)("div",{className:"scoreboard",children:Object(u.jsx)("table",{cellSpacing:"0",cellPadding:"0",children:Object(u.jsxs)("tbody",{children:[Object(u.jsxs)("tr",{className:"labels",children:[Object(u.jsx)("th",{style:{paddingLeft:"12px"},children:"Name"}),Object(u.jsx)("th",{children:"Break"}),Object(u.jsx)("th",{style:{textAlign:"right",paddingRight:"12px"},children:"Score"})]}),d.players.map((function(e){return Object(u.jsxs)("tr",{className:"player",style:e.isCurrent?w.current:w.notCurrent,children:[Object(u.jsx)("th",{className:"name",children:e.name}),Object(u.jsx)("th",{className:"break",children:e.isCurrent?e.breaks[0].score:""}),Object(u.jsx)("th",{className:"score",children:e.isCurrent?Object(u.jsxs)("span",{style:{fontWeight:"700"},children:[e.score,Object(u.jsxs)("span",{style:{fontWeight:"300",opacity:.7},children:[" > ",e.score+e.breaks[0].score]})]}):e.score})]},e.name)}))]})})}),d.chartData?Object(u.jsx)(T,{visible:y,chartData:d.chartData}):Object(u.jsx)("div",{}),Object(u.jsxs)("div",{className:"controls",style:{opacity:O?1:0,pointerEvents:O?"all":"none",transform:y?"translateY(0px)":"translateY(-100px)"},children:[Object(u.jsx)("div",{className:"button safe",onClick:function(){return C(1)},children:"Safe"}),Object(u.jsx)("div",{className:"button foul",onClick:function(){return C(2)},children:"Nope"}),Object(u.jsx)("div",{className:"button black",onClick:function(){return C(3)},children:"Black"})]}),Object(u.jsxs)("div",{style:{display:"flex"},children:[Object(u.jsx)(E,{label:"Controls",onToggle:function(){e.showHideHeader(O),x(!O)},on:O}),Object(u.jsx)(E,{label:"Chart",onToggle:function(){k(!y)},on:y})]}),Object(u.jsx)("div",{className:"end-game secondary-cta",onClick:function(){return P.apply(this,arguments)},style:{marginBottom:"10vh"},children:"End Game"})]})},D=a.p+"static/media/crown.3eeef0a1.svg",W="https://node-bar-billiards-auto.herokuapp.com";var L=function(){var e=Object(l.g)(),t=Object(l.f)(),a=e.state,r=a.gameId,s=a.jwt,c=Object(n.useState)({players:[]}),o=Object(i.a)(c,2),d=o[0],b=o[1],j=Object(n.useState)([]),m=Object(i.a)(j,2),O=m[0],x=m[1],g=Object(n.useCallback)(Object(p.a)(h.a.mark((function e(){var t;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f()({method:"POST",url:W+"/api/games",data:{gameId:r},headers:{"x-auth-token":s}});case 2:t=e.sent,console.log(t.data),b(t.data),y(t.data.players);case 6:case"end":return e.stop()}}),e)}))),[r,s]);Object(n.useEffect)((function(){g()}),[g]);var v={winner:{backgroundColor:"#7262F6",color:"#fff"},notWinner:{}};function y(e){var t=[];e.forEach((function(e){t.push({playerId:e._id})})),x(t)}function k(){return(k=Object(p.a)(h.a.mark((function e(){var a;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log(O),e.prev=1,e.next=4,f()({method:"POST",url:W+"/api/games/newgame",data:O,headers:{"x-auth-token":s}});case 4:200===(a=e.sent).status&&t.push({pathname:"/game",state:{gameId:a.data,jwt:s}}),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(1),console.log(e.t0);case 11:case"end":return e.stop()}}),e,null,[[1,8]])})))).apply(this,arguments)}return Object(u.jsxs)("div",{className:"Summary container",children:[Object(u.jsx)("h1",{children:"Summary"}),Object(u.jsx)("div",{className:"scoreboard",children:Object(u.jsx)("table",{cellSpacing:"0",cellPadding:"0",children:Object(u.jsxs)("tbody",{children:[Object(u.jsxs)("tr",{className:"labels",children:[Object(u.jsx)("th",{style:{paddingLeft:"12px"},children:"Player"}),Object(u.jsx)("th",{style:{textAlign:"right",paddingRight:"12px"},children:"Score"})]}),d.players.map((function(e,t){return Object(u.jsxs)("tr",{className:"player",style:0===t?v.winner:v.notWinner,children:[Object(u.jsxs)("th",{className:"name",style:{fontWeight:0===t?"400":"300"},children:[e.name," ",0===t?Object(u.jsx)("img",{src:D,alt:"crown icon"}):""]}),Object(u.jsx)("th",{className:"score",children:e.score})]},e._id)}))]})})}),Object(u.jsx)("h2",{children:"Breakdown"}),Object(u.jsx)("div",{style:{marginBottom:50},children:d.players.map((function(e,t){return Object(u.jsxs)("div",{className:"breakdown-card",style:0===t?v.winner:v.notWinner,children:[Object(u.jsxs)("div",{className:"name",style:{fontWeight:0===t?"400":"300"},children:[e.name," ",0===t?Object(u.jsx)("img",{src:D,alt:"crown icon"}):""]}),Object(u.jsxs)("div",{className:"stat",children:["Score: ",Object(u.jsx)("span",{className:"number",children:e.score})]}),Object(u.jsxs)("div",{className:"stat",children:["Potential Score: ",Object(u.jsx)("span",{className:"number",children:e.potentialScore})]}),Object(u.jsxs)("div",{className:"stat",children:["Foul Breaks: ",Object(u.jsx)("span",{className:"number",children:e.foulBreaks})]}),Object(u.jsxs)("div",{className:"stat",children:["Points Lost: ",Object(u.jsx)("span",{className:"number",children:e.potentialScore-e.score})]})]},"breakdown-"+e._id)}))}),d.chartData?Object(u.jsx)(T,{visible:!0,chartData:d.chartData}):Object(u.jsx)("div",{}),Object(u.jsx)("div",{style:{marginBottom:20,marginTop:60},className:"call-to-action",onClick:function(){return k.apply(this,arguments)},children:"Rematch"}),Object(u.jsx)("div",{style:{marginBottom:80},className:"secondary-cta",onClick:function(){t.push("/")},children:"Finish"})]})};var R=function(){var e=Object(n.useState)(!1),t=Object(i.a)(e,2),a=t[0],r=t[1];function s(e){console.log(e),r(e)}return Object(u.jsx)(o.a,{basename:"/scorebilliards-auto",children:Object(u.jsxs)("div",{className:"App",children:[Object(u.jsx)(b,{hidden:a}),Object(u.jsxs)(l.c,{children:[Object(u.jsx)(l.a,{path:"/",exact:!0,component:v}),Object(u.jsx)(l.a,{path:"/setup",component:w}),Object(u.jsx)(l.a,{path:"/game",render:function(e){return Object(u.jsx)(F,Object(c.a)(Object(c.a)({},e),{},{showHideHeader:s}))}}),Object(u.jsx)(l.a,{path:"/summary",component:L})]})]})})};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var A=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,284)).then((function(t){var a=t.getCLS,n=t.getFID,r=t.getFCP,s=t.getLCP,c=t.getTTFB;a(e),n(e),r(e),s(e),c(e)}))};s.a.render(Object(u.jsx)(R,{}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)})),A()}},[[283,1,2]]]);
//# sourceMappingURL=main.05c443d4.chunk.js.map