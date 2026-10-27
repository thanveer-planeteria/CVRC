/* ==========================================================================
   Custom JS - Organized Structure
   ========================================================================== */


/* ==========================================================================
   DOCUMENT READY
   ========================================================================== */

$(document).ready(function() {


    /* ------------------------------------------------------------------
       Accessibility & ARIA
    ------------------------------------------------------------------ */

    // Main wrapper role
    $('.main_wrapper').attr('role', 'main').attr('id', 'page_content');
    $('.ajaxsearchpro').each(function() {
        var closeBtn = $(this).find('.proclose');
        var magnifier = $(this).find('.promagnifier');

        closeBtn.insertBefore(magnifier);
    });

    // Search toggle accessibility
    $(".search_txt")
        .attr("tabindex", "0")
        .attr("role", "button")
        .attr("aria-expanded", "false")
        .on("click keydown", function(e) {
            if (e.type === "click" || (e.type === "keydown" && (e.key === "Enter" || e.key === " "))) {
                e.preventDefault();
                const $this = $(this);
                const $container = $this.parent().find(".asp_w_container");
                const isOpen = $container.is(":visible");
                $container.stop(true, true).slideToggle();
                $this.attr("aria-expanded", String(!isOpen));
            }
        });


    // PDF links open in new tab
    $('a[href$=".pdf"]').each(function() {
        $(this).attr('target', '_blank');
    });
    $(".main_wrapper a").each(function() {
        if (this.hostname && this.hostname !== location.hostname) {
            $(this).addClass("external-link");
        }
    });




    /* ------------------------------------------------------------------
       DOM Modifications & Class Cleanup
    ------------------------------------------------------------------ */

    // Remove layout class
    $('.wp-block-group, .wp-block-columns, .wp-block-column').removeClass('is-layout-flow');

    // Add class helpers
    $('.rel_forms').parent(".col_right").addClass("has_forms");
    $('.alerticon').parent(".rtTitle").addClass("p-left");
    $('.text_card_block .btn_sm').parents('.img_text_card_col').find('.text-img-wrap').addClass("has-button");

    // Wrap tables
    $('.center-grp .wp-block-table').each(function() {
        $(this).wrap('<div class="table-wrapper"></div>');
    });

    // Wrap image blocks
    $('.img_block .img_block_descr').each(function() {
        if ($(this).find('p').length === 0) {
            $(this).closest('.img_block').addClass('no-p-tag');
        }
    });

    // Carousel: hide controls if single slide
    $('.carousel-inner').each(function() {
        if ($(this).children('div').length === 1) {
            $(this).siblings('.carousel-indicators, .carousel-control-prev, .carousel-control-next').hide();
        }
    });

    // Step-by-step slider (#stepSlider): hide prev on first slide, next on last; keyboard-accessible indicators
    $('#stepSlider').each(function() {
        var $carousel = $(this);
        var $indicatorList = $carousel.find('.step_slider_indicators');
        var $indicators = $indicatorList.find('li');
        var total = $indicators.length;

        if (total) {
            $indicatorList.attr('aria-label', 'Steps');
            $indicators.each(function(index) {
                $(this).attr({
                    role: 'button',
                    tabindex: '0',
                    'aria-label': 'Go to step ' + (index + 1) + ' of ' + total
                });
                $(this).find('span').attr('aria-hidden', 'true');
            });

            $indicators.on('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    $(this).trigger('click');
                }
            });
        }

        function updateIndicatorAriaCurrent() {
            $indicators.each(function() {
                var $dot = $(this);
                if ($dot.hasClass('active')) {
                    $dot.attr('aria-current', 'true');
                } else {
                    $dot.removeAttr('aria-current');
                }
            });
        }

        function updateStepSliderNav() {
            var $items = $carousel.find('.carousel-item');
            var count = $items.length;
            if (!count) {
                return;
            }
            var activeIndex = $items.index($items.filter('.active'));
            var $prev = $carousel.find('.step_slider_control--prev');
            var $next = $carousel.find('.step_slider_control--next');

            var atStart = activeIndex <= 0;
            var atEnd = activeIndex >= count - 1;

            $prev.toggleClass('step_slider_control--hidden', atStart);
            $prev.attr('aria-hidden', atStart ? 'true' : 'false');
            $prev.attr('tabindex', atStart ? '-1' : '0');

            $next.toggleClass('step_slider_control--hidden', atEnd);
            $next.attr('aria-hidden', atEnd ? 'true' : 'false');
            $next.attr('tabindex', atEnd ? '-1' : '0');

            updateIndicatorAriaCurrent();
        }

        $carousel.on('slid.bs.carousel', updateStepSliderNav);
        updateStepSliderNav();
    });

    // Email address line-break helper
    $('.dp_sidebar .cont_row p a, .contact_col p a').each(function() {
        const text = $(this).text().trim();
        if (text.includes('@')) {
            $(this).html(text.replace('@', '<wbr>@<wbr>'));
        }
    });

    // Move table headers from tbody to thead (kb-table)
    $(".kb-table").each(function() {
        const $table = $(this);
        const $tbody = $table.find("tbody").first();
        if (!$tbody.length) return;
        const $firstRow = $tbody.find("tr").first();
        if (!$firstRow.length) return;
        if ($firstRow.find("th").length > 0) {
            const $thead = $("<thead></thead>");
            $thead.append($firstRow);
            $table.prepend($thead);
        }
    });


    /* ------------------------------------------------------------------
       Bootstrap Tabs – URL Hash Handling
    ------------------------------------------------------------------ */

    // Activate tab based on URL hash
    var hash = window.location.hash;
    if (hash) {
        $('.nav-link[href="' + hash + '"]').tab('show');
    }

    // Update URL hash on tab change
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        history.pushState(null, null, e.target.hash);
    });

    // Scroll to hash target
    if (window.location.hash) {
        var $target = $(window.location.hash);
        if ($target.length) {
            var offset = $('.advgb-tabs-panel').outerHeight() + 30;
            $('html, body').animate({ scrollTop: $target.offset().top - offset }, 1000);
        }
    }


    /* ------------------------------------------------------------------
       Navbar & Mobile Menu
    ------------------------------------------------------------------ */

    // Hamburger toggle
    $(".navbar-toggler").on("click", function() {
        $(this).toggleClass("active");
        $('.main_header').toggleClass("headerActive");
    });

    // Dropdown hover fix
    $('.dropdown-menu a').on('mouseenter', function() {
        $('.dropdown-menu a:focus').blur();
    });

    // Mobile: append plusMinus toggles and mobile table wraps
    if (jQuery(window).width() < 1200) {

        $('.navbar-nav > li.menu-item-has-children, .navbar-nav > li.megamenu_item').append('<div class="plusMinus"></div>');

        jQuery(".navbar-nav > li.menu-item-has-children > .plusMinus, .navbar-nav > li.megamenu_item > .plusMinus").click(function() {
            $(this).parent().find('.dropdown-menu, .megamenu_drop, .megamenu').slideToggle("fast");
            $(this).parent().toggleClass('activeBlue');
            $(this).toggleClass("minsicon");
        });

        $('.megamenu_drop li.menu-item-has-children').append('<div class="pls_minus"></div>');

        jQuery(".megamenu_drop li.menu-item-has-children .pls_minus").click(function() {
            $(this).parent().find('.sub-menu').slideToggle("fast");
            $(this).parent().toggleClass('active-item');
            $(this).toggleClass("minus-info");
        });

        $('.wp-block-advgb-table').each(function() {
            $(this).wrap('<div class="table-wrap"></div>');
        });

        $('.wp-block-group > table').wrap('<div class="table-wrapper"></div>');
    }

  

    // Dropdown submenu plus-minus toggle (accessible)
    $('.dropdown-menu > li.menu-item-has-children').prepend('<div class="plus-minus" tabindex="0" aria-expanded="false" role="button" aria-label="Toggle submenu"></div>');

    $('.dropdown-menu').on('click keydown', '.plus-minus', function(e) {
        if (e.type === 'click' || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))) {
            e.preventDefault();
            const $this = $(this);
            const $submenu = $this.parent().find('> .mega-submenu');
            const isOpen = $this.attr('aria-expanded') === 'true';
            $submenu.slideToggle('fast');
            $this.toggleClass('minus-icon').attr('aria-expanded', String(!isOpen));
            $this.parent().siblings('li').find('> .mega-submenu').slideUp('fast');
            $this.parent().siblings('li').find('.plus-minus').removeClass('minus-icon').attr('aria-expanded', 'false');
        }
    });

    // Mega submenu inner toggles
    $('.mega-submenu > li.menu-item-has-children').prepend('<div class="plus-minus"></div>');

    jQuery(".mega-submenu > li.menu-item-has-children > .plus-minus").click(function() {
        jQuery(this).parent().find('> .mega-submenu').slideToggle("fast");
        jQuery(this).parent().siblings('li').find('> ul.mega-submenu').slideUp("fast");
        jQuery(this).parent().siblings('li').find('.plus-minus').removeClass("minus-icon");
        jQuery(this).toggleClass("minus-icon");
    });




    /* ------------------------------------------------------------------
       Match Height
    ------------------------------------------------------------------ */

    $(".links li .expand_det").matchHeight({ byRow: true, property: 'height', target: null, remove: false });
    $(".img_text_card_col .text_card_block").matchHeight({ byRow: true, property: 'height', target: null, remove: false });
    $(".dd_content h3").matchHeight({ byRow: true, property: 'height', target: null, remove: false });
    $(".img_btn_col .img_block_title").matchHeight({ byRow: true, property: 'height', target: null, remove: false });


    /* ------------------------------------------------------------------
       Google Translate Keyboard Accessibility
    ------------------------------------------------------------------ */

    setTimeout(function() {
        let $translateButton = $(".gt_selected");
        let $translateMenu = $(".gt_option");

        if ($translateButton.length && $translateMenu.length) {
            $translateButton.on("click", function() {
                setTimeout(function() {
                    let $iframe = $(".gt_option");
                    if ($iframe.length) {
                        $iframe.attr("tabindex", "-1").focus();
                    }
                }, 500);
            });

            $(document).on("keydown", function(event) {
                if (event.key === "Escape") {
                    let $iframe = $(".gt_option");
                    if ($iframe.length) {
                        $iframe.hide();
                        $translateButton.focus();
                    }
                }
            });
        }
    }, 2000);


    /* ------------------------------------------------------------------
       Tooltip Init
    ------------------------------------------------------------------ */

    $('[data-toggle="tooltip"]').tooltip();

    


}); // END document.ready


