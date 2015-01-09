(function() {
  var WebFontConfig, escapeQuery, sort, transitionEvent;

  WebFontConfig = {
    google: {
      families: ['Roboto::latin,cyrillic']
    }
  };

  (function() {
    var s, wf;
    wf = document.createElement('script');
    wf.src = ('https:' === document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    s = document.getElementsByTagName('script')[0];
    return s.parentNode.insertBefore(wf, s);
  })();

  escapeQuery = function(q) {
    return q.replace(/[\\^$.|?*+()[{]/g, '\\$&');
  };

  sort = new Sortable($('.js-menu-list')[0], {
    animation: 150,
    draggable: '.js-menu-item',
    ghostClass: 'is-dragging'
  });

  $('textarea').textareaAutoSize();

  $('.js-menu-btn').on('click', function(e) {
    var $menuBtn;
    e.preventDefault();
    e.stopPropagation();
    $menuBtn = $(e.target).closest('.js-menu-btn');
    if (!$menuBtn.hasClass('is-active')) {
      $('.js-menu').toggleClass('is-active');
    } else {
      $('.js-menu').removeClass('is-active').removeClass('is-underlying');
      $('.js-editor').removeClass('is-active');
      $('.js-search-input').val(null).keydown();
    }
    return $menuBtn.toggleClass('is-active');
  });

  $('.js-menu-item').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $('.js-menu').toggleClass('is-underlying');
    $('.js-editor').toggleClass('is-active');
    return $('.js-editor__title').text($(this).find('.suggestions__title').text());
  });

  $('.js-back-btn').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $('.js-editor').removeClass('is-active');
    return $('.js-menu').removeClass('is-underlying');
  });

  $('.js-close-btn').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $('.js-menu').removeClass('is-active').removeClass('is-underlying');
    if (!$('.js-search-input').val()) {
      return $('.js-menu-btn').removeClass('is-active');
    }
  });

  $('.btn__label').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $('.js-editor').removeClass('is-active');
    return $('.js-menu').removeClass('is-underlying');
  });

/*
  $(document).on('click', function(e) {
    if ($(e.target).closest('.js-menu').length === 0 && $(e.target).closest('.js-editor').length === 0) {
      $('.js-menu').removeClass('is-active').removeClass('is-underlying');
      $('.js-editor').removeClass('is-active');
      if (!$('.js-search-input').val()) {
        return $('.js-menu-btn').removeClass('is-active');
      }
    }
  });
*/

  $(document).on('click', '.js-suggestion', function(e) {
    var $el;
    $el = $(e.target).closest('.js-suggestion');
    return $('.js-search-input').val($el.find('.js-suggestion-title').text());
  });


  /*
  Following is a placeholder for suggestions engine.
   */

  $('.js-search-input').on('focus blur', function(e) {
    return $('.js-map-search').toggleClass('is-focused', e.type === 'focus');
  }).on('keydown', function(e) {
    var $search;
    $search = $('.js-map-search');
    return $search.find('.js-suggestions').removeClass('is-active');
  }).on('keyup', function(e) {
    var $search, $suggestions;
    $search = $('.js-map-search');
    $suggestions = $search.find('.js-suggestions');
    return $.ajax({
      beforeSend: function() {
        return $('.js-search-btn').addClass('is-active');
      },
      error: function() {
        return $('.js-search-btn').removeClass('is-active');
      },
      success: function(res) {
        var query, tpl;
        $('.js-menu-btn, .js-search-btn').removeClass('is-active');
        $search = $('.js-map-search');
        query = escapeQuery(e.target.value);
        if (!query) {
          return;
        }
        query = new RegExp('^' + query, 'i');
        _.templateSettings.variable = 'suggestions';
        tpl = _.template($('script.suggestions').html());
        res = _.filter(res, function(item) {
          return query.test(item.city);
        });
        res = res.slice(0, 10);
        $('.js-suggestions').html(tpl(res));
        query = new RegExp('(' + escapeQuery(e.target.value) + ')', 'i');
        $('.js-suggestion-title').each(function(i, el) {
          var $el;
          $el = $(el);
          return $el.html(function(i, h) {
            return h.replace(query, '<span class="suggestions__match">$&</span>');
          });
        });
        return $search.find('.js-menu-btn, .js-suggestions').addClass('is-active');
      },
      url: 'suggestions.json'
    });
  });

  transitionEvent = (function() {
    var el, t, transitions, _i, _len;
    el = document.createElement('fakeelement');
    transitions = {
      transition: 'transitionend',
      OTransition: 'oTransitionEnd',
      MozTransition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd'
    };
    for (_i = 0, _len = transitions.length; _i < _len; _i++) {
      t = transitions[_i];
      if (el.style[t] !== void 0) {
        return transitions[t];
      }
    }
  })();

}).call(this);
