(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-register-register"],{"1af2":function(t,n,i){"use strict";i.r(n);var e=i("1f01"),a=i("f806");for(var r in a)"default"!==r&&function(t){i.d(n,t,(function(){return a[t]}))}(r);i("bc10");var o,s=i("f0c5"),c=Object(s["a"])(a["default"],e["b"],e["c"],!1,null,"90541ffe",null,!1,e["a"],o);n["default"]=c.exports},"1f01":function(t,n,i){"use strict";i.d(n,"b",(function(){return a})),i.d(n,"c",(function(){return r})),i.d(n,"a",(function(){return e}));var e={Button:i("a40f").default},a=function(){var t=this,n=t.$createElement,i=t._self._c||n;return i("v-uni-view",{staticClass:"register-container"},[i("v-uni-view",{staticClass:"video-bg"}),0==t.step?i("v-uni-view",{staticClass:"container"},[i("v-uni-input",{key:"count",staticClass:"input_normal",attrs:{placeholder:"请输入邮箱账号",value:t.count,"adjust-position":"true"},on:{input:function(n){arguments[0]=n=t.$handleEvent(n),t.onCountInput.apply(void 0,arguments)}}}),i("Button",{staticClass:"button_normal",attrs:{disable:t.comfirmBtnDisable,loading:t.comfirmBtnLoading},on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.verifyClick.apply(void 0,arguments)}}},[i("v-uni-text",[t._v(t._s(t.comfirmBtnText[t.step]))])],1),i("v-uni-view",{staticClass:"horizontal-container"},[i("v-uni-checkbox",{staticStyle:{transform:"scale(0.7)"},attrs:{checked:t.checked},on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.checked=!t.checked}}}),i("v-uni-text",[t._v("我已阅读并同意")]),i("Button",{attrs:{type:"link"}},[t._v("用户使用协议")])],1)],1):t._e(),1==t.step?i("v-uni-view",{staticClass:"container"},[i("v-uni-input",{key:"code",staticClass:"code-input",attrs:{value:t.code,"auto-focus":"true",focus:4!=t.code.length,maxlength:"4"},on:{input:function(n){arguments[0]=n=t.$handleEvent(n),t.codeInput.apply(void 0,arguments)}}})],1):t._e(),2==t.step?i("v-uni-view",{staticClass:"container"},[i("v-uni-input",{key:"pwd",staticClass:"input_normal",attrs:{placeholder:"请设置密码",value:t.pwd,maxlength:"15","adjust-position":"true",password:"true"},on:{input:function(n){arguments[0]=n=t.$handleEvent(n),t.onPwdInput.apply(void 0,arguments)}}}),i("v-uni-input",{key:"pwdConfirm",staticClass:"input_normal",attrs:{placeholder:"请确认密码",value:t.pwdConfirm,maxlength:"15","adjust-position":"true",password:"true"},on:{input:function(n){arguments[0]=n=t.$handleEvent(n),t.onPwdConfirmInput.apply(void 0,arguments)}}}),i("Button",{staticClass:"button_normal",attrs:{disable:t.comfirmBtnDisable,loading:t.comfirmBtnLoading},on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.registerClick.apply(void 0,arguments)}}},[i("v-uni-text",[t._v(t._s(t.comfirmBtnText[t.step]))])],1)],1):t._e(),0==t.step?i("v-uni-view",{staticClass:"bottom-tip"},[i("v-uni-text",[t._v("已有账号？")]),i("Button",{attrs:{type:"link"},on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.gotoLogin.apply(void 0,arguments)}}},[t._v("去登录")])],1):t._e(),""!=t.pwdDisableReason?[i("v-uni-text",{staticClass:"bottom-tip tip"},[t._v(t._s(t.pwdDisableReason))])]:t._e()],2)},r=[]},7038:function(t,n,i){var e=i("f22c");"string"===typeof e&&(e=[[t.i,e,""]]),e.locals&&(t.exports=e.locals);var a=i("4f06").default;a("18a1ea84",e,!0,{sourceMap:!1,shadowMode:!1})},"7dd1":function(t,n,i){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.mailVerify=void 0;var e=function(t){var n=/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;return n.test(t)};n.mailVerify=e},"8a18":function(t,n,i){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var e=i("7dd1"),a={data:function(){return{btn:{disable:!1,text:"发送验证码"},count:"",pwd:"",pwdConfirm:"",code:"",codeIndex:0,codebox:[0,1,2,3],step:0,checked:!1,comfirmBtnText:["验证","下一步","注册"],comfirmBtnDisable:!0,comfirmBtnLoading:!1,pwdDisableReason:""}},watch:{step:function(t,n){t!=n&&(this.comfirmBtnDisable=!0,this.comfirmBtnLoading=!1)}},methods:{onCountInput:function(t){this.count=t.target.value,this.comfirmBtnDisable=!(0,e.mailVerify)(this.count)},verifyClick:function(){var n=this;if(this.checked){var i=this;this.comfirmBtnLoading=!0,this.$request({type:"GET_CHECK_CODE",data:{count:i.count,isRegister:!0},complete:function(){n.comfirmBtnLoading=!1}}).then((function(t){uni.showToast({icon:"none",title:"验证码已发送到您的邮箱，请注意查收,30分钟内有效",mask:!0}),n.step=1})).catch((function(n){t("log",n," at pages/register/register.vue:108"),uni.showToast({icon:"none",title:n.msg,mask:!0})}))}else uni.showToast({icon:"none",title:"请阅读用户使用协议",mask:!0})},codeInput:function(t){var n=this,i=t.target.value;this.code=i;var e=this;4==this.code.length&&(uni.showLoading({mask:!0,title:"验证中..."}),uni.hideKeyboard(),this.$request({type:"TSET_CHECK_CODE",data:{count:this.count,code:this.code},complete:function(){n.comfirmBtnLoading=!1,uni.hideLoading()}}).then((function(t){uni.showToast({icon:"success",title:"验证成功",mask:!0}),setTimeout((function(){n.step=2}),100)})).catch((function(t){uni.showToast({icon:"none",title:t.msg,mask:!0,complete:function(){e.code=""}})})))},onPwdInput:function(t){var n=t.target.value;this.pwd=n,this.comfirmBtnDisable=!this.passwordVerify()},onPwdConfirmInput:function(t){var n=t.target.value;this.pwdConfirm=n,this.comfirmBtnDisable=!this.passwordVerify()},registerClick:function(){var t=this;this.$request({type:"REGISTER",data:{count:this.count,pwd:this.pwd},complete:function(){t.comfirmBtnLoading=!1,uni.hideLoading()}}).then((function(n){t.step=3,uni.showModal({title:"注册成功",content:"是否前往设置资料",confirmText:"确认",cancelText:"稍后设置",success:function(t){t.confirm||uni.switchTab({url:"../mine/mine"})}})})).catch((function(t){uni.showModal({title:"注册失败",content:"未知错误，请重试",confirmText:"重新注册",cancelText:"取消"})}))},passwordVerify:function(){return this.pwd.length<6?(this.pwdDisableReason="密码至少6位",!1):/^[a-zA-Z0-9_.]{6,15}$/.test(this.pwd)?this.pwd!=this.pwdConfirm?(this.pwdDisableReason="两次输入不一致",!1):(this.pwdDisableReason="",!0):(this.pwdDisableReason="只能包含数字 字母 . _",!1)},gotoLogin:function(){uni.redirectTo({url:"../login/login"})}}};n.default=a}).call(this,i("0de9")["log"])},"9b6b":function(t,n,i){"use strict";i.r(n);var e=i("c99d"),a=i.n(e);for(var r in e)"default"!==r&&function(t){i.d(n,t,(function(){return e[t]}))}(r);n["default"]=a.a},a1f4:function(t,n,i){"use strict";var e=i("7038"),a=i.n(e);a.a},a40f:function(t,n,i){"use strict";i.r(n);var e=i("a63f"),a=i("9b6b");for(var r in a)"default"!==r&&function(t){i.d(n,t,(function(){return a[t]}))}(r);i("a1f4");var o,s=i("f0c5"),c=Object(s["a"])(a["default"],e["b"],e["c"],!1,null,"54d876f7",null,!1,e["a"],o);n["default"]=c.exports},a63f:function(t,n,i){"use strict";var e;i.d(n,"b",(function(){return a})),i.d(n,"c",(function(){return r})),i.d(n,"a",(function(){return e}));var a=function(){var t=this,n=t.$createElement,i=t._self._c||n;return i("v-uni-view",{class:t.classArr,on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.onClick()}}},[t.loading?i("v-uni-view",{staticClass:"loading",attrs:{animation:t.animationData}},[i("v-uni-view",{class:t.dotClassArr,attrs:{animation:t.animationData[0]}}),i("v-uni-view",{class:t.dotClassArr,attrs:{animation:t.animationData[1]}}),i("v-uni-view",{class:t.dotClassArr,attrs:{animation:t.animationData[2]}})],1):[t._t("default")]],2)},r=[]},bc10:function(t,n,i){"use strict";var e=i("f278"),a=i.n(e);a.a},c99d:function(t,n,i){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var e={data:function(){return{animationData:[]}},props:{disable:{type:Boolean,default:!1},loading:{type:Boolean,default:!1},type:{type:String,default:"primary"}},created:function(){this.animIndex=!0},mounted:function(){this.animTimer&&clearTimeout(this.animTimer)},methods:{onClick:function(){this.disable||this.loading||this.$emit("click")},startAnim:function(){this.animationData=new Array;for(var t=0;t<3;t++){var n=this.createAnim(t);n.opacity(this.animIndex?0:1).step(),this.animationData.push(n.export())}this.animIndex=!this.animIndex},repeatAnim:function(){var t=this;this.animTimer&&clearTimeout(this.animTimer),this.startAnim(),this.animTimer=setTimeout((function(){t.repeatAnim()}),610)},createAnim:function(t){return uni.createAnimation({duration:200,delay:200*t})}},computed:{classArr:function(){var t=this.type,n={"btn-container":!0,"btn-primary":"primary"==t,"btn-plain":"plain"==t,"btn-link":"link"==t};return(this.disable||this.loading)&&("primary"==t&&(n["disable-primary"]=!0),"plain"==t&&(n["disable-plain"]=!0),"link"==t&&(n["disable-link"]=!0)),n},dotClassArr:function(){var t=this.type;return{dot:!0,"dot-primary":"primary"==t,"dot-plain":"plain"==t}}},watch:{loading:function(t){t&&"link"!=this.type&&this.repeatAnim()}}};n.default=e},dde1:function(t,n,i){var e=i("24fb");n=e(!1),n.push([t.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* ==== 全局自定义样式配置 ==== */\r\n/* 颜色 */\r\n/* 大小 */\r\n/* 调试 */\r\n/* ==== 全局自定义样式配置 end ==== */\r\n/* ==== 官方 ==== */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */.input_normal[data-v-90541ffe]{border:%?1?% solid rgba(34,43,95,.79);padding:%?10?%;margin:%?10?% 0;-webkit-border-radius:%?10?%;border-radius:%?10?%;width:%?400?%;height:%?60?%;font-size:.8rem}.button_normal[data-v-90541ffe]{padding:%?10?%;-webkit-border-radius:%?10?%;border-radius:%?10?%;font-size:.8rem;margin:%?20?% 0;height:%?60?%;width:%?400?%}.common-container[data-v-90541ffe]{\r\nheight:calc(100vh - 44px);\n}.register-container[data-v-90541ffe]{height:calc(100vh - 44px);width:100%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.register-container .bottom-tip[data-v-90541ffe]{width:100%;position:absolute;bottom:2rem;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center}.register-container .tip[data-v-90541ffe]{font-size:.8rem;color:#888}.register-container .video-bg[data-v-90541ffe]{position:absolute;top:0;height:40%;width:100%}.register-container .container[data-v-90541ffe]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-transform:translateY(-50%);transform:translateY(-50%);background-color:#fff;-webkit-border-radius:%?20?%;border-radius:%?20?%;padding:%?25?%}.register-container .container .horizontal-container[data-v-90541ffe]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-sizing:border-box;box-sizing:border-box;padding:.2rem .5rem;font-size:.8rem;width:100%}.register-container .container .code-input[data-v-90541ffe]{display:inline-block;width:8rem;height:2rem;padding:.5rem;font-size:1.5rem;letter-spacing:.5rem;border-bottom:%?1?% solid rgba(34,43,95,.4);margin:0 .5rem;text-align:center}',""]),t.exports=n},f22c:function(t,n,i){var e=i("24fb");n=e(!1),n.push([t.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* ==== 全局自定义样式配置 ==== */\r\n/* 颜色 */\r\n/* 大小 */\r\n/* 调试 */\r\n/* ==== 全局自定义样式配置 end ==== */\r\n/* ==== 官方 ==== */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */.btn-container[data-v-54d876f7]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.btn-primary[data-v-54d876f7]{background-color:#090723;color:#fff}.btn-plain[data-v-54d876f7]{background-color:transparent;color:#090723;border:#090723 %?1?% solid}.btn-link[data-v-54d876f7]{color:#007aff}.disable-primary[data-v-54d876f7]{background-color:rgba(34,43,95,.4)}.disable-plain[data-v-54d876f7]{opacity:.4}.disable-link[data-v-54d876f7]{color:#888}.loading[data-v-54d876f7]{height:%?30?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.loading .dot[data-v-54d876f7]{width:%?10?%;height:%?10?%;-webkit-border-radius:%?5?%;border-radius:%?5?%;margin:0 %?5?%}.loading .dot-primary[data-v-54d876f7]{background-color:#fff}.loading .dot-plain[data-v-54d876f7]{background-color:#090723}',""]),t.exports=n},f278:function(t,n,i){var e=i("dde1");"string"===typeof e&&(e=[[t.i,e,""]]),e.locals&&(t.exports=e.locals);var a=i("4f06").default;a("4a004ba0",e,!0,{sourceMap:!1,shadowMode:!1})},f806:function(t,n,i){"use strict";i.r(n);var e=i("8a18"),a=i.n(e);for(var r in e)"default"!==r&&function(t){i.d(n,t,(function(){return e[t]}))}(r);n["default"]=a.a}}]);