/* ==========================================================================
   WINDOW SCROLL
   ========================================================================== */

// Header shrink on scroll
$(document).on("scroll", function() {
    if ($(document).scrollTop() > 0) {
        $(".main_header").addClass("shrink");
    } else {
        $(".main_header").removeClass("shrink");
    }
});


/* ==========================================================================
   WINDOW LOAD
   ========================================================================== */

$(window).on('load', function() {

    // Wrap aligned images
    $('.wp-block-image.alignleft, .wp-block-image.alignright').wrap('<div class="left_right_wraper"></div>');

    // Check tab overflow
    checkOverflow();

    // Set header padding
    setHeaderPadding();

});


/* ==========================================================================
   WINDOW RESIZE
   ========================================================================== */

$(window).on('resize', function() {
    checkOverflow();
    setHeaderPadding();
});


/* ==========================================================================
   UTILITY FUNCTIONS
   ========================================================================== */

// Check if tabs overflow their container
function checkOverflow() {
    $('.kt-tabs-wrap').each(function() {
        var $tabs = $(this).find('.kt-tabs-title-list');
        if ($tabs.length && $tabs[0].scrollWidth > $tabs[0].clientWidth) {
            $(this).addClass('overflowing');
        } else {
            $(this).removeClass('overflowing');
        }
    });
}

