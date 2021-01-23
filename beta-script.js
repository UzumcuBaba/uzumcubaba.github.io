(function($) {
  $.fn.theiaStickySidebar = function(options) {
    var defaults = {
      'containerSelector': '',
      'additionalMarginTop': 0,
      'additionalMarginBottom': 0,
      'updateSidebarHeight': true,
      'minWidth': 0,
      'disableOnResponsiveLayouts': true,
      'sidebarBehavior': 'modern',
      'defaultPosition': 'relative',
      'namespace': 'TSS'
    };
    options = $.extend(defaults, options);
    options.additionalMarginTop = parseInt(options.additionalMarginTop) || 0;
    options.additionalMarginBottom = parseInt(options.additionalMarginBottom) || 0;
    tryInitOrHookIntoEvents(options, this);

    function tryInitOrHookIntoEvents(options, $that) {
      var success = tryInit(options, $that);
      if (!success) {
        console.log('TSS: Body width smaller than options.minWidth. Init is delayed.');
        $(document).on('scroll.' + options.namespace, function(options, $that) {
          return function(evt) {
            var success = tryInit(options, $that);
            if (success) {
              $(this).unbind(evt);
            }
          };
        }(options, $that));
        $(window).on('resize.' + options.namespace, function(options, $that) {
          return function(evt) {
            var success = tryInit(options, $that);
            if (success) {
              $(this).unbind(evt);
            }
          };
        }(options, $that));
      }
    }

    function tryInit(options, $that) {
      if (options.initialized === true) {
        return true;
      }
      if ($('body').width() < options.minWidth) {
        return false;
      }
      init(options, $that);
      return true;
    }

    function init(options, $that) {
      options.initialized = true;
      var existingStylesheet = $('#theia-sticky-sidebar-stylesheet-' + options.namespace);
      if (existingStylesheet.length === 0) {
        $('head').append($('<style id="theia-sticky-sidebar-stylesheet-' + options.namespace + '">.theiaStickySidebar:after {content: ""; display: table; clear: both;}</style>'));
      }
      $that.each(function() {
        var o = {};
        o.sidebar = $(this);
        o.options = options || {};
        o.container = $(o.options.containerSelector);
        if (o.container.length === 0) {
          o.container = o.sidebar.parent();
        }
        o.sidebar.parents().css('-webkit-transform', 'none');
        o.sidebar.css({
          'position': o.options.defaultPosition,
          'overflow': 'visible',
          '-webkit-box-sizing': 'border-box',
          '-moz-box-sizing': 'border-box',
          'box-sizing': 'border-box'
        });
        o.stickySidebar = o.sidebar.find('.theiaStickySidebar');
        if (o.stickySidebar.length === 0) {
          var javaScriptMIMETypes = /(?:text|application)\/(?:x-)?(?:javascript|ecmascript)/i;
          o.sidebar.find('script').filter(function(index, script) {
            return script.type.length === 0 || script.type.match(javaScriptMIMETypes);
          }).remove();
          o.stickySidebar = $('<div>').addClass('theiaStickySidebar').append(o.sidebar.children());
          o.sidebar.append(o.stickySidebar);
        }
        o.marginBottom = parseInt(o.sidebar.css('margin-bottom'));
        o.paddingTop = parseInt(o.sidebar.css('padding-top'));
        o.paddingBottom = parseInt(o.sidebar.css('padding-bottom'));
        var collapsedTopHeight = o.stickySidebar.offset().top;
        var collapsedBottomHeight = o.stickySidebar.outerHeight();
        o.stickySidebar.css('padding-top', 1);
        o.stickySidebar.css('padding-bottom', 1);
        collapsedTopHeight -= o.stickySidebar.offset().top;
        collapsedBottomHeight = o.stickySidebar.outerHeight() - collapsedBottomHeight - collapsedTopHeight;
        if (collapsedTopHeight === 0) {
          o.stickySidebar.css('padding-top', 0);
          o.stickySidebarPaddingTop = 0;
        } else {
          o.stickySidebarPaddingTop = 1;
        }
        if (collapsedBottomHeight === 0) {
          o.stickySidebar.css('padding-bottom', 0);
          o.stickySidebarPaddingBottom = 0;
        } else {
          o.stickySidebarPaddingBottom = 1;
        }
        o.previousScrollTop = null;
        o.fixedScrollTop = 0;
        resetSidebar();
        o.onScroll = function(o) {
          if (!o.stickySidebar.is(":visible")) {
            return;
          }
          if ($('body').width() < o.options.minWidth) {
            resetSidebar();
            return;
          }
          if (o.options.disableOnResponsiveLayouts) {
            var sidebarWidth = o.sidebar.outerWidth(o.sidebar.css('float') == 'none');
            if (sidebarWidth + 50 > o.container.width()) {
              resetSidebar();
              return;
            }
          }
          var scrollTop = $(document).scrollTop();
          var position = 'static';
          if (scrollTop >= o.sidebar.offset().top + (o.paddingTop - o.options.additionalMarginTop)) {
            var offsetTop = o.paddingTop + options.additionalMarginTop;
            var offsetBottom = o.paddingBottom + o.marginBottom + options.additionalMarginBottom;
            var containerTop = o.sidebar.offset().top;
            var containerBottom = o.sidebar.offset().top + getClearedHeight(o.container);
            var windowOffsetTop = 0 + options.additionalMarginTop;
            var windowOffsetBottom;
            var sidebarSmallerThanWindow = (o.stickySidebar.outerHeight() + offsetTop + offsetBottom) < $(window).height();
            if (sidebarSmallerThanWindow) {
              windowOffsetBottom = windowOffsetTop + o.stickySidebar.outerHeight();
            } else {
              windowOffsetBottom = $(window).height() - o.marginBottom - o.paddingBottom - options.additionalMarginBottom;
            }
            var staticLimitTop = containerTop - scrollTop + o.paddingTop;
            var staticLimitBottom = containerBottom - scrollTop - o.paddingBottom - o.marginBottom;
            var top = o.stickySidebar.offset().top - scrollTop;
            var scrollTopDiff = o.previousScrollTop - scrollTop;
            if (o.stickySidebar.css('position') == 'fixed') {
              if (o.options.sidebarBehavior == 'modern') {
                top += scrollTopDiff;
              }
            }
            if (o.options.sidebarBehavior == 'stick-to-top') {
              top = options.additionalMarginTop;
            }
            if (o.options.sidebarBehavior == 'stick-to-bottom') {
              top = windowOffsetBottom - o.stickySidebar.outerHeight();
            }
            if (scrollTopDiff > 0) {
              top = Math.min(top, windowOffsetTop);
            } else {
              top = Math.max(top, windowOffsetBottom - o.stickySidebar.outerHeight());
            }
            top = Math.max(top, staticLimitTop);
            top = Math.min(top, staticLimitBottom - o.stickySidebar.outerHeight());
            var sidebarSameHeightAsContainer = o.container.height() == o.stickySidebar.outerHeight();
            if (!sidebarSameHeightAsContainer && top == windowOffsetTop) {
              position = 'fixed';
            } else if (!sidebarSameHeightAsContainer && top == windowOffsetBottom - o.stickySidebar.outerHeight()) {
              position = 'fixed';
            } else if (scrollTop + top - o.sidebar.offset().top - o.paddingTop <= options.additionalMarginTop) {
              position = 'static';
            } else {
              position = 'absolute';
            }
          }
          if (position == 'fixed') {
            var scrollLeft = $(document).scrollLeft();
            o.stickySidebar.css({
              'position': 'fixed',
              'width': getWidthForObject(o.stickySidebar) + 'px',
              'transform': 'translateY(' + top + 'px)',
              'left': (o.sidebar.offset().left + parseInt(o.sidebar.css('padding-left')) - scrollLeft) + 'px',
              'top': '0px'
            });
          } else if (position == 'absolute') {
            var css = {};
            if (o.stickySidebar.css('position') != 'absolute') {
              css.position = 'absolute';
              css.transform = 'translateY(' + (scrollTop + top - o.sidebar.offset().top - o.stickySidebarPaddingTop - o.stickySidebarPaddingBottom) + 'px)';
              css.top = '0px';
            }
            css.width = getWidthForObject(o.stickySidebar) + 'px';
            css.left = '';
            o.stickySidebar.css(css);
          } else if (position == 'static') {
            resetSidebar();
          }
          if (position != 'static') {
            if (o.options.updateSidebarHeight === true) {
              o.sidebar.css({
                'min-height': o.stickySidebar.outerHeight() + o.stickySidebar.offset().top - o.sidebar.offset().top + o.paddingBottom
              });
            }
          }
          o.previousScrollTop = scrollTop;
        };
        o.onScroll(o);
        $(document).on('scroll.' + o.options.namespace, function(o) {
          return function() {
            o.onScroll(o);
          };
        }(o));
        $(window).on('resize.' + o.options.namespace, function(o) {
          return function() {
            o.stickySidebar.css({
              'position': 'static'
            });
            o.onScroll(o);
          };
        }(o));
        if (typeof ResizeSensor !== 'undefined') {
          new ResizeSensor(o.stickySidebar[0], function(o) {
            return function() {
              o.onScroll(o);
            };
          }(o));
        }

        function resetSidebar() {
          o.fixedScrollTop = 0;
          o.sidebar.css({
            'min-height': '1px'
          });
          o.stickySidebar.css({
            'position': 'static',
            'width': '',
            'transform': 'none'
          });
        }

        function getClearedHeight(e) {
          var height = e.height();
          e.children().each(function() {
            height = Math.max(height, $(this).height());
          });
          return height;
        }
      });
    }

    function getWidthForObject(object) {
      var width;
      try {
        width = object[0].getBoundingClientRect().width;
      } catch (err) {}
      if (typeof width === "undefined") {
        width = object.width();
      }
      return width;
    }
    return this;
  };
})(jQuery);
! function(a) {
  a.fn.menuuzumcu = function() {
    return this.each(function() {
      var $t = a(this),
        b = $t.find('.LinkList ul > li').children('a'),
        c = b.length;
      for (var i = 0; i < c; i++) {
        var d = b.eq(i),
          h = d.text();
        if (h.charAt(0) !== '_') {
          var e = b.eq(i + 1),
            j = e.text();
          if (j.charAt(0) === '_') {
            var m = d.parent();
            m.append('<ul class="sub-menu m-sub"/>');
          }
        }
        if (h.charAt(0) === '_') {
          d.text(h.replace('_', ''));
          d.parent().appendTo(m.children('.sub-menu'));
        }
      }
      for (var i = 0; i < c; i++) {
        var f = b.eq(i),
          k = f.text();
        if (k.charAt(0) !== '_') {
          var g = b.eq(i + 1),
            l = g.text();
          if (l.charAt(0) === '_') {
            var n = f.parent();
            n.append('<ul class="sub-menu2 m-sub"/>');
          }
        }
        if (k.charAt(0) === '_') {
          f.text(k.replace('_', ''));
          f.parent().appendTo(n.children('.sub-menu2'));
        }
      }
      $t.find('.LinkList ul li ul').parent('li').addClass('has-sub');
    });
  };
}(jQuery);
! function(a) {
  a.fn.lazyuzumcu = function() {
    return this.each(function() {
      var t = a(this),
        dImg = t.attr('data-image'),
        iWid = Math.round(t.width()),
        iHei = Math.round(t.height()),
        iSiz = 'w' + iWid + '-h' + iHei + '-p-k-no-nu',
        img = '';
      if (dImg.match('/s72-c')) {
        img = dImg.replace('/s72-c', '/' + iSiz);
      } else if (dImg.match('/w72-h')) {
        img = dImg.replace('/w72-h72-p-k-no-nu', '/' + iSiz);
      } else if (dImg.match('=w72-h')) {
        img = dImg.replace('=w72-h72-p-k-no-nu', '=' + iSiz);
      } else {
        img = dImg;
      }
      a(window).on('load resize scroll', lazyOnScroll);

      function lazyOnScroll() {
        var wHeight = a(window).height(),
          scrTop = a(window).scrollTop(),
          offTop = t.offset().top;
        if (scrTop + wHeight > offTop) {
          var n = new Image();
          n.onload = function() {
            t.attr('style', 'background-image:url(' + this.src + ')').addClass('lazy-uzumcu');
          }, n.src = img;
        }
      }
      lazyOnScroll();
    });
  };
}(jQuery);
(function($) {
  $.fn.replaceText = function(b, a, c) {
    return this.each(function() {
      var f = this.firstChild,
        g, e, d = [];
      if (f) {
        do {
          if (f.nodeType === 3) {
            g = f.nodeValue;
            e = g.replace(b, a);
            if (e !== g) {
              if (!c && /</.test(e)) {
                $(f).before(e);
                d.push(f);
              } else {
                f.nodeValue = e;
              }
            }
          }
        } while (f = f.nextSibling);
      }
      d.length && $(d).remove();
    });
  };
})(jQuery);

