'use strict';

let consultTime,
  consultSubject = '';

function scroll_to_class(element_class, removed_height) {
  var scroll_to = $(element_class).offset().top - removed_height;
  if ($(window).scrollTop() != scroll_to) {
    $('html, body').stop().animate({ scrollTop: scroll_to }, 0);
  }
}
function bar_progress(progress_line_object, direction) {
  var number_of_steps = progress_line_object.data('number-of-steps');
  var now_value = progress_line_object.data('now-value');
  var new_value = 0;
  if (direction == 'right') {
    new_value = now_value + 100 / number_of_steps;
  } else if (direction == 'left') {
    new_value = now_value - 100 / number_of_steps;
  }
  progress_line_object
    .attr('style', 'width: ' + new_value + '%;')
    .data('now-value', new_value);
}
(function ($) {
  'use strict';
  $.backstretch;
  $('#top-navbar-1').on('shown.bs.collapse', function () {
    $.backstretch('resize');
  });
  $('#top-navbar-1').on('hidden.bs.collapse', function () {
    $.backstretch('resize');
  });
  $('.f1 fieldset:first').fadeIn('slow');

  $('.f1 input[type="text"], .f1 input[type="password"], .f1 textarea').on(
    'focus',
    function () {
      $(this).removeClass('input-error');
    },
  );

  $('[name="consultSubject"]').change(function (e) {
    e.preventDefault();
    consultSubject = e.currentTarget.value;
  });

  $('[name="consultTime"]').change(function (e) {
    e.preventDefault();
    consultTime = e.currentTarget.value;
  });

  $('.f1 .btn-next').on('click', function () {
    var parent_fieldset = $(this).parents('fieldset');
    var next_step = true;
    var current_active_step = $(this).parents('.f1').find('.f1-step.active');
    var progress_line = $(this).parents('.f1').find('.f1-progress-line');

    if ($('[data-step="1"]').hasClass('active')) {
      if ($('textarea').val() == '') {
        $('textarea').addClass('input-error');
        next_step = false;
      } else {
        $(this).removeClass('input-error');
      }
    }

    if ($('[data-step="2"]').hasClass('active')) {
      if (!$('[name="consultSubject"]').is(':checked')) {
        $(this).parents('fieldset').children('.showErr').fadeIn();
        $(this)
          .parents('fieldset')
          .children('.showErr')
          .addClass('alert-danger');
        $(this)
          .parents('fieldset')
          .children('.showErr')
          .text('موضوع مشاوره را انتخاب نمائید');
        next_step = false;
        $('[name="consultSubject"]').change(function (e) {
          e.preventDefault();
          $(this).parents('fieldset').children('.showErr').fadeOut();
        });
      } else {
        $(this).parents('fieldset').children('.showErr').fadeOut();
      }
    }

    if (next_step) {
      parent_fieldset.fadeOut(400, function () {
        current_active_step
          .removeClass('active')
          .addClass('activated')
          .next()
          .addClass('active');
        bar_progress(progress_line, 'right');
        $(this).next().fadeIn();
        scroll_to_class($('.f1'), 20);
      });
    }
  });
  $('.f1 .btn-previous').on('click', function () {
    var current_active_step = $(this).parents('.f1').find('.f1-step.active');
    var progress_line = $(this).parents('.f1').find('.f1-progress-line');
    $(this)
      .parents('fieldset')
      .fadeOut(400, function () {
        current_active_step
          .removeClass('active')
          .prev()
          .removeClass('activated')
          .addClass('active');
        bar_progress(progress_line, 'left');
        $(this).prev().fadeIn();
        scroll_to_class($('.f1'), 20);
      });
  });
  $('#frmReqConsult').on('submit', function (e) {
    e.preventDefault();
    if ($('[data-step="3"]').hasClass('active')) {
      if (!$('[name="consultTime"]').is(':checked')) {
        $('.showErr').fadeIn();
        $('.showErr').addClass('alert-danger');
        $('.showErr').text('نحوه مشاوره را انتخاب نمائید');
        $('[name="consultTime"]').change(function (e) {
          e.preventDefault();
          consultTime = e.currentTarget.value;
          $('.showErr').fadeOut();
        });
      } else {
        swal
          .fire({
            width: 'auto',
            icon: 'success',
            title: 'موفقیت آمیز',
            text: `در خواست مشاوره شما با موضوع "${consultSubject}" و به صورت "${consultTime}" با موفقیت ثبت گردید، همکاران ما در اولین زمان اداری با شما تماس خواهند گرفت`,
            showCloseButton: true,
            showCancelButton: true,
            cancelButtonText: 'بستن',
            showConfirmButton: true,
            confirmButtonText: 'نمایش لیست',
          })
          .then((t) => {
            t.value && window.location.replace('https://google.com');
          });
      }
    }
  });
})(jQuery);

$(function () {
  $('#fileWorkExperience').change(function (e) {
    e.preventDefault();
    let inputAddress = e.currentTarget.value;
    $('.fileName').html(`<strong>آدرس فایل:</strong> ${inputAddress}`);
  });
});