// Set top padding on main wrapper to match header height
function setHeaderPadding() {
    if ($(window).width() > 1200) {
        var headerHeight = $('.main_header').outerHeight(true);
        $('.main_wrapper').css('padding-top', headerHeight + 'px');
    } else {
        $('.main_wrapper').css('padding-top', '');
    }
}

// Reset padding on close button click
$('.close').on('click', function() {
    $('.main_wrapper').css('padding-top', '');
});


/* ==========================================================================
   ANCHOR / HASH SCROLL ADJUSTMENT
   ========================================================================== */

(function($, window) {
    var adjustAnchor = function() {
        var $anchor = $(':target');
        var fixedElementHeight = 150;
        if ($anchor.length > 0) {
            $('html, body').stop().animate({ scrollTop: $anchor.offset().top - fixedElementHeight }, 200);
            window.scrollTo(0, $anchor.offset().top - fixedElementHeight);
        }
    };
    $(window).on('hashchange load', function() {
        adjustAnchor();
    });
})(jQuery, window);


/* ==========================================================================
   ACCORDION – Main (.accmain)
   ========================================================================== */

(function($) {

    $('.acctitle')
        .attr('tabindex', '0')
        .attr('role', 'button')
        .attr('aria-expanded', 'false');

    function toggleAccordion(elem, event) {
        var dropDown = elem.closest('.acccard').find('.accpanel');
        elem.closest('.accmain').find('.accpanel').not(dropDown).slideUp();
        elem.closest('.accmain').find('.acctitle.active').removeClass('active').attr('aria-expanded', 'false');

        if (elem.hasClass('active')) {
            elem.removeClass('active').attr('aria-expanded', 'false');
        } else {
            elem.addClass('active').attr('aria-expanded', 'true');
        }

        dropDown.stop(false, true).slideToggle();
        event.preventDefault();
    }

    $('.accmain .acctitle')
        .on('click', function(e) { toggleAccordion($(this), e); })
        .on('keydown', function(e) {
            if (e.key === "Enter" || e.key === " " || e.keyCode === 13 || e.keyCode === 32) {
                toggleAccordion($(this), e);
            }
        });

})(jQuery);