function regxuzumcu(t) {
  return String(t.match(/[^{\}]+(?=})/g)).trim();
}

function msgError() {
  return '<span class="no-posts"><strong>Hata:</strong> Sonuç bulunamadı.</span>';
}

function msgServerError() {
  return '<div class="no-posts error-503"><h2>Haberler yüklenirken hata oluştu! Daha sonra tekrar ziyaret edin.</h2></div>';
}

function beforeLoader() {
  return '<div class="loader"/>';
}

function getFeedUrl(t, e, o) {
  var a = "";
  switch (o) {
    case "comments":
      a = "list" == t ? "/feeds/comments/default?alt=json&max-results=" + e : "/feeds/posts/default/-/" + o + "?alt=json&max-results=" + e;
      break;
    default:
      a = "/feeds/posts/default/-/" + o + "?alt=json&max-results=" + e;
  }
  return a;
}

function getPostLink(t, e) {
  for (var o = 0; o < t[e].link.length; o++)
    if ("alternate" == t[e].link[o].rel) {
      var a = t[e].link[o].href;
      break;
    } return a;
}

function getPostTitle(t, e) {
  return t[e].title.$t;
}

function getFirstImage(t, e) {
  var o = $("<div>").html(t).find("img:first").attr("src"),
    a = o.lastIndexOf("/") || 0,
    n = o.lastIndexOf("/", a - 1) || 0,
    s = o.substring(0, n),
    r = o.substring(n, a),
    i = o.substring(a);
  return (r.match(/\/s[0-9]+/g) || r.match(/\/w[0-9]+/g) || "/d" == r) && (r = "/w72-h72-p-k-no-nu"), s + r + i;
}

