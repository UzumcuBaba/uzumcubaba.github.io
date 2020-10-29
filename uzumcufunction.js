$(function (t) {
  t.fn.lazyyard = function () {
    return this.each(function () {
      var e = t(this),
        a = e.attr("src"),
        s = "/w" + Math.round(e.width()) + "-h" + Math.round(e.height()) + "-p-k-no-nu",
        i = "/w357";
      function n() {
        var a = t(window).height();
        if (t(window).scrollTop() + a > e.offset().top) {
          var s = new Image();
          (s.onload = function () {
            e.addClass("lazy-yard");
          }),
            (s.src = i);
        }
      }
      (i = a.match("s72-c") ? a.replace("/s72-c", s) : a.match("w72-h") ? a.replace("/w72-h72-p-k-no-nu", s) : a), t(window).on("load resize scroll", n), n();
    });
  };
}),
  $(function () {
    function t(t, e) {
      for (var a = 0; a < t[e].link.length; a++)
        if ("alternate" == t[e].link[a].rel) {
          var s = t[e].link[a].href;
          break;
        }
      return s;
    }
    function e(t, e, a) {
      return '<a href="' + a + '">' + t[e].title.$t + "</a>";
    }
    function a(t, e) {
      return "<a>" + t[e].author[0].name.$t + "</a></span>";
    }
    function s(t, e) {
      var a = t[e].published.$t,
        s = a.substring(0, 4),
        i = a.substring(5, 7),
        n = a.substring(8, 10);
      return '<span class="post-date">' + monthFormat[parseInt(i, 10) - 1] + " " + n + ", " + s + "</span>";
    }
    function i(t, e) {
      var a = t[e].title.$t,
        s = t[e].content.$t,
        i = $("<div>").html(s);
      if ("media$thumbnail" in t[e]) {
        var n = t[e].media$thumbnail.url,
          o = n.replace("/s72-c", "/w680");
        s.indexOf("youtube.com/embed") > -1 && (o = n.replace("/default.", "/hqdefault."));
      } else o = s.indexOf("<img") > -1 ? i.find("img:first").attr("src") : noThumbnail;
      return '<img class="post-thumb" alt="' + a + '" src="' + o + '"/>';
    }
    function n(t, e) {
      if (null != t[e].category) var a = '<span class="post-tag">' + t[e].category[0].term + "</span>";
      else a = "";
      return a;
    }
    function o(o, r, l, c) {
      if (r.match("mega-menu") || r.match("hot-posts") || r.match("featured") || r.match("post-list") || r.match("related")) {
        var d = "";
        (d =
          "recent" == c
            ? "/feeds/posts/default?alt=json-in-script&max-results=" + l
            : "random" == c
            ? "/feeds/posts/default?max-results=" + l + "&start-index=" + (Math.floor(Math.random() * l) + 1) + "&alt=json-in-script"
            : "/feeds/posts/default/-/" + c + "?alt=json-in-script&max-results=" + l),
          $.ajax({
            url: d,
            type: "get",
            dataType: "jsonp",
            beforeSend: function () {
              r.match("hot-posts") && o.html('<div class="hot-loader"/>').parent().addClass("show-hot");
            },
            success: function (l) {
              if (r.match("mega-menu")) var d = '<ul class="mega-menu-inner">';
              else r.match("hot-posts") ? (d = '<ul class="hot-posts">') : r.match("post-list") ? (d = '<ul class="custom-widget">') : r.match("related") && (d = '<ul class="related-posts">');
              var h = l.feed.entry;
              if (null != h) {
                for (var f = 0, m = h; f < m.length; f++) {
                  var u = t(m, f),
                    p = e(m, f, u),
                    v = i(m, f),
                    g = n(m, f),
                    b = a(m, f),
                    w = s(m, f),
                    $ = "";
                  r.match("mega-menu")
                    ? ($ +=
                        '<div class="mega-item item-' +
                        f +
                        '"><div class="mega-content"><div class="post-image-wrap"><a class="post-image-link" href="' +
                        u +
                        '">' +
                        v +
                        "</a>" +
                        g +
                        '</div><h2 class="post-title">' +
                        p +
                        '</h2><div class="post-meta">' +
                        w +
                        "</div></div></div>")
                    : r.match("hot-posts")
                    ? ($ +=
                        0 == f
                          ? '<li class="hot-item item-' +
                            f +
                            '"><div class="hot-item-inner"><a class="post-image-link" href="' +
                            u +
                            '">' +
                            v +
                            "</a>" +
                            g +
                            '<div class="post-info"><h2 class="post-title">' +
                            p +
                            '</h2><div class="post-meta">' +
                            b +
                            w +
                            "</div></div></div></li>"
                          : '<li class="hot-item item-' +
                            f +
                            '"><div class="hot-item-inner"><a class="post-image-link" href="' +
                            u +
                            '">' +
                            v +
                            "</a>" +
                            g +
                            '<div class="post-info"><h2 class="post-title">' +
                            p +
                            '</h2><div class="post-meta">' +
                            w +
                            "</div></div></div></li>")
                    : r.match("post-list")
                    ? ($ += '<li class="item-' + f + '"><a class="post-image-link" href="' + u + '">' + v + '</a><div class="post-info"><h2 class="post-title">' + p + '</h2><div class="post-meta">' + w + "</div></div></div></li>")
                    : r.match("related") &&
                      ($ +=
                        '<li class="related-item item-' +
                        f +
                        '"><div class="post-image-wrap"><a class="post-image-link" href="' +
                        u +
                        '">' +
                        v +
                        "</a>" +
                        g +
                        '</div><h2 class="post-title">' +
                        p +
                        '</h2><div class="post-meta">' +
                        w +
                        "</div></li>"),
                    (d += $);
                }
                d += "</ul>";
              } else d = '<ul class="no-posts">Yazı bulunamadı. <i class="fa fa-frown"/></ul>';
              r.match("mega-menu")
                ? (o.addClass("has-sub mega-menu").append(d),
                  o.find("a:first").attr("href", function (t, e) {
                    return "recent" == c || "random" == c ? e.replace(e, "/search/?&max-results=" + postPerPage) : e.replace(e, "/search/label/" + c + "?&max-results=" + postPerPage);
                  }))
                : r.match("hot-posts")
                ? o.html(d).parent().addClass("show-hot")
                : o.html(d),
                o.find(".post-thumb").lazyyard();
            },
          });
      }
    }
    $(".index-post .post-image-link .post-thumb, .PopularPosts .post-image-link .post-thumb, .FeaturedPost .entry-image-link .post-thumb,.about-author .author-avatar, .item-post .post-body img").lazyyard(),
      $("#main-menu").each(function () {
        for (var t = $(this).find(".LinkList ul > li").children("a"), e = t.length, a = 0; a < e; a++) {
          var s = t.eq(a),
            i = s.text();
          if (
            "_" !== i.charAt(0) &&
            "_" ===
              t
                .eq(a + 1)
                .text()
                .charAt(0)
          ) {
            var n = s.parent();
            n.append('<ul class="sub-menu m-sub"/>');
          }
          "_" === i.charAt(0) && (s.text(i.replace("_", "")), s.parent().appendTo(n.children(".sub-menu")));
        }
        for (a = 0; a < e; a++) {
          var o = t.eq(a),
            r = o.text();
          if (
            "_" !== r.charAt(0) &&
            "_" ===
              t
                .eq(a + 1)
                .text()
                .charAt(0)
          ) {
            var l = o.parent();
            l.append('<ul class="sub-menu2 m-sub"/>');
          }
          "_" === r.charAt(0) && (o.text(r.replace("_", "")), o.parent().appendTo(l.children(".sub-menu2")));
        }
        $("#main-menu ul li ul").parent("li").addClass("has-sub"),
          $("#main-menu ul > li a").each(function () {
            var t = $(this),
              e = t.text().trim(),
              a = e.toLowerCase(),
              s = e.split("-")[0];
            a.match("-text") && (t.attr("data-title", s), t.parent("li").addClass("li-home").find("> a").text(s)),
              e.match("-icon") && (t.attr("data-title", s), t.parent("li").addClass("li-home li-home-icon").find("> a").html('<i class="fa fa-home"/>'));
          }),
          $("#main-menu .widget").addClass("show-menu");
      }),
      $("#main-menu-nav").clone().appendTo(".mobile-menu"),
      $(".mobile-menu .has-sub").append('<div class="submenu-toggle"/>'),
      $(".mobile-menu ul > li a").each(function () {
        var t = $(this),
          e = t.attr("href").trim(),
          a = e.toLowerCase(),
          s = e.split("/")[0],
          i = t.data("title");
        t.parent("li.li-home").find("> a").text(i), a.match("mega-menu") && t.attr("href", "/search/label/" + s + "?&max-results=" + postPerPage);
      }),
      $(".slide-menu-toggle").on("click", function () {
        $("body").toggleClass("nav-active");
      }),
      $(".mobile-menu ul li .submenu-toggle").on("click", function (t) {
        $(this).parent().hasClass("has-sub") &&
          (t.preventDefault(), $(this).parent().hasClass("show") ? $(this).parent().removeClass("show").find("> .m-sub").slideToggle(170) : $(this).parent().addClass("show").children(".m-sub").slideToggle(170));
      }),
      $(".show-search").on("click", function () {
        $("#nav-search").fadeIn(250).find("input").focus();
      }),
      $(".hide-search").on("click", function () {
        $("#nav-search").fadeOut(250).find("input").blur();
      }),
      $(".Label a, a.b-label").attr("href", function (t, e) {
        return e.replace(e, e + "?&max-results=" + postPerPage);
      }),
      $(".avatar-image-container img").attr("src", function (t, e) {
        return (e = e.replace("/s35-c/", "/s45-c/")).replace(
          "//1.bp.blogspot.com/-6bajoYC0A0A/X5dUieZM-dI/AAAAAAAACBA/I6voC3Zf8Sc8vX4nqv-JRKnMkLeUMIxDQCLcBGAsYHQ/s0/blank.gif",
          "//4.bp.blogspot.com/-uCjYgVFIh70/VuOLn-mL7PI/AAAAAAAADUs/Kcu9wJbv790hIo83rI_s7lLW3zkLY01EA/s55-r/avatar.png"
        );
      }),
      $(".author-description a").each(function () {
        $(this).attr("target", "_blank");
      }),
      $(".post-body strike").each(function () {
        var t = $(this),
          e = t.text();
        e.match("left-sidebar") && t.replaceWith("<style>.item #main-wrapper{float:right}.item #sidebar-wrapper{float:left}</style>"),
          e.match("right-sidebar") && t.replaceWith("<style>.item #main-wrapper{float:left}.item #sidebar-wrapper{float:right}</style>"),
          e.match("full-width") && t.replaceWith("<style>.item #main-wrapper{width:100%}.item #sidebar-wrapper{display:none}</style>");
      }),
      $("#main-wrapper, #sidebar-wrapper").each(function () {
        1 == fixedSidebar && $(this).theiaStickySidebar({ additionalMarginTop: 30, additionalMarginBottom: 30 });
      }),
      $(".back-top").each(function () {
        var t = $(this);
        $(window).on("scroll", function () {
          $(this).scrollTop() >= 100 ? t.fadeIn(250) : t.fadeOut(250);
        }),
          t.click(function () {
            $("html, body").animate({ scrollTop: 0 }, 500);
          });
      }),
      $("#main-menu #main-menu-nav li").each(function () {
        var t = $(this),
          e = t.find("a").attr("href").trim();
        o(t, e.toLowerCase(), 4, e.split("/")[0]);
      }),
      $("#hot-section .widget-content").each(function () {
        var t = $(this),
          e = t.text().trim();
        o(t, e.toLowerCase(), 4, e.split("/")[0]);
      }),
      $(".common-widget .widget-content").each(function () {
        var t = $(this),
          e = t.text().trim(),
          a = e.toLowerCase(),
          s = e.split("/");
        o(t, a, s[0], s[1]);
      }),
      $(".related-ready").each(function () {
        var t = $(this);
        o(t, "related", 3, t.find(".related-tag").data("label"));
      }),
      $(".blog-post-comments").each(function () {
        var t,
          e = commentsSystem,
          a = (disqus_blogger_current_url, '<div class="fb-comments" data-width="100%" data-href="' + $(location).attr("href") + '" data-numposts="5"></div>'),
          s = "comments-system-" + e;
        "blogger" == e
          ? $(this).addClass(s).show()
          : "disqus" == e
          ? (((t = document.createElement("script")).type = "text/javascript"),
            (t.async = !0),
            (t.src = "//" + disqusShortname + ".disqus.com/embed.js"),
            (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(t),
            $("#comments, #gpluscomments").remove(),
            $(this).append('<div id="disqus_thread"/>').addClass(s).show())
          : "facebook" == e
          ? ($("#comments, #gpluscomments").remove(), $(this).append(a).addClass(s).show())
          : "hide" == e
          ? $(this).hide()
          : $(this).addClass("comments-system-default").show();
      });
  }),
  (function (t) {
    (t.fn.lazyload = function (e) {
      var a = { threshold: 10, failurelimit: 0, event: "scroll", effect: "show", container: window };
      e && t.extend(a, e);
      var s = this;
      return (
        "scroll" == a.event &&
          t(a.container).bind("scroll", function (e) {
            var i = 0;
            s.each(function () {
              if (t.abovethetop(this, a) || t.leftofbegin(this, a));
              else if (t.belowthefold(this, a) || t.rightoffold(this, a)) {
                if (i++ > a.failurelimit) return !1;
              } else t(this).trigger("appear");
            });
            var n = t.grep(s, function (t) {
              return !t.loaded;
            });
            s = t(n);
          }),
        this.each(function () {
          var e = this;
          null == t(e).attr("original") && t(e).attr("original", t(e).attr("src")),
            "scroll" != a.event || null == t(e).attr("src") || a.placeholder == t(e).attr("src") || t.abovethetop(e, a) || t.leftofbegin(e, a) || t.belowthefold(e, a) || t.rightoffold(e, a)
              ? (a.placeholder ? t(e).attr("src", a.placeholder) : t(e).removeAttr("src"), (e.loaded = !1))
              : (e.loaded = !0),
            t(e).one("appear", function () {
              this.loaded ||
                t("<img />")
                  .bind("load", function () {
                    t(e).hide().attr("src", t(e).attr("original"))[a.effect](a.effectspeed), (e.loaded = !0);
                  })
                  .attr("src", t(e).attr("original"));
            }),
            "scroll" != a.event &&
              t(e).bind(a.event, function (a) {
                e.loaded || t(e).trigger("appear");
              });
        }),
        t(a.container).trigger(a.event),
        this
      );
    }),
      (t.belowthefold = function (e, a) {
        if (void 0 === a.container || a.container === window) var s = t(window).height() + t(window).scrollTop();
        else s = t(a.container).offset().top + t(a.container).height();
        return s <= t(e).offset().top - a.threshold;
      }),
      (t.rightoffold = function (e, a) {
        if (void 0 === a.container || a.container === window) var s = t(window).width() + t(window).scrollLeft();
        else s = t(a.container).offset().left + t(a.container).width();
        return s <= t(e).offset().left - a.threshold;
      }),
      (t.abovethetop = function (e, a) {
        if (void 0 === a.container || a.container === window) var s = t(window).scrollTop();
        else s = t(a.container).offset().top;
        return s >= t(e).offset().top + a.threshold + t(e).height();
      }),
      (t.leftofbegin = function (e, a) {
        if (void 0 === a.container || a.container === window) var s = t(window).scrollLeft();
        else s = t(a.container).offset().left;
        return s >= t(e).offset().left + a.threshold + t(e).width();
      }),
      t.extend(t.expr[":"], {
        "below-the-fold": "$.belowthefold(a, {threshold : 0, container: window})",
        "above-the-fold": "!$.belowthefold(a, {threshold : 0, container: window})",
        "right-of-fold": "$.rightoffold(a, {threshold : 0, container: window})",
        "left-of-fold": "!$.rightoffold(a, {threshold : 0, container: window})",
      });
  })(jQuery),
  $(function () {
    $("img").lazyload({ placeholder: "//1.bp.blogspot.com/-6bajoYC0A0A/X5dUieZM-dI/AAAAAAAACBA/I6voC3Zf8Sc8vX4nqv-JRKnMkLeUMIxDQCLcBGAsYHQ/s0/blank.gif", effect: "fadeIn", threshold: "-50" });
  });