/* ==========================================================================
   ACCORDION – Secondary (.acc__main)
   ========================================================================== */

(function($) {

    function toggleAccordion($title) {
        var dropDown = $title.closest('.acc__card').find('.acc__panel');
        $title.closest('.acc__main').find('.acc__panel').not(dropDown).slideUp();

        if ($title.hasClass('active')) {
            $title.removeClass('active');
        } else {
            $title.closest('.acc__main').find('.acc__title.active').removeClass('active');
            $title.addClass('active');
        }

        dropDown.stop(false, true).slideToggle();
    }

    $('.acc__main .acc__title')
        .attr('tabindex', '0')
        .attr('role', 'button')
        .attr('aria-expanded', 'false')
        .on('click', function(e) {
            e.preventDefault();
            toggleAccordion($(this));
        })
        .on('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ' || e.keyCode === 13 || e.keyCode === 32) {
                e.preventDefault();
                toggleAccordion($(this));
            }
        });

})(jQuery);




/* ==========================================================================
   TRIBE EVENTS – Layout Wrap & Month View
   ========================================================================== */

jQuery(function($) {

    function wrapTribe() {
        var $filter = $('.tribe-filter-bar--vertical');
        var $view = $('.tribe-events-calendar-list, .tribe-events-calendar-month, .tribe-events-pro-photo');

        if (!$filter.length || !$view.length) return;

        if (!$('.tribe-events-layout .container .event_info').length) {
            $filter.add($view).wrapAll(
                '<div class="tribe-events-layout">' +
                '<div class="container">' +
                '<div class="event_info"></div>' +
                '</div>' +
                '</div>'
            );
        }

        var $layout = $('.tribe-events-layout');
        if ($('.tribe-events-calendar-month').length) {
            $layout.addClass('is-month-view');
        } else {
            $layout.removeClass('is-month-view');
        }
    }

    wrapTribe();

    var observer = new MutationObserver(function() {
        wrapTribe();
    });

    observer.observe(document.body, { childList: true, subtree: true });

});


/* ==========================================================================
   TRIBE EVENTS – Clickable Event Rows
   ========================================================================== */

jQuery(document).ready(function($) {

    $('.tribe-events-calendar-list__event-row').each(function() {
        var $row = $(this);
        var mainLink = $row.find('.tribe-events-calendar-list__event-title-link').attr('href');

        if (!mainLink) return;

        $row.css('cursor', 'pointer').on('click', function(e) {
            if ($(e.target).closest('a').length) return;
            window.location.href = mainLink;
        });

        $row.attr('tabindex', '0').on('keypress', function(e) {
            if (e.which === 13) {
                window.location.href = mainLink;
            }
        });
    });

});


/* ==========================================================================
   AJAX SEARCH PRO – Accessible Close Button
   ========================================================================== */