function getPostImage(t, e, o) {
  var a = t[e].content.$t;
  if (t[e].media$thumbnail) var n = t[e].media$thumbnail.url;
  else n = "https://1.bp.blogspot.com/-gGWM9Zn3xeo/X8-Zjm9dvSI/AAAAAAAACbE/Z_bUboz2CIIExLEWoigcmLTbycjdLf-CACLcBGAsYHQ/s72-c/resim-yok-uzumcu-baba.png";
  return a.indexOf(a.match(/<iframe(?:.+)?src=(?:.+)?(?:www.youtube.com)/g)) > -1 ? a.indexOf("<img") > -1 ? a.indexOf(a.match(/<iframe(?:.+)?src=(?:.+)?(?:www.youtube.com)/g)) < a.indexOf("<img") ? n.replace("/default.", "/0.") : getFirstImage(a) : n.replace("/default.", "/0.") : a.indexOf("<img") > -1 ? getFirstImage(a) : "https://1.bp.blogspot.com/-gGWM9Zn3xeo/X8-Zjm9dvSI/AAAAAAAACbE/Z_bUboz2CIIExLEWoigcmLTbycjdLf-CACLcBGAsYHQ/s72-c/resim-yok-uzumcu-baba.png";
}

function getPostAuthor(t, e) {
  var o = t[e].author[0].name.$t;
  if ("true" == messages.postAuthor) var a = '<span class="entry-author">' + o + "</span>";
  else a = "";
  return a;
}

