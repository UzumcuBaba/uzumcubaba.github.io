(function($){$.fn.theiaStickySidebar=function(options){var defaults={'containerSelector':'','additionalMarginTop':0,'additionalMarginBottom':0,'updateSidebarHeight':true,'minWidth':0,'disableOnResponsiveLayouts':true,'sidebarBehavior':'modern','defaultPosition':'relative','namespace':'TSS'};options=$.extend(defaults,options);options.additionalMarginTop=parseInt(options.additionalMarginTop)||0;options.additionalMarginBottom=parseInt(options.additionalMarginBottom)||0;tryInitOrHookIntoEvents(options,this);function tryInitOrHookIntoEvents(options,$that){var success=tryInit(options,$that);if(!success){console.log('TSS: Body width smaller than options.minWidth. Init is delayed.');$(document).on('scroll.'+options.namespace,function(options,$that){return function(evt){var success=tryInit(options,$that);if(success){$(this).unbind(evt)}}}(options,$that));$(window).on('resize.'+options.namespace,function(options,$that){return function(evt){var success=tryInit(options,$that);if(success){$(this).unbind(evt)}}}(options,$that))}}function tryInit(options,$that){if(options.initialized===true){return true}if($('body').width()<options.minWidth){return false}init(options,$that);return true}function init(options,$that){options.initialized=true;var existingStylesheet=$('#theia-sticky-sidebar-stylesheet-'+options.namespace);if(existingStylesheet.length===0){$('head').append($('<style id="theia-sticky-sidebar-stylesheet-'+options.namespace+'">.theiaStickySidebar:after {content: ""; display: table; clear: both;}</style>'))}$that.each(function(){var o={};o.sidebar=$(this);o.options=options||{};o.container=$(o.options.containerSelector);if(o.container.length==0){o.container=o.sidebar.parent()}o.sidebar.parents().css('-webkit-transform','none');o.sidebar.css({'position':o.options.defaultPosition,'overflow':'visible','-webkit-box-sizing':'border-box','-moz-box-sizing':'border-box','box-sizing':'border-box'});o.stickySidebar=o.sidebar.find('.theiaStickySidebar');if(o.stickySidebar.length==0){var javaScriptMIMETypes=/(?:text|application)\/(?:x-)?(?:javascript|ecmascript)/i;o.sidebar.find('script').filter(function(index,script){return script.type.length===0||script.type.match(javaScriptMIMETypes)}).remove();o.stickySidebar=$('<div>').addClass('theiaStickySidebar').append(o.sidebar.children());o.sidebar.append(o.stickySidebar)}o.marginBottom=parseInt(o.sidebar.css('margin-bottom'));o.paddingTop=parseInt(o.sidebar.css('padding-top'));o.paddingBottom=parseInt(o.sidebar.css('padding-bottom'));var collapsedTopHeight=o.stickySidebar.offset().top;var collapsedBottomHeight=o.stickySidebar.outerHeight();o.stickySidebar.css('padding-top',1);o.stickySidebar.css('padding-bottom',1);collapsedTopHeight-=o.stickySidebar.offset().top;collapsedBottomHeight=o.stickySidebar.outerHeight()-collapsedBottomHeight-collapsedTopHeight;if(collapsedTopHeight==0){o.stickySidebar.css('padding-top',0);o.stickySidebarPaddingTop=0}else{o.stickySidebarPaddingTop=1}if(collapsedBottomHeight==0){o.stickySidebar.css('padding-bottom',0);o.stickySidebarPaddingBottom=0}else{o.stickySidebarPaddingBottom=1}o.previousScrollTop=null;o.fixedScrollTop=0;resetSidebar();o.onScroll=function(o){if(!o.stickySidebar.is(":visible")){return}if($('body').width()<o.options.minWidth){resetSidebar();return}if(o.options.disableOnResponsiveLayouts){var sidebarWidth=o.sidebar.outerWidth(o.sidebar.css('float')=='none');if(sidebarWidth+50>o.container.width()){resetSidebar();return}}var scrollTop=$(document).scrollTop();var position='static';if(scrollTop>=o.sidebar.offset().top+(o.paddingTop-o.options.additionalMarginTop)){var offsetTop=o.paddingTop+options.additionalMarginTop;var offsetBottom=o.paddingBottom+o.marginBottom+options.additionalMarginBottom;var containerTop=o.sidebar.offset().top;var containerBottom=o.sidebar.offset().top+getClearedHeight(o.container);var windowOffsetTop=0+options.additionalMarginTop;var windowOffsetBottom;var sidebarSmallerThanWindow=(o.stickySidebar.outerHeight()+offsetTop+offsetBottom)<$(window).height();if(sidebarSmallerThanWindow){windowOffsetBottom=windowOffsetTop+o.stickySidebar.outerHeight()}else{windowOffsetBottom=$(window).height()-o.marginBottom-o.paddingBottom-options.additionalMarginBottom}var staticLimitTop=containerTop-scrollTop+o.paddingTop;var staticLimitBottom=containerBottom-scrollTop-o.paddingBottom-o.marginBottom;var top=o.stickySidebar.offset().top-scrollTop;var scrollTopDiff=o.previousScrollTop-scrollTop;if(o.stickySidebar.css('position')=='fixed'){if(o.options.sidebarBehavior=='modern'){top+=scrollTopDiff}}if(o.options.sidebarBehavior=='stick-to-top'){top=options.additionalMarginTop}if(o.options.sidebarBehavior=='stick-to-bottom'){top=windowOffsetBottom-o.stickySidebar.outerHeight()}if(scrollTopDiff>0){top=Math.min(top,windowOffsetTop)}else{top=Math.max(top,windowOffsetBottom-o.stickySidebar.outerHeight())}top=Math.max(top,staticLimitTop);top=Math.min(top,staticLimitBottom-o.stickySidebar.outerHeight());var sidebarSameHeightAsContainer=o.container.height()==o.stickySidebar.outerHeight();if(!sidebarSameHeightAsContainer&&top==windowOffsetTop){position='fixed'}else if(!sidebarSameHeightAsContainer&&top==windowOffsetBottom-o.stickySidebar.outerHeight()){position='fixed'}else if(scrollTop+top-o.sidebar.offset().top-o.paddingTop<=options.additionalMarginTop){position='static'}else{position='absolute'}}if(position=='fixed'){var scrollLeft=$(document).scrollLeft();o.stickySidebar.css({'position':'fixed','width':getWidthForObject(o.stickySidebar)+'px','transform':'translateY('+top+'px)','left':(o.sidebar.offset().left+parseInt(o.sidebar.css('padding-left'))-scrollLeft)+'px','top':'0px'})}else if(position=='absolute'){var css={};if(o.stickySidebar.css('position')!='absolute'){css.position='absolute';css.transform='translateY('+(scrollTop+top-o.sidebar.offset().top-o.stickySidebarPaddingTop-o.stickySidebarPaddingBottom)+'px)';css.top='0px'}css.width=getWidthForObject(o.stickySidebar)+'px';css.left='';o.stickySidebar.css(css)}else if(position=='static'){resetSidebar()}if(position!='static'){if(o.options.updateSidebarHeight==true){o.sidebar.css({'min-height':o.stickySidebar.outerHeight()+o.stickySidebar.offset().top-o.sidebar.offset().top+o.paddingBottom})}}o.previousScrollTop=scrollTop};o.onScroll(o);$(document).on('scroll.'+o.options.namespace,function(o){return function(){o.onScroll(o)}}(o));$(window).on('resize.'+o.options.namespace,function(o){return function(){o.stickySidebar.css({'position':'static'});o.onScroll(o)}}(o));if(typeof ResizeSensor!=='undefined'){new ResizeSensor(o.stickySidebar[0],function(o){return function(){o.onScroll(o)}}(o))}function resetSidebar(){o.fixedScrollTop=0;o.sidebar.css({'min-height':'1px'});o.stickySidebar.css({'position':'static','width':'','transform':'none'})}function getClearedHeight(e){var height=e.height();e.children().each(function(){height=Math.max(height,$(this).height())});return height}})}function getWidthForObject(object){var width;try{width=object[0].getBoundingClientRect().width}catch(err){}if(typeof width==="undefined"){width=object.width()}return width}return this}})(jQuery);
!function(a){a.fn.menuuzumcu=function(){return this.each(function(){var $t=a(this),b=$t.find('.LinkList ul > li').children('a'),c=b.length;for(var i=0;i<c;i++){var d=b.eq(i),h=d.text();if(h.charAt(0)!=='_'){var e=b.eq(i+1),j=e.text();if(j.charAt(0)==='_'){var m=d.parent();m.append('<ul class="sub-menu m-sub"/>');}}if(h.charAt(0)==='_'){d.text(h.replace('_',''));d.parent().appendTo(m.children('.sub-menu'));}}for(var i=0;i<c;i++){var f=b.eq(i),k=f.text();if(k.charAt(0)!=='_'){var g=b.eq(i+1),l=g.text();if(l.charAt(0)==='_'){var n=f.parent();n.append('<ul class="sub-menu2 m-sub"/>');}}if(k.charAt(0)==='_'){f.text(k.replace('_',''));f.parent().appendTo(n.children('.sub-menu2'));}}$t.find('.LinkList ul li ul').parent('li').addClass('has-sub');});}}(jQuery);
!function(a){a.fn.lazyuzumcu=function(){return this.each(function(){var t=a(this),dImg=t.attr('data-image'),iWid=Math.round(t.width()),iHei=Math.round(t.height()),iSiz='w'+iWid+'-h'+iHei+'-p-k-no-nu',img='';if(dImg.match('/s72-c')){img=dImg.replace('/s72-c','/'+iSiz);}else if(dImg.match('/w72-h')){img=dImg.replace('/w72-h72-p-k-no-nu','/'+iSiz);}else if(dImg.match('=w72-h')){img=dImg.replace('=w72-h72-p-k-no-nu','='+iSiz);}else{img=dImg;}
a(window).on('load resize scroll',lazyOnScroll);function lazyOnScroll(){var wHeight=a(window).height(),scrTop=a(window).scrollTop(),offTop=t.offset().top;if(scrTop+wHeight>offTop){var n=new Image();n.onload=function(){t.attr('style','background-image:url('+this.src+')').addClass('lazy-uzumcu');},n.src=img;}}
lazyOnScroll();});}}(jQuery);
(function($){$.fn.replaceText=function(b,a,c){return this.each(function(){var f=this.firstChild,g,e,d=[];if(f){do{if(f.nodeType===3){g=f.nodeValue;e=g.replace(b,a);if(e!==g){if(!c&&/</.test(e)){$(f).before(e);d.push(f)}else{f.nodeValue=e}}}}while(f=f.nextSibling)}d.length&&$(d).remove()})}})(jQuery);
function regxuzumcu(t){return String(t.match(/[^{\}]+(?=})/g)).trim()}function msgError(){return'<span class="no-posts"><strong>Hata:</strong> Sonuç bulunamadı.</span>'}function msgServerError(){return'<div class="no-posts error-503"><h2>Haberler yüklenirken hata oluştu! Daha sonra tekrar ziyaret edin.</h2></div>'}function beforeLoader(){return'<div class="loader"/>'}function getFeedUrl(t,i,e){return"comments"===e&&"list"==t?"/feeds/comments/default?alt=json&max-results="+i:"/feeds/posts/default/-/"+e+"?alt=json&max-results="+i}function getPostLink(t,i){for(var e=0;e<t[i].link.length;e++)if("alternate"==t[i].link[e].rel){var o=t[i].link[e].href;break}return o}function getPostTitle(t,i){return t[i].title.$t}function getFirstImage(t,i){var e=$("<div>").html(t).find("img:first").attr("src"),o=e.lastIndexOf("/")||0,a=e.lastIndexOf("/",o-1)||0,t=e.substring(0,a),a=e.substring(a,o),o=e.substring(o);return(a.match(/\/s[0-9]+/g)||a.match(/\/w[0-9]+/g)||"/d"==a)&&(a="/w72-h72-p-k-no-nu"),t+a+o}function getPostImage(t,i,e){var o=t[i].content.$t,i=t[i].media$thumbnail?t[i].media$thumbnail.url:"https://1.bp.blogspot.com/-gGWM9Zn3xeo/X8-Zjm9dvSI/AAAAAAAACbE/Z_bUboz2CIIExLEWoigcmLTbycjdLf-CACLcBGAsYHQ/s72-c/resim-yok-uzumcu-baba.png";return-1<o.indexOf(o.match(/<iframe(?:.+)?src=(?:.+)?(?:www.youtube.com)/g))?!(-1<o.indexOf("<img"))||o.indexOf(o.match(/<iframe(?:.+)?src=(?:.+)?(?:www.youtube.com)/g))<o.indexOf("<img")?i.replace("/default.","/0."):getFirstImage(o):-1<o.indexOf("<img")?getFirstImage(o):"https://1.bp.blogspot.com/-gGWM9Zn3xeo/X8-Zjm9dvSI/AAAAAAAACbE/Z_bUboz2CIIExLEWoigcmLTbycjdLf-CACLcBGAsYHQ/s72-c/resim-yok-uzumcu-baba.png"}function getPostAuthor(t,i){i=t[i].author[0].name.$t,i="true"==messages.postAuthor?'<span class="entry-author">'+i+"</span>":"";return i}function getPostDate(t,i){var e=t[i].published.$t,o=e.substring(0,4),t=e.substring(5,7),i=e.substring(8,10),o=monthFormat[parseInt(t,10)-1]+" "+i+", "+o,o="true"==messages.postDate?'<span class="entry-time"><time class="published" datetime="'+e+'">'+o+"</time></span>":"";return o}function getPostMeta(t,i){t="true"==messages.postAuthor||"true"==messages.postDate?'<div class="entry-meta">'+t+i+"</div>":"",i="true"==messages.postDate?'<div class="entry-meta">'+i+"</div>":"";return[t,i]}function getPostLabel(t,i){i=null!=t[i].category?'<span class="entry-category">'+t[i].category[0].term+"</span>":"";return i}function getCustomStyle(t,i,e){var o;return""!=e?"featured"==t&&(o=".id-"+t+"-"+i+" .entry-category{background-color:"+e+";color:#fff}.id-"+t+"-"+i+" .loader:after{border-color:"+e+";border-right-color:rgba(155,155,155,0.2)}"):o="",o}!function(b){b.fn.theiaStickySidebar=function(t){var i,e;function o(t,i){return!0===t.initialized||!(b("body").width()<t.minWidth)&&(i=i,(u=t).initialized=!0,0===b("#theia-sticky-sidebar-stylesheet-"+u.namespace).length&&b("head").append(b('<style id="theia-sticky-sidebar-stylesheet-'+u.namespace+'">.theiaStickySidebar:after {content: ""; display: table; clear: both;}</style>')),i.each(function(){var e,t={};t.sidebar=b(this),t.options=u||{},t.container=b(t.options.containerSelector),0==t.container.length&&(t.container=t.sidebar.parent()),t.sidebar.parents().css("-webkit-transform","none"),t.sidebar.css({position:t.options.defaultPosition,overflow:"visible","-webkit-box-sizing":"border-box","-moz-box-sizing":"border-box","box-sizing":"border-box"}),t.stickySidebar=t.sidebar.find(".theiaStickySidebar"),0==t.stickySidebar.length&&(e=/(?:text|application)\/(?:x-)?(?:javascript|ecmascript)/i,t.sidebar.find("script").filter(function(t,i){return 0===i.type.length||i.type.match(e)}).remove(),t.stickySidebar=b("<div>").addClass("theiaStickySidebar").append(t.sidebar.children()),t.sidebar.append(t.stickySidebar)),t.marginBottom=parseInt(t.sidebar.css("margin-bottom")),t.paddingTop=parseInt(t.sidebar.css("padding-top")),t.paddingBottom=parseInt(t.sidebar.css("padding-bottom"));var i,o,a,n=t.stickySidebar.offset().top,s=t.stickySidebar.outerHeight();function p(){t.fixedScrollTop=0,t.sidebar.css({"min-height":"1px"}),t.stickySidebar.css({position:"static",width:"",transform:"none"})}t.stickySidebar.css("padding-top",1),t.stickySidebar.css("padding-bottom",1),n-=t.stickySidebar.offset().top,s=t.stickySidebar.outerHeight()-s-n,0==n?(t.stickySidebar.css("padding-top",0),t.stickySidebarPaddingTop=0):t.stickySidebarPaddingTop=1,0==s?(t.stickySidebar.css("padding-bottom",0),t.stickySidebarPaddingBottom=0):t.stickySidebarPaddingBottom=1,t.previousScrollTop=null,t.fixedScrollTop=0,p(),t.onScroll=function(t){if(t.stickySidebar.is(":visible"))if(b("body").width()<t.options.minWidth)p();else{if(t.options.disableOnResponsiveLayouts)if(t.sidebar.outerWidth("none"==t.sidebar.css("float"))+50>t.container.width())return void p();var i,e,o,a,n,s,r,d,c=b(document).scrollTop(),l="static";c>=t.sidebar.offset().top+(t.paddingTop-t.options.additionalMarginTop)&&(e=t.paddingTop+u.additionalMarginTop,n=t.paddingBottom+t.marginBottom+u.additionalMarginBottom,o=t.sidebar.offset().top,a=t.sidebar.offset().top+(s=t.container,r=s.height(),s.children().each(function(){r=Math.max(r,b(this).height())}),r),i=0+u.additionalMarginTop,s=t.stickySidebar.outerHeight()+e+n<b(window).height()?i+t.stickySidebar.outerHeight():b(window).height()-t.marginBottom-t.paddingBottom-u.additionalMarginBottom,e=o-c+t.paddingTop,n=a-c-t.paddingBottom-t.marginBottom,o=t.stickySidebar.offset().top-c,a=t.previousScrollTop-c,"fixed"==t.stickySidebar.css("position")&&"modern"==t.options.sidebarBehavior&&(o+=a),"stick-to-top"==t.options.sidebarBehavior&&(o=u.additionalMarginTop),"stick-to-bottom"==t.options.sidebarBehavior&&(o=s-t.stickySidebar.outerHeight()),o=0<a?Math.min(o,i):Math.max(o,s-t.stickySidebar.outerHeight()),o=Math.max(o,e),o=Math.min(o,n-t.stickySidebar.outerHeight()),l=((n=t.container.height()==t.stickySidebar.outerHeight())||o!=i)&&(n||o!=s-t.stickySidebar.outerHeight())?c+o-t.sidebar.offset().top-t.paddingTop<=u.additionalMarginTop?"static":"absolute":"fixed"),"fixed"==l?(d=b(document).scrollLeft(),t.stickySidebar.css({position:"fixed",width:h(t.stickySidebar)+"px",transform:"translateY("+o+"px)",left:t.sidebar.offset().left+parseInt(t.sidebar.css("padding-left"))-d+"px",top:"0px"})):"absolute"==l?(d={},"absolute"!=t.stickySidebar.css("position")&&(d.position="absolute",d.transform="translateY("+(c+o-t.sidebar.offset().top-t.stickySidebarPaddingTop-t.stickySidebarPaddingBottom)+"px)",d.top="0px"),d.width=h(t.stickySidebar)+"px",d.left="",t.stickySidebar.css(d)):"static"==l&&p(),"static"!=l&&1==t.options.updateSidebarHeight&&t.sidebar.css({"min-height":t.stickySidebar.outerHeight()+t.stickySidebar.offset().top-t.sidebar.offset().top+t.paddingBottom}),t.previousScrollTop=c}},t.onScroll(t),b(document).on("scroll."+t.options.namespace,(i=t,function(){i.onScroll(i)})),b(window).on("resize."+t.options.namespace,(o=t,function(){o.stickySidebar.css({position:"static"}),o.onScroll(o)})),"undefined"!=typeof ResizeSensor&&new ResizeSensor(t.stickySidebar[0],(a=t,function(){a.onScroll(a)}))}),!0);var u}function h(t){var i;try{i=t[0].getBoundingClientRect().width}catch(t){}return void 0===i&&(i=t.width()),i}return(t=b.extend({containerSelector:"",additionalMarginTop:0,additionalMarginBottom:0,updateSidebarHeight:!0,minWidth:0,disableOnResponsiveLayouts:!0,sidebarBehavior:"modern",defaultPosition:"relative",namespace:"TSS"},t)).additionalMarginTop=parseInt(t.additionalMarginTop)||0,t.additionalMarginBottom=parseInt(t.additionalMarginBottom)||0,o(i=t,e=this)||(console.log("TSS: Body width smaller than options.minWidth. Init is delayed."),b(document).on("scroll."+i.namespace,function(i,e){return function(t){o(i,e)&&b(this).unbind(t)}}(i,e)),b(window).on("resize."+i.namespace,function(i,e){return function(t){o(i,e)&&b(this).unbind(t)}}(i,e))),this}}(jQuery),function(l){l.fn.menuuzumcu=function(){return this.each(function(){for(var t=l(this),i=t.find(".LinkList ul > li").children("a"),e=i.length,o=0;o<e;o++){var a,n=i.eq(o),s=n.text();"_"!==s.charAt(0)&&"_"===i.eq(o+1).text().charAt(0)&&(a=n.parent()).append('<ul class="sub-menu m-sub"/>'),"_"===s.charAt(0)&&(n.text(s.replace("_","")),n.parent().appendTo(a.children(".sub-menu")))}for(o=0;o<e;o++){var r,d=i.eq(o),c=d.text();"_"!==c.charAt(0)&&"_"===i.eq(o+1).text().charAt(0)&&(r=d.parent()).append('<ul class="sub-menu2 m-sub"/>'),"_"===c.charAt(0)&&(d.text(c.replace("_","")),d.parent().appendTo(r.children(".sub-menu2")))}t.find(".LinkList ul li ul").parent("li").addClass("has-sub")})}}(jQuery),function(n){n.fn.lazyuzumcu=function(){return this.each(function(){var e=n(this),t=e.attr("data-image"),i="w"+Math.round(e.width())+"-h"+Math.round(e.height())+"-p-k-no-nu",o="";function a(){var t=n(window).height(),i=n(window).scrollTop();e.offset().top<i+t&&((t=new Image).onload=function(){e.attr("style","background-image:url("+this.src+")").addClass("lazy-uzumcu")},t.src=o)}o=t.match("/s72-c")?t.replace("/s72-c","/"+i):t.match("/w72-h")?t.replace("/w72-h72-p-k-no-nu","/"+i):t.match("=w72-h")?t.replace("=w72-h72-p-k-no-nu","="+i):t,n(window).on("load resize scroll",a),a()})}}(jQuery),function(r){r.fn.replaceText=function(a,n,s){return this.each(function(){var t,i,e=this.firstChild,o=[];if(e)for(;3===e.nodeType&&(i=(t=e.nodeValue).replace(a,n))!==t&&(!s&&/</.test(i)?(r(e).before(i),o.push(e)):e.nodeValue=i),e=e.nextSibling;);o.length&&r(o).remove()})}}(jQuery),function(b){b.fn.theiaStickySidebar=function(t){function i(t,i){return!0===t.initialized||!(b("body").width()<t.minWidth)&&(i=i,(u=t).initialized=!0,0===b("#theia-sticky-sidebar-stylesheet-"+u.namespace).length&&b("head").append(b('<style id="theia-sticky-sidebar-stylesheet-'+u.namespace+'">.theiaStickySidebar:after {content: ""; display: table; clear: both;}</style>')),i.each(function(){var e,t={};t.sidebar=b(this),t.options=u||{},t.container=b(t.options.containerSelector),0==t.container.length&&(t.container=t.sidebar.parent()),t.sidebar.parents().css("-webkit-transform","none"),t.sidebar.css({position:t.options.defaultPosition,overflow:"visible","-webkit-box-sizing":"border-box","-moz-box-sizing":"border-box","box-sizing":"border-box"}),t.stickySidebar=t.sidebar.find(".theiaStickySidebar"),0==t.stickySidebar.length&&(e=/(?:text|application)\/(?:x-)?(?:javascript|ecmascript)/i,t.sidebar.find("script").filter(function(t,i){return 0===i.type.length||i.type.match(e)}).remove(),t.stickySidebar=b("<div>").addClass("theiaStickySidebar").append(t.sidebar.children()),t.sidebar.append(t.stickySidebar)),t.marginBottom=parseInt(t.sidebar.css("margin-bottom")),t.paddingTop=parseInt(t.sidebar.css("padding-top")),t.paddingBottom=parseInt(t.sidebar.css("padding-bottom"));var i,o,a,n=t.stickySidebar.offset().top,s=t.stickySidebar.outerHeight();function p(){t.fixedScrollTop=0,t.sidebar.css({"min-height":"1px"}),t.stickySidebar.css({position:"static",width:"",transform:"none"})}t.stickySidebar.css("padding-top",1),t.stickySidebar.css("padding-bottom",1),n-=t.stickySidebar.offset().top,s=t.stickySidebar.outerHeight()-s-n,0==n?(t.stickySidebar.css("padding-top",0),t.stickySidebarPaddingTop=0):t.stickySidebarPaddingTop=1,0==s?(t.stickySidebar.css("padding-bottom",0),t.stickySidebarPaddingBottom=0):t.stickySidebarPaddingBottom=1,t.previousScrollTop=null,t.fixedScrollTop=0,p(),t.onScroll=function(t){var i,e,o,a,n,s,r,d,c,l;t.stickySidebar.is(":visible")&&(b("body").width()<t.options.minWidth||t.options.disableOnResponsiveLayouts&&t.sidebar.outerWidth("none"==t.sidebar.css("float"))+50>t.container.width()?p():(c="static",(e=b(document).scrollTop())>=t.sidebar.offset().top+(t.paddingTop-t.options.additionalMarginTop)&&(n=t.paddingTop+u.additionalMarginTop,d=t.paddingBottom+t.marginBottom+u.additionalMarginBottom,s=t.sidebar.offset().top,r=t.sidebar.offset().top+(a=t.container,i=a.height(),a.children().each(function(){i=Math.max(i,b(this).height())}),i),o=0+u.additionalMarginTop,a=t.stickySidebar.outerHeight()+n+d<b(window).height()?o+t.stickySidebar.outerHeight():b(window).height()-t.marginBottom-t.paddingBottom-u.additionalMarginBottom,n=s-e+t.paddingTop,d=r-e-t.paddingBottom-t.marginBottom,s=t.stickySidebar.offset().top-e,r=t.previousScrollTop-e,"fixed"==t.stickySidebar.css("position")&&"modern"==t.options.sidebarBehavior&&(s+=r),"stick-to-top"==t.options.sidebarBehavior&&(s=u.additionalMarginTop),"stick-to-bottom"==t.options.sidebarBehavior&&(s=a-t.stickySidebar.outerHeight()),s=0<r?Math.min(s,o):Math.max(s,a-t.stickySidebar.outerHeight()),s=Math.max(s,n),s=Math.min(s,d-t.stickySidebar.outerHeight()),c=!(d=t.container.height()==t.stickySidebar.outerHeight())&&s==o||!d&&s==a-t.stickySidebar.outerHeight()?"fixed":e+s-t.sidebar.offset().top-t.paddingTop<=u.additionalMarginTop?"static":"absolute"),"fixed"==c?(l=b(document).scrollLeft(),t.stickySidebar.css({position:"fixed",width:h(t.stickySidebar)+"px",transform:"translateY("+s+"px)",left:t.sidebar.offset().left+parseInt(t.sidebar.css("padding-left"))-l+"px",top:"0px"})):"absolute"==c?(l={},"absolute"!=t.stickySidebar.css("position")&&(l.position="absolute",l.transform="translateY("+(e+s-t.sidebar.offset().top-t.stickySidebarPaddingTop-t.stickySidebarPaddingBottom)+"px)",l.top="0px"),l.width=h(t.stickySidebar)+"px",l.left="",t.stickySidebar.css(l)):"static"==c&&p(),"static"!=c&&1==t.options.updateSidebarHeight&&t.sidebar.css({"min-height":t.stickySidebar.outerHeight()+t.stickySidebar.offset().top-t.sidebar.offset().top+t.paddingBottom}),t.previousScrollTop=e))},t.onScroll(t),b(document).on("scroll."+t.options.namespace,(a=t,function(){a.onScroll(a)})),b(window).on("resize."+t.options.namespace,(o=t,function(){o.stickySidebar.css({position:"static"}),o.onScroll(o)})),"undefined"!=typeof ResizeSensor&&new ResizeSensor(t.stickySidebar[0],(i=t,function(){i.onScroll(i)}))}),1);var u}function h(t){var i;try{i=t[0].getBoundingClientRect().width}catch(t){}return void 0===i&&(i=t.width()),i}return(t=b.extend({containerSelector:"",additionalMarginTop:0,additionalMarginBottom:0,updateSidebarHeight:!0,minWidth:0,disableOnResponsiveLayouts:!0,sidebarBehavior:"modern",defaultPosition:"relative",namespace:"TSS"},t)).additionalMarginTop=parseInt(t.additionalMarginTop)||0,t.additionalMarginBottom=parseInt(t.additionalMarginBottom)||0,i(e=t,t=this)||(console.log("TSS: Body width smaller than options.minWidth. Init is delayed."),b(document).on("scroll."+e.namespace,(n=e,s=t,function(t){i(n,s)&&b(this).unbind(t)})),b(window).on("resize."+e.namespace,(o=e,a=t,function(t){i(o,a)&&b(this).unbind(t)}))),this;var e,o,a,n,s}}(jQuery),function(l){l.fn.menuuzumcu=function(){return this.each(function(){for(var t=l(this),i=t.find(".LinkList ul > li").children("a"),e=i.length,o=0;o<e;o++){var a,n=i.eq(o),s=n.text();"_"!==s.charAt(0)&&"_"===i.eq(o+1).text().charAt(0)&&(a=n.parent()).append('<ul class="sub-menu m-sub"/>'),"_"===s.charAt(0)&&(n.text(s.replace("_","")),n.parent().appendTo(a.children(".sub-menu")))}for(o=0;o<e;o++){var r,d=i.eq(o),c=d.text();"_"!==c.charAt(0)&&"_"===i.eq(o+1).text().charAt(0)&&(r=d.parent()).append('<ul class="sub-menu2 m-sub"/>'),"_"===c.charAt(0)&&(d.text(c.replace("_","")),d.parent().appendTo(r.children(".sub-menu2")))}t.find(".LinkList ul li ul").parent("li").addClass("has-sub")})}}(jQuery),function(n){n.fn.lazyuzumcu=function(){return this.each(function(){var i=n(this),t=i.attr("data-image"),e="w"+Math.round(i.width())+"-h"+Math.round(i.height())+"-p-k-no-nu",o="";function a(){var t=n(window).height();n(window).scrollTop()+t>i.offset().top&&((t=new Image).onload=function(){i.attr("style","background-image:url("+this.src+")").addClass("lazy-uzumcu")},t.src=o)}o=t.match("/s72-c")?t.replace("/s72-c","/"+e):t.match("/w72-h")?t.replace("/w72-h72-p-k-no-nu","/"+e):t.match("=w72-h")?t.replace("=w72-h72-p-k-no-nu","="+e):t,n(window).on("load resize scroll",a),a()})}}(jQuery),function(r){r.fn.replaceText=function(a,n,s){return this.each(function(){var t,i,e=this.firstChild,o=[];if(e)for(;3===e.nodeType&&(i=(t=e.nodeValue).replace(a,n))!==t&&(!s&&/</.test(i)?(r(e).before(i),o.push(e)):e.nodeValue=i),e=e.nextSibling;);o.length&&r(o).remove()})}}(jQuery),function(b){b.fn.theiaStickySidebar=function(t){function i(t,i){return!0===t.initialized||!(b("body").width()<t.minWidth)&&(i=i,(u=t).initialized=!0,0===b("#theia-sticky-sidebar-stylesheet-"+u.namespace).length&&b("head").append(b('<style id="theia-sticky-sidebar-stylesheet-'+u.namespace+'">.theiaStickySidebar:after {content: ""; display: table; clear: both;}</style>')),i.each(function(){var e,t={};t.sidebar=b(this),t.options=u||{},t.container=b(t.options.containerSelector),0==t.container.length&&(t.container=t.sidebar.parent()),t.sidebar.parents().css("-webkit-transform","none"),t.sidebar.css({position:t.options.defaultPosition,overflow:"visible","-webkit-box-sizing":"border-box","-moz-box-sizing":"border-box","box-sizing":"border-box"}),t.stickySidebar=t.sidebar.find(".theiaStickySidebar"),0==t.stickySidebar.length&&(e=/(?:text|application)\/(?:x-)?(?:javascript|ecmascript)/i,t.sidebar.find("script").filter(function(t,i){return 0===i.type.length||i.type.match(e)}).remove(),t.stickySidebar=b("<div>").addClass("theiaStickySidebar").append(t.sidebar.children()),t.sidebar.append(t.stickySidebar)),t.marginBottom=parseInt(t.sidebar.css("margin-bottom")),t.paddingTop=parseInt(t.sidebar.css("padding-top")),t.paddingBottom=parseInt(t.sidebar.css("padding-bottom"));var i,o,a,n=t.stickySidebar.offset().top,s=t.stickySidebar.outerHeight();function p(){t.fixedScrollTop=0,t.sidebar.css({"min-height":"1px"}),t.stickySidebar.css({position:"static",width:"",transform:"none"})}t.stickySidebar.css("padding-top",1),t.stickySidebar.css("padding-bottom",1),n-=t.stickySidebar.offset().top,s=t.stickySidebar.outerHeight()-s-n,0==n?(t.stickySidebar.css("padding-top",0),t.stickySidebarPaddingTop=0):t.stickySidebarPaddingTop=1,0==s?(t.stickySidebar.css("padding-bottom",0),t.stickySidebarPaddingBottom=0):t.stickySidebarPaddingBottom=1,t.previousScrollTop=null,t.fixedScrollTop=0,p(),t.onScroll=function(t){var i,e,o,a,n,s,r,d,c,l;t.stickySidebar.is(":visible")&&(b("body").width()<t.options.minWidth||t.options.disableOnResponsiveLayouts&&t.sidebar.outerWidth("none"==t.sidebar.css("float"))+50>t.container.width()?p():(c="static",(e=b(document).scrollTop())>=t.sidebar.offset().top+(t.paddingTop-t.options.additionalMarginTop)&&(n=t.paddingTop+u.additionalMarginTop,d=t.paddingBottom+t.marginBottom+u.additionalMarginBottom,s=t.sidebar.offset().top,r=t.sidebar.offset().top+(a=t.container,i=a.height(),a.children().each(function(){i=Math.max(i,b(this).height())}),i),o=0+u.additionalMarginTop,a=t.stickySidebar.outerHeight()+n+d<b(window).height()?o+t.stickySidebar.outerHeight():b(window).height()-t.marginBottom-t.paddingBottom-u.additionalMarginBottom,n=s-e+t.paddingTop,d=r-e-t.paddingBottom-t.marginBottom,s=t.stickySidebar.offset().top-e,r=t.previousScrollTop-e,"fixed"==t.stickySidebar.css("position")&&"modern"==t.options.sidebarBehavior&&(s+=r),"stick-to-top"==t.options.sidebarBehavior&&(s=u.additionalMarginTop),"stick-to-bottom"==t.options.sidebarBehavior&&(s=a-t.stickySidebar.outerHeight()),s=0<r?Math.min(s,o):Math.max(s,a-t.stickySidebar.outerHeight()),s=Math.max(s,n),s=Math.min(s,d-t.stickySidebar.outerHeight()),c=!(d=t.container.height()==t.stickySidebar.outerHeight())&&s==o||!d&&s==a-t.stickySidebar.outerHeight()?"fixed":e+s-t.sidebar.offset().top-t.paddingTop<=u.additionalMarginTop?"static":"absolute"),"fixed"==c?(l=b(document).scrollLeft(),t.stickySidebar.css({position:"fixed",width:h(t.stickySidebar)+"px",transform:"translateY("+s+"px)",left:t.sidebar.offset().left+parseInt(t.sidebar.css("padding-left"))-l+"px",top:"0px"})):"absolute"==c?(l={},"absolute"!=t.stickySidebar.css("position")&&(l.position="absolute",l.transform="translateY("+(e+s-t.sidebar.offset().top-t.stickySidebarPaddingTop-t.stickySidebarPaddingBottom)+"px)",l.top="0px"),l.width=h(t.stickySidebar)+"px",l.left="",t.stickySidebar.css(l)):"static"==c&&p(),"static"!=c&&1==t.options.updateSidebarHeight&&t.sidebar.css({"min-height":t.stickySidebar.outerHeight()+t.stickySidebar.offset().top-t.sidebar.offset().top+t.paddingBottom}),t.previousScrollTop=e))},t.onScroll(t),b(document).on("scroll."+t.options.namespace,(a=t,function(){a.onScroll(a)})),b(window).on("resize."+t.options.namespace,(o=t,function(){o.stickySidebar.css({position:"static"}),o.onScroll(o)})),"undefined"!=typeof ResizeSensor&&new ResizeSensor(t.stickySidebar[0],(i=t,function(){i.onScroll(i)}))}),1);var u}function h(t){var i;try{i=t[0].getBoundingClientRect().width}catch(t){}return void 0===i&&(i=t.width()),i}return(t=b.extend({containerSelector:"",additionalMarginTop:0,additionalMarginBottom:0,updateSidebarHeight:!0,minWidth:0,disableOnResponsiveLayouts:!0,sidebarBehavior:"modern",defaultPosition:"relative",namespace:"TSS"},t)).additionalMarginTop=parseInt(t.additionalMarginTop)||0,t.additionalMarginBottom=parseInt(t.additionalMarginBottom)||0,i(e=t,t=this)||(console.log("TSS: Body width smaller than options.minWidth. Init is delayed."),b(document).on("scroll."+e.namespace,(n=e,s=t,function(t){i(n,s)&&b(this).unbind(t)})),b(window).on("resize."+e.namespace,(o=e,a=t,function(t){i(o,a)&&b(this).unbind(t)}))),this;var e,o,a,n,s}}(jQuery),function(l){l.fn.menuuzumcu=function(){return this.each(function(){for(var t=l(this),i=t.find(".LinkList ul > li").children("a"),e=i.length,o=0;o<e;o++){var a,n=i.eq(o),s=n.text();"_"!==s.charAt(0)&&"_"===i.eq(o+1).text().charAt(0)&&(a=n.parent()).append('<ul class="sub-menu m-sub"/>'),"_"===s.charAt(0)&&(n.text(s.replace("_","")),n.parent().appendTo(a.children(".sub-menu")))}for(o=0;o<e;o++){var r,d=i.eq(o),c=d.text();"_"!==c.charAt(0)&&"_"===i.eq(o+1).text().charAt(0)&&(r=d.parent()).append('<ul class="sub-menu2 m-sub"/>'),"_"===c.charAt(0)&&(d.text(c.replace("_","")),d.parent().appendTo(r.children(".sub-menu2")))}t.find(".LinkList ul li ul").parent("li").addClass("has-sub")})}}(jQuery),function(n){n.fn.lazyuzumcu=function(){return this.each(function(){var i=n(this),t=i.attr("data-image"),e="w"+Math.round(i.width())+"-h"+Math.round(i.height())+"-p-k-no-nu",o="";function a(){var t=n(window).height();n(window).scrollTop()+t>i.offset().top&&((t=new Image).onload=function(){i.attr("style","background-image:url("+this.src+")").addClass("lazy-uzumcu")},t.src=o)}o=t.match("/s72-c")?t.replace("/s72-c","/"+e):t.match("/w72-h")?t.replace("/w72-h72-p-k-no-nu","/"+e):t.match("=w72-h")?t.replace("=w72-h72-p-k-no-nu","="+e):t,n(window).on("load resize scroll",a),a()})}}(jQuery),function(r){r.fn.replaceText=function(a,n,s){return this.each(function(){var t,i,e=this.firstChild,o=[];if(e)for(;3===e.nodeType&&(i=(t=e.nodeValue).replace(a,n))!==t&&(!s&&/</.test(i)?(r(e).before(i),o.push(e)):e.nodeValue=i),e=e.nextSibling;);o.length&&r(o).remove()})}}(jQuery),$("#main-menu").menuuzumcu(),$("#main-menu .widget").addClass("show-menu"),$(".search-toggle").on("click",function(){$("body").toggleClass("search-active")}),$("#social-counter ul.social-icons li a").each(function(){var t=$(this),i=t.find(".count"),e=t.data("content").trim().split("$"),o=e[0],e=e[1];t.attr("href",o),i.text(e)}),$(".avatar-image-container img").attr("src",function(t,i){return(i=i.replace("//uzumcubaba.github.io/blank.gif","//4.bp.blogspot.com/-oSjP8F09qxo/Wy1J9dp7b0I/AAAAAAAACF0/ggcRfLCFQ9s2SSaeL9BFSE2wyTYzQaTyQCK4BGAYYCw/s35-r/avatar.jpg")).replace("//uzumcubaba.github.io/blank.gif","//4.bp.blogspot.com/-oSjP8F09qxo/Wy1J9dp7b0I/AAAAAAAACF0/ggcRfLCFQ9s2SSaeL9BFSE2wyTYzQaTyQCK4BGAYYCw/s35-r/avatar.jpg")}),$(".post-body a").each(function(){var t=$(this),i=t.text().trim(),e=i.split("/"),o=e[0],a=e[1],e=e.pop();i.match("button")&&(t.addClass("button").text(o),"button"!=a&&t.addClass(a),"button"!=e&&t.addClass("colored-button").css({"background-color":e}))}),$(".share-links .window-uzumcu,.entry-share .window-uzumcu").on("click",function(){var t=$(this),i=t.data("url"),e=t.data("width"),o=t.data("height"),a=window.screen.width,t=window.screen.height,a=Math.round(a/2-e/2),t=Math.round(t/2-o/2);window.open(i,"_blank","scrollbars=yes,resizable=yes,toolbar=no,location=yes,width="+e+",height="+o+",left="+a+",top="+t).focus()}),$(".share-links").each(function(){var t=$(this);t.find(".show-hid a").on("click",function(){t.toggleClass("show-hidden")})}),$(".about-author .author-description span a").each(function(){var t=$(this),i=t.text().trim(),e=t.attr("href");t.replaceWith('<li class="'+i+'"><a href="'+e+'" title="'+i+'" target="_blank"/></li>'),$(".author-description").append($(".author-description span li")),$(".author-description").addClass("show-icons")}),$(".blog-post-comments").each(function(){var t=$(this);t.addClass("comments-system-blogger").show(),$(".entry-meta .entry-comments-link").addClass("show");var i=t.find(".comments .toplevel-thread > ol > .comment .comment-actions .comment-reply"),e=t.find(".comments .toplevel-thread > #top-continue");i.on("click",function(){e.show()}),e.on("click",function(){e.hide()})}),$(function(){$(".index-post .entry-image-link .entry-thumb, .PopularPosts .entry-image-link .entry-thumb, .FeaturedPost .entry-image-link .entry-thumb,.about-author .author-avatar").lazyuzumcu(),$(".mobile-logo").each(function(){var t=$(this),i=$("#main-logo .header-widget a").clone();i.find("#h1-tag").remove(),i.appendTo(t)}),$("#mobile-menu").each(function(){var t=$(this),i=$("#main-menu-nav").clone();i.attr("id","main-mobile-nav"),i.appendTo(t),$(".show-mobile-menu, .hide-mobile-menu, .overlay").on("click",function(){$("body").toggleClass("nav-active")}),$(".mobile-menu .has-sub").append('<div class="submenu-toggle"/>'),$(".mobile-menu ul li .submenu-toggle").on("click",function(t){$(this).parent().hasClass("has-sub")&&(t.preventDefault(),($(this).parent().hasClass("show")?$(this).parent().removeClass("show").find("> .m-sub"):$(this).parent().addClass("show").children(".m-sub")).slideToggle(170))})}),$(".social-mobile").each(function(){var t=$(this);$("#navbar-social ul.social").clone().appendTo(t)}),$("#header-wrapper .headeruzumcu").each(function(){var i=$(this),e=$(document).scrollTop(),t=i.offset().top,o=i.height(),a=t+o;$(window).scroll(function(){var t=$(document).scrollTop();t<$("#footer-wrapper").offset().top-o&&(a<t?i.addClass("is-fixed"):t<=0&&i.removeClass("is-fixed"),e<t?i.removeClass("show"):i.addClass("show"),e=$(document).scrollTop())})}),$("#main-wrapper,#sidebar-wrapper").each(function(){$(this).theiaStickySidebar({additionalMarginTop:90,additionalMarginBottom:30})}),$(".back-top").each(function(){var t=$(this);$(window).on("scroll",function(){100<=$(this).scrollTop()?t.fadeIn(250):t.fadeOut(250),t.offset().top>=$("#footer-wrapper").offset().top-32?t.addClass("on-footer"):t.removeClass("on-footer")}),t.click(function(){$("html, body").animate({scrollTop:0},500)})}),$("p.comment-content").each(function(){var t=$(this);t.replaceText(/(https:\/\/\S+(\.png|\.jpeg|\.jpg|\.gif))/g,'<img src="$1"/>'),t.replaceText(/(?:https:\/\/)?(?:www\.)?(?:youtube\.com)\/(?:watch\?v=)?(.+)/g,'<iframe id="youtube" width="100%" height="358" src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>')}),$("#load-more-link").each(function(){var e=$(this).data("load");e&&$("#load-more-link").show(),$("#load-more-link").on("click",function(t){$("#load-more-link").hide(),$.ajax({url:e,success:function(t){var i=$(t).find(".blog-posts");i.find(".index-post").addClass("post-animated post-fadeInUp"),$(".blog-posts").append(i.html()),(e=$(t).find("#load-more-link").data("load"))?$("#load-more-link").show():($("#load-more-link").hide(),$("#blog-pager .no-more").addClass("show")),$(".index-post .entry-image-link .entry-thumb").lazyuzumcu()},beforeSend:function(){$("#blog-pager .loading").show()},complete:function(){$("#blog-pager .loading").hide()}}),t.preventDefault()})})});