jQuery(document).ready(function($) {

    function makeProCloseAccessible() {
        $('.proclose').each(function() {
            if (!$(this).attr('tabindex')) {
                $(this).attr({
                    'tabindex': '0',
                    'role': 'button',
                    'aria-label': 'Clear search'
                });
            }
        });
    }

    makeProCloseAccessible();

    $(document).on('asp_init_search_bar', function() {
        makeProCloseAccessible();
    });

    $(document).on('keydown', '.proclose', function(e) {
        if (e.which === 13 || e.which === 32) {
            e.preventDefault();
            $(this).click();
        }
    });

});


/* ==========================================================================
   HOMEOWNERSHIP MEGA MENU
   Inspect/DevTools: the desktop mega hides on pointerleave + JS resets branches
   when leaving `.nav-item--mega`, so opening Inspect collapses the third column.
   Run once to pin open while debugging:
      document.body.classList.add('mega-menu-inspect-hold')
   Clear when done:
      document.body.classList.remove('mega-menu-inspect-hold')
   ========================================================================== */

jQuery(document).ready(function($) {
    var $mega = $('#mega_menu_homeownership');
    if (!$mega.length) return;

    var mqDesk = window.matchMedia('(min-width: 1200px)');
    var navLeaveTimer;
    var MEGA_BRANCH_CLOSE_MS = 340;

    function megaFeatureKeyFromNavTarget($node) {
        var $li = $node.closest('li[data-mega-feature]');
        if ($li.length) return $li.attr('data-mega-feature');
        return $node.attr('data-mega-feature') || null;
    }

    function showFeaturePanel($root, key) {
        var $match = $root.find('[data-mega-feature-panel="' + key + '"]');
        var targetKey = $match.length ? key : 'default';
        $root.find('.mega-menu__feature-panel').each(function() {
            var $el = $(this);
            if ($el.attr('data-mega-feature-panel') === targetKey) {
                $el.removeAttr('hidden').addClass('is-active');
            } else {
                $el.attr('hidden', true).removeClass('is-active');
            }
        });
    }

    function closeBranches($root, opts) {
        opts = opts || {};
        var instant = !!opts.instant;

        clearTimeout($root.data('megaBranchCloseTimer'));
        $root.removeData('megaBranchCloseTimer');

        $root.find('.mega-menu__inner').removeClass('mega-menu__inner--lenders-active');

        $root.find('.mega-menu__middle').removeClass('is-branch-open');
        $root.find('[data-mega-branch-trigger]').attr('aria-expanded', 'false');

        var $branches = $root.find('.mega-menu__branch');
        var $opened = $branches.filter('.is-open');

        if (!$opened.length) {
            $branches.attr('hidden', true).removeClass('is-open');
            return;
        }

        $opened.removeClass('is-open');

        if (instant || !mqDesk.matches) {
            $branches.attr('hidden', true);
            return;
        }

        var timer = setTimeout(function() {
            $branches.attr('hidden', true);
            $root.removeData('megaBranchCloseTimer');
        }, MEGA_BRANCH_CLOSE_MS);
        $root.data('megaBranchCloseTimer', timer);
    }

    function openBranch($root, slug) {
        clearTimeout($root.data('megaBranchCloseTimer'));
        $root.removeData('megaBranchCloseTimer');

        var $branch = $root.find('#mega_branch_' + slug);
        var $trigger = $root.find('[data-mega-branch-trigger="' + slug + '"]');
        if (!$branch.length) return;

        $root.find('.mega-menu__branch').not($branch).attr('hidden', true).removeClass('is-open');
        $root.find('[data-mega-branch-trigger]').attr('aria-expanded', 'false');

        $branch.removeAttr('hidden');
        $branch.removeClass('is-open');

        $trigger.attr('aria-expanded', 'true');
        $root.find('.mega-menu__middle').addClass('is-branch-open');

        function reveal() {
            $branch.addClass('is-open');
            var $cur = $branch.find('.mega-menu__sublink--current').first();
            var fk = $cur.length ? (megaFeatureKeyFromNavTarget($cur) || 'default') : 'default';
            showFeaturePanel($root, fk);
            $root.find('.mega-menu__inner').toggleClass('mega-menu__inner--lenders-active', slug === 'lenders');
        }

        if (mqDesk.matches) {
            window.requestAnimationFrame(function() {
                window.requestAnimationFrame(reveal);
            });
        } else {
            reveal();
        }
    }

    var $megaItem = $mega.closest('.nav-item--mega');

    $megaItem.on('mouseenter', function() {
        clearTimeout(navLeaveTimer);
    });

    $megaItem.on('mouseleave', function() {
        if (!mqDesk.matches) return;
        if (document.body.classList.contains('mega-menu-inspect-hold')) return;
        var $ctx = $(this);
        navLeaveTimer = setTimeout(function() {
            closeBranches($ctx.find('.mega-menu'), { instant: true });
            showFeaturePanel($ctx.find('.mega-menu'), 'default');
        }, 150);
    });

    $mega.on('click', '[data-mega-branch-trigger]', function(e) {
        e.preventDefault();
        clearTimeout(navLeaveTimer);
        var slug = $(this).attr('data-mega-branch-trigger');
        var $branch = $mega.find('#mega_branch_' + slug);
        if ($branch.hasClass('is-open')) {
            closeBranches($mega);
            showFeaturePanel($mega, 'default');
        } else {
            openBranch($mega, slug);
        }
    });

    $mega.on('click', '[data-mega-branch-close]', function(e) {
        e.preventDefault();
        closeBranches($mega);
        showFeaturePanel($mega, 'default');
    });

    $mega.on('mouseenter', '.mega-menu__list--sub > li[data-mega-feature]', function() {
        if (!mqDesk.matches) return;
        showFeaturePanel($mega, $(this).attr('data-mega-feature'));
    });

    $mega.on('focusin', '.mega-menu__list--sub .mega-menu__sublink', function() {
        var key = megaFeatureKeyFromNavTarget($(this));
        if (key) showFeaturePanel($mega, key);
    });

    $mega.on('click', '.mega-menu__list--sub .mega-menu__sublink', function() {
        if (!mqDesk.matches) {
            var key = megaFeatureKeyFromNavTarget($(this));
            if (key) showFeaturePanel($mega, key);
        }
    });

    if (typeof mqDesk.addEventListener === 'function') {
        mqDesk.addEventListener('change', function() {
            closeBranches($mega, { instant: true });
            showFeaturePanel($mega, 'default');
        });
    }
});