function getPostDate(t, e) {
  var o = t[e].published.$t,
    a = o.substring(0, 4),
    n = o.substring(5, 7),
    s = o.substring(8, 10),
    r = monthFormat[parseInt(n, 10) - 1] + " " + s + ", " + a;
  if ("true" == messages.postDate) var i = '<span class="entry-time"><time class="published" datetime="' + o + '">' + r + "</time></span>";
  else i = "";
  return i;
}

function getPostMeta(t, e) {
  if ("true" == messages.postAuthor || "true" == messages.postDate) var o = '<div class="entry-meta">' + t + e + "</div>";
  else o = "";
  if ("true" == messages.postDate) var a = '<div class="entry-meta">' + e + "</div>";
  else a = "";
  return [o, a];
}

function getPostLabel(t, e) {
  if (null !== t[e].category) var o = '<span class="entry-category">' + t[e].category[0].term + "</span>";
  else o = "";
  return o;
}

function getCustomStyle(t, e, o) {
  if ("" !== o) {
    if ("featured" == t) var a = ".id-" + t + "-" + e + " .entry-category{background-color:" + o + ";color:#fff}.id-" + t + "-" + e + " .loader:after{border-color:" + o + ";border-right-color:rgba(155,155,155,0.2)}";
  } else a = "";
  return a;
}
$("#main-menu").menuuzumcu(), $("#main-menu .widget").addClass("show-menu"), $(".search-toggle").on("click", function() {
  $("body").toggleClass("search-active");
}), $(".blog-posts-title a.more,.related-title a.more").each(function() {
  var t = $(this),
    e = viewAllText;
  "" !== e && t.text(e);
}), $(".follow-by-email-text").each(function() {
  var t = $(this),
    e = followByEmailText;
  "" != e && t.text(e);
}), $("#social-counter ul.social-icons li a").each(function() {
  var t = $(this),
    e = t.find(".count"),
    o = t.data("content").trim().split("$"),
    a = o[0],
    n = o[1];
  t.attr("href", a), e.text(n);
}), $(".avatar-image-container img").attr("src", function(t, e) {
  return (e = e.replace("//uzumcubaba.github.io/blank.gif", "//4.bp.blogspot.com/-oSjP8F09qxo/Wy1J9dp7b0I/AAAAAAAACF0/ggcRfLCFQ9s2SSaeL9BFSE2wyTYzQaTyQCK4BGAYYCw/s35-r/avatar.jpg")).replace("//uzumcubaba.github.io/blank.gif", "//4.bp.blogspot.com/-oSjP8F09qxo/Wy1J9dp7b0I/AAAAAAAACF0/ggcRfLCFQ9s2SSaeL9BFSE2wyTYzQaTyQCK4BGAYYCw/s35-r/avatar.jpg");
}), $(".post-body a").each(function() {
  var t = $(this),
    e = t.text().trim(),
    o = e.split("/"),
    a = o[0],
    n = o[1],
    s = o.pop();
  e.match("button") && (t.addClass("button").text(a), "button" != n && t.addClass(n), "button" != s && t.addClass("colored-button").css({
    "background-color": s
  }));
}), $(".share-links .window-uzumcu,.entry-share .window-uzumcu").on("click", function() {
  var t = $(this),
    e = t.data("url"),
    o = t.data("width"),
    a = t.data("height"),
    n = window.screen.width,
    s = window.screen.height,
    r = Math.round(n / 2 - o / 2),
    i = Math.round(s / 2 - a / 2);
  window.open(e, "_blank", "scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=" + o + ",height=" + a + ",left=" + r + ",top=" + i).focus();
}), $(".share-links").each(function() {
  var t = $(this);
  t.find(".show-hid a").on("click", function() {
    t.toggleClass("show-hidden");
  });
}), $(".about-author .author-description span a").each(function() {
  var t = $(this),
    e = t.text().trim(),
    o = t.attr("href");
  t.replaceWith('<li class="' + e + '"><a href="' + o + '" title="' + e + '" target="_blank"/></li>'), $(".author-description").append($(".author-description span li")), $(".author-description").addClass("show-icons");
}), $(".blog-post-comments").each(function() {
  var t = $(this);
  t.addClass("comments-system-blogger").show(), $(".entry-meta .entry-comments-link").addClass("show");
  var e = t.find(".comments .toplevel-thread > ol > .comment .comment-actions .comment-reply"),
    o = t.find(".comments .toplevel-thread > #top-continue");
  e.on("click", function() {
    o.show();
  }), o.on("click", function() {
    o.hide();
  });
}), $(function() {
  $(".index-post .entry-image-link .entry-thumb, .PopularPosts .entry-image-link .entry-thumb, .FeaturedPost .entry-image-link .entry-thumb,.about-author .author-avatar").lazyuzumcu(), $(".mobile-logo").each(function() {
    var t = $(this),
      e = $("#main-logo .header-widget a").clone();
    e.find("#h1-tag").remove(), e.appendTo(t);
  }), $("#mobile-menu").each(function() {
    var t = $(this),
      e = $("#main-menu-nav").clone();
    e.attr("id", "main-mobile-nav"), e.appendTo(t), $(".show-mobile-menu, .hide-mobile-menu, .overlay").on("click", function() {
      $("body").toggleClass("nav-active");
    }), $(".mobile-menu .has-sub").append('<div class="submenu-toggle"/>'), $(".mobile-menu ul li .submenu-toggle").on("click", function(t) {
      $(this).parent().hasClass("has-sub") && (t.preventDefault(), $(this).parent().hasClass("show") ? $(this).parent().removeClass("show").find("> .m-sub").slideToggle(170) : $(this).parent().addClass("show").children(".m-sub").slideToggle(170));
    });
  }), $(".social-mobile").each(function() {
    var t = $(this);
    $("#navbar-social ul.social").clone().appendTo(t);
  }), $("#header-wrapper .headeruzumcu").each(function() {
    var t = $(this),
      e = $(document).scrollTop(),
      o = t.offset().top,
      a = t.height(),
      n = o + a;
    $(window).scroll(function() {
      var o = $(document).scrollTop();
      o < $("#footer-wrapper").offset().top - a && (o > n ? t.addClass("is-fixed") : 0 >= o && t.removeClass("is-fixed"), o > e ? t.removeClass("show") : t.addClass("show"), e = $(document).scrollTop());
    });
  }), $("#main-wrapper,#sidebar-wrapper").each(function() {
    $(this).theiaStickySidebar({
      additionalMarginTop: 90,
      additionalMarginBottom: 30
    });
  }), $(".back-top").each(function() {
    var t = $(this);
    $(window).on("scroll", function() {
      $(this).scrollTop() >= 100 ? t.fadeIn(250) : t.fadeOut(250), t.offset().top >= $("#footer-wrapper").offset().top - 32 ? t.addClass("on-footer") : t.removeClass("on-footer");
    }), t.click(function() {
      $("html, body").animate({
        scrollTop: 0
      }, 500);
    });
  }), $("p.comment-content").each(function() {
    var t = $(this);
    t.replaceText(/(https:\/\/\S+(\.png|\.jpeg|\.jpg|\.gif))/g, '<img src="$1"/>'), t.replaceText(/(?:https:\/\/)?(?:www\.)?(?:youtube\.com)\/(?:watch\?v=)?(.+)/g, '<iframe id="youtube" width="100%" height="358" src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
  }), $("#load-more-link").each(function() {
    var t = $(this).data("load");
    t && $("#load-more-link").show(), $("#load-more-link").on("click", function(e) {
      $("#load-more-link").hide(), $.ajax({
        url: t,
        success: function(e) {
          var o = $(e).find(".blog-posts");
          o.find(".index-post").addClass("post-animated post-fadeInUp"), $(".blog-posts").append(o.html()), (t = $(e).find("#load-more-link").data("load")) ? $("#load-more-link").show() : ($("#load-more-link").hide(), $("#blog-pager .no-more").addClass("show")), $(".index-post .entry-image-link .entry-thumb").lazyuzumcu();
        },
        beforeSend: function() {
          $("#blog-pager .loading").show();
        },
        complete: function() {
          $("#blog-pager .loading").hide();
        }
      }), e.preventDefault();
    });
  });
});