// // menu move
// function moveElements() {

//     if ($(window).width() <= 1200) {

//         // Move .top_header_cont before .nav_bottom
//         if (!$('.nav_bottom').prev().hasClass('top_header_cont')) {
//             $('.top_header_cont').insertBefore('.nav_bottom');
//         }

//         // Move .top_search after .logo_wrap
//         if (!$('.logo_wrap').next().hasClass('top_search')) {
//             $('.top_search').insertAfter('.logo_wrap');
//         }

//     } else {

//         // Move .top_header_cont back after .logo_wrap
//         if (!$('.logo_wrap').next().hasClass('top_header_cont')) {
//             $('.top_header_cont').insertAfter('.logo_wrap');
//         }

//         // Move .top_search back inside .top_header_cont
//         if (!$('.top_header_cont').find('.top_search').length) {
//             $('.top_search').prependTo('.login-language');
//         }

//     }
// }

// $(window).on('load resize', function () {
//     moveElements();
// });


// service alert expand
(function() {
  const header = document.querySelector(".alerts-header");
  const body = document.querySelector(".alerts-body");
    const expandBtn = document.querySelector(".expand_btn");

  if (!header || !body || !expandBtn) return;

  header.addEventListener("click", () => {
    const expanded = header.getAttribute("aria-expanded") === "true";

    header.setAttribute("aria-expanded", !expanded);
    body.style.display = expanded ? "none" : "block";
    expandBtn.classList.toggle("expanded", !expanded);

  });
})();

document.addEventListener("DOMContentLoaded", function () {
    const table = document.querySelector(".bus-table");
    if (!table) return;
    const firstRow = table.querySelector("tbody tr");

    if (firstRow) {
        const totalColumns = firstRow.children.length;
        const fixedColumns = 2; // Stop Name + Stop #
        const dynamicColumns = totalColumns - fixedColumns;

        const arrivalHeader = table.querySelector("thead th[colspan]");
        if (arrivalHeader) {
            arrivalHeader.setAttribute("colspan", dynamicColumns);
        }
    }
});


  $('.owl-general').each(function () {

        var $wrapper = $(this);
        var $carousel = $wrapper.find('.owl-carousel');
        var $navContainer = $wrapper.find('.custom-nav');

        $carousel.owlCarousel({
            loop: true,
            dots: true,
            autoplay: true,
            margin: 10,
            nav: true,
            autoWidth: false,
            items: 1,
            navText: [
                '<span class="sr-only">Previous slide</span><img src="./img/arrow-right-b.svg" alt="">',
                '<span class="sr-only">Next slide</span><img src="./img/arrow-right-b.svg" alt="">'
            ],
            navContainer: $navContainer
        });

    });



    // video banner controls

    document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("hero-video");
  const pauseButton = document.getElementById("video-pause");
  const playButton = document.getElementById("video-play");
  const status = document.getElementById("video-status");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function updateControls(isPlaying) {
    pauseButton.classList.toggle("is-paused", !isPlaying);

    pauseButton.setAttribute("aria-pressed", String(!isPlaying));
    playButton.setAttribute("aria-pressed", String(isPlaying));

    pauseButton.disabled = !isPlaying;
    playButton.disabled = isPlaying;
  }

  function pauseVideo(announce = true) {
    video.pause();
    video.classList.remove("is-playing");
    updateControls(false);

    if (announce) {
      status.textContent = "Background video paused.";
    }
  }

  async function playVideo() {
    if (!video.querySelector("source")?.getAttribute("src")) {
      status.textContent =
        "Video is unavailable. Displaying the background image.";
      return;
    }

    try {
      await video.play();
      video.classList.add("is-playing");
      updateControls(true);
      status.textContent = "Background video playing.";
    } catch (error) {
      video.classList.remove("is-playing");
      updateControls(false);
      status.textContent =
        "Video could not be played. The background image remains visible.";
    }
  }

  pauseButton.addEventListener("click", function () {
    pauseVideo();
  });

  playButton.addEventListener("click", function () {
    playVideo();
  });

  video.addEventListener("playing", function () {
    video.classList.add("is-playing");
    updateControls(true);
  });

  video.addEventListener("pause", function () {
    video.classList.remove("is-playing");
    updateControls(false);
  });

  video.addEventListener("error", function () {
    video.classList.remove("is-playing");
    updateControls(false);
    status.textContent =
      "Video is unavailable. Displaying the background image.";
  });

  if (reducedMotion.matches) {
    pauseVideo(false);
  } else {
    updateControls(true);
  }

  reducedMotion.addEventListener("change", function (event) {
    if (event.matches) {
      pauseVideo(false);
    }
  });
});


// impact counter

document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(
    ".impact-section .counter"
  );

  if (!counters.length) return;

  const formatter = new Intl.NumberFormat("en-US");

  function setFinalValue(counter) {
    const target = Number(counter.dataset.target);
    const suffix = counter.dataset.suffix || "";

    counter.textContent = formatter.format(target) + suffix;
  }

  function animateCounter(counter) {
    if (counter.dataset.animated === "true") return;

    counter.dataset.animated = "true";

    const target = Number(counter.dataset.target);
    const suffix = counter.dataset.suffix || "";

    if (!Number.isFinite(target) || target < 0) return;

    if (window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches) {
      setFinalValue(counter);
      return;
    }

    const duration = 1800;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(
        target * easedProgress
      );

      counter.textContent =
        formatter.format(currentValue) + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setFinalValue(counter);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionCounters =
            entry.target.querySelectorAll(".counter");

          sectionCounters.forEach(animateCounter);
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.25
    }
  );

  const section = document.querySelector(".impact-section");

  if (section) {
    observer.observe(section);
  }
});


// grid and list

document.addEventListener("DOMContentLoaded", function () {
  const toolbar = document.querySelector(".news-toolbar");
  const newsRow = document.querySelector(".newsRow");

  if (!toolbar || !newsRow) return;

  const viewButtons = toolbar.querySelectorAll("[data-view]");

  viewButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedView = button.dataset.view;

      // Update the parent .newsRow class
      newsRow.classList.toggle("grid-view", selectedView === "grid");
      newsRow.classList.toggle("list-view", selectedView === "list");
      

      // Update the active button and accessibility state
      viewButtons.forEach(function (viewButton) {
        const isActive = viewButton === button;

        viewButton.classList.toggle("is-active", isActive);
        viewButton.setAttribute("aria-pressed", String(isActive));
      });
    });
  });
});

// resources slider


new Swiper(".resource_wrapper", {
  loop: true,
  spaceBetween: 24,
  // Autoplay
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  // Pagination bullets
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  // Responsive breakpoints
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});



