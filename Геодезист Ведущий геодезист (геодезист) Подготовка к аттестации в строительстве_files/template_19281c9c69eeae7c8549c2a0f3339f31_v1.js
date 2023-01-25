
; /* Start:"a:4:{s:4:"full";s:56:"/local/templates/canpay/js/testonline.js?164365010015217";s:6:"source";s:40:"/local/templates/canpay/js/testonline.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
// SCRIPT

var right_qu_line = 0;

$(document).ready(function(e) {
	$('[data-qu-list]').on('change', 'input[type=radio]', function (e) {
		var ans           = $(this).val();
		var qu            = $(this).data('qu');
		var section_id    = $(this).data('section-id');
        var qu_count      = $(this).data('qu-count');
        var redo      	  = $(this).data('redo');
		// 107894
		var ticket_num    = Math.ceil(qu_count/qu_test_qus);
        //console.log(ticket_num);
		var parent        = $(this).parent();
		var is_right      = $(this).data('is-right');

		if (redo == 'Y') {
			var sufix = '_REDO';
		} else {
			var sufix = '';
		}
		var qu_step = $('#qu_'+qu+sufix).data('ans-step');

		if (redo != 'Y') {
			add_stat (qu_step, is_right, qu_count);
		}
		//console.log('qu_step 1 = '+qu_step);

        if (qu_step == 1) {
            var qu_rate_now = parseInt(0 + $('#qu_rate > div').attr('aria-valuenow'));
			$.get('/include/ajax/ans.php?SECTION_ID='+section_id+'&RIGHT='+qu_rate_now+'&REDO='+redo+'&QU='+qu_count+'&ELEMENT_ID='+qu+'&MODE='+qu_mode+'&IS_RIGHT='+is_right+'&PAGE='+cur_page, function (data) {
                if (data.BALANCE) {
                    $('.user_balance').html(data.BALANCE.TIME);
                    $('.user_balance_money').html(data.BALANCE.PRINT);
                }
				//console.log(data);
			}, 'json');

			if (is_right == 'Y') {
				right_qu_line++;
			} else {
				right_qu_line = 0;
			}
			console.log('right_qu_line = ' + right_qu_line);
        }

        if (typeof(ar_ans[ticket_num]) == 'undefined') {
            ar_ans[ticket_num] = [0, 0];
        }
        if (ar_ans_ids.indexOf(qu_count) < 0) {
            ar_ans_ids.push(qu_count);
            ar_ans[ticket_num][0]++;
            $('#ans_'+ticket_num+'_total').html(ar_ans[ticket_num][0]);

            if (is_right == 'Y') {
                ar_ans[ticket_num][1]++;
                $('#ans_'+ticket_num+'_right').html(ar_ans[ticket_num][1]);
            } else {
                $('#ans_'+ticket_num+'_wrong').html(ar_ans[ticket_num][0] - ar_ans[ticket_num][1]);
            }

            $('.ans_'+ticket_num).hide();
            if (ar_ans[ticket_num][0] == qu_test_qus) {
                if (ar_ans[ticket_num][1] / ar_ans[ticket_num][0] >= success_text) {
                    $('#ans_'+ticket_num+'_success').show();
                    //console.log('_success');
                } else {
                    $('#ans_'+ticket_num+'_fail').show();
                    //console.log('_fail');
                }
            } else {
                $('#ans_'+ticket_num+'_process').show();
                //console.log('_process');
            }
        }

		console.log('sufix = '+sufix);

		if (is_right == 'Y') {
			$('.help_link_'+qu+sufix).show(); // for test mode

			parent.addClass('alert-success');

            $('.qu_'+qu+sufix+' input[type=radio]').prop('disabled', 'disabled');
            $(this).prop('disabled', '');

		} else {
			parent.addClass('alert-danger');
            $(this).prop('disabled', 'disabled');
		}
		qu_step += 1;


		//console.log('ticket_num = ' + ticket_num);
		//console.log('ar_ans = ');
		//console.log(ar_ans);

		$('#qu_'+qu+sufix).attr("data-ans-step", qu_step).data("ans-step", qu_step);

		//console.log('qu_step 3 = '+$('#qu_'+qu).data('ans-step'));

		/*$('#qu_rate > div').prop('aria-valuemax', <?=($total_qu * FIRST_ANS_POINTS)?>);
		$('#qu_first > div').prop('aria-valuemax', <?=$total_qu?>);
		$('#qu_second > div').prop('aria-valuemax', <?=$total_qu?>);*/



	});

	$('[data-toggle="tooltip"]').tooltip();

	$('#tarif').on('change', function() {
		toggle_change_tarif_button();
	});
	toggle_change_tarif_button();
});

function show_good (id) {
	console.log('show_good');
}

function merge () {
	var ar = [];
	$('.merge-input:checked').each(function(index) {
		ar.push(parseInt($(this).val()));
	});
	console.log(ar);

	ar.sort(function(a, b){ return a-b; });

	console.log(ar);
	var s = ar.join('_');
	window.location.href="/education/0-merge/?MERGE_SECTIONS="+s;
}

function toggle_change_tarif_button () {
	var tarif = $('#tarif').children("option:selected").val();
	if (tarif) {
		$('#change_tarif_button').prop('disabled', false);
	} else {
		$('#change_tarif_button').prop('disabled', 'disabled');
	}
}


$('#fff').submit(function(e) {
    e.preventDefault();

	console.log('change_tarif_form');
	console.log('change_tarif_done = '+change_tarif_done);

	return false;
});
$('#page_body .change_tarif_form').submit(function(e) {

    e.preventDefault();

	on_change_tarif_form ($(this));

	return false;
})

function found_error (id) {
	$.get('/include/ajax/found_error.php?ELEMENT_ID='+id, function(data){
		if (data.SUCCESS) {
			$('#alert_'+id).addClass('alert alert-success mt-3 text-center').html(data.SUCCESS).show();
			$('#alert_'+id+'_REDO').addClass('alert alert-success mt-3 text-center').html(data.SUCCESS).show();
		} else if (data.ERROR) {
			$('#alert_'+id).addClass('alert alert-danger mt-3 text-center').html(data.ERROR).show();
			$('#alert_'+id+'_REDO').addClass('alert alert-danger mt-3 text-center').html(data.ERROR).show();
		}
	}, 'json');
}

function change_tarif (section_id) {
	var tarif = '';

	$.get('/include/ajax/change_tarif.php?SECTION_ID='+section_id+tarif, function(data){
		console.log(data);

		if (data.SUCCESS) {
			//console.log('reload');
			window.location.reload();
		} else if (data.ERROR) {
			$('.tarif_error').html(data.ERROR).show();
		}
	}, 'json');
}

var change_tarif_done = false;
function on_change_tarif_form (obj) {
	console.log('change_tarif_form');
	console.log('change_tarif_done = '+change_tarif_done);

	if (!change_tarif_done) {
		change_tarif_done = true;
		var section_id = obj.find('[name="SECTION_ID"]').val();
		var tarif_obj = obj.find('[name="TARIF[]"]');

		console.log('section_id = ' + section_id);
		console.log('tarif_obj = ' + tarif_obj);

		if (typeof(tarif_obj.val()) !== 'undefined') {
			var tarif = '&TARIF='+tarif_obj.val();
		} else {
			var tarif = '';
		}

		$.get('/include/ajax/change_tarif.php?SECTION_ID='+section_id+tarif, function(data){
			console.log(data);

			if (data.SUCCESS) {
				//console.log('reload');
				window.location.reload();
			} else if (data.ERROR) {
				$('.tarif_error').html(data.ERROR).show();
			}
		}, 'json');
	}
}
function update_balance (time, money) {
	$('.user_balance').html(time);
	$('.user_balance_money').html(money);
}
function click_help (id) {
	$('#help_'+id).slideToggle('fast');

	$.get('/include/ajax/click.php', function(data){
		//console.log(data);
		if (data.BALANCE.VALUE > 0) {
			$('.user_balance').html(data.BALANCE.TIME);
			$('.user_balance_money').html(data.BALANCE.PRINT);
		} else {
			$('#help_'+id+' .card-body').html('<div class="alert alert-danger">Для продолжения работы необходимо <a href="/personal/account/">пополнить баланс</a></div>');
		}
	}, "json").fail(function() {
		$('#help_'+id+' .card-body').html('<div class="alert alert-danger">Ошибка подключения к сайту (проверьте подключение к сети Интернет).</div>');
	});
}
function add_stat (qu_step, is_right, qu_count) {
    //console.log('qu_step add_stat = '+qu_step);
    //console.log('is_right add_stat = '+is_right);
    //console.log('qu_count add_stat = '+qu_count);

    var qu_progress_now = parseInt(0 + $('#qu_progress > div').attr('aria-valuenow'));
    var qu_progress_max = $('#qu_progress > div').attr('aria-valuemax');
    if (qu_step == 1) {
        if (qu_count > qu_progress_now) {
            qu_progress_now = qu_count;
        }
    }

    var qu_rate_now = parseInt(0 + $('#qu_rate > div').attr('aria-valuenow'));
    var qu_rate_max = qu_progress_now;
    if (qu_step == 1 && is_right == 'Y') {
        if (qu_count >= qu_progress_now) {
            qu_rate_now += 1;
        }
    }

    update_stat_sub (qu_progress_now, qu_progress_max, qu_rate_now, qu_rate_max);
}
function update_stat_sub (qu_progress_now, qu_progress_max, qu_rate_now, qu_rate_max) {
    var qu_progress_percent = Math.round(100*qu_progress_now/qu_progress_max);
    var qu_rate_percent = Math.round(100*qu_rate_now/qu_rate_max);
    var qu_chance_percent = Math.round(100*qu_rate_now/qu_progress_max);

    if (qu_progress_now) {
        $('#qu_progress > div').attr('aria-valuenow', qu_progress_now).css('width', qu_progress_percent+'%').html(qu_progress_now+'/'+qu_progress_max);
    }


    if (qu_rate_now) {
        $('#qu_rate > div').attr('aria-valuenow', qu_rate_now).attr('aria-valuemax', qu_progress_now).css('width', qu_rate_percent+'%').html(qu_rate_percent+'%');

        $('#qu_chance > div').attr('aria-valuenow', qu_rate_now).attr('aria-valuemax', qu_progress_max).css('width', qu_chance_percent+'%').html(qu_chance_percent+'%');
    }

}
function start_timer (sec) {
    $('#section_balance');
}
function sum_to_hour (sum) {
    var minutes_all = Math.floor(sum/minute_cost);
    var hours = 0 + Math.floor(minutes_all/60);
    var minutes =  minutes_all - hours*60;
    return [hours, minutes];
}
$('#BUY_SUM').on('keyup', function(e) {
    calc_time('keyup');
    calc_bonus();
});
$('#BUY_SUM').on('change', function(e) {
    calc_time('change');
    calc_bonus();
});
function calc_time (mode) {
    var sum = $('#BUY_SUM').val();
    if (mode == 'change' && sum < min_sum) {
        sum = min_sum;
        $('#BUY_SUM').val(sum);
    }
	var days = sum_to_day (sum);
    var arTime = sum_to_hour (sum);
    $('#BUY_TIME').val(arTime[0]+'ч '+arTime[1]+'м или '+days);
}
function sum_to_day (sum) {
	var res = '0 суток';
	sum = parseInt(sum);
	for (var key in day_cost) {
		var obj = day_cost[key];
		if (sum >= obj.PRICE) {
			res = obj.NAME;
		}
	}
    return res;
}

function calc_bonus () {
    var sum = $('#BUY_SUM').val();
    var bonus = 0;
    if (sum < arBonus[0][0]) {
        // do nothing

    } else if (sum < arBonus[1][0]) {
        bonus = arBonus[0][1];

    } else if (sum < arBonus[2][0]) {
        bonus = arBonus[1][1];

    } else if (sum < arBonus[3][0]) {
        bonus = arBonus[2][1];
    } else {
        bonus = arBonus[3][1];
    }
    if (bonus) {
        var arTime = sum_to_hour (sum * bonus / 100);
        $('#BUY_BONUS').val((sum * bonus / 100) + ' руб. или '+ arTime[0]+'ч '+arTime[1]+'м');
    } else {
        $('#BUY_BONUS').val('-');
    }
}
function pm_text_limit (id) {
	var val = $('#'+id).val();
	var len = val.length;
	var limit = $('#'+id).data('limit');

	if (len <= limit) {
		$('#'+id+'_LIMIT span').html(limit - len);
	} else {
		$('#'+id).val(val.substr(0, limit));
	}
}
function pm_scroll_to (target, time, offset) {
	$('html, body').animate({
		scrollTop: target.offset().top + offset
	}, time);
}
var wait_timer_id;
var wait_timer_sec = 0;
function wait_timer_start (sec) {
	clearInterval(wait_timer_id);
	wait_timer_sec = sec;
	wait_timer_id = setInterval(wait_timer_do, 1000);
}
function wait_timer_do () {
	if (wait_timer_sec) {
		wait_timer_sec--;
		$('.WAIT_COUNTER').html(wait_timer_sec);
	} else {
		clearInterval(wait_timer_id);
		$('.WAIT_COUNTER_ALERT').hide();
	}
}
(function ($) {
	$.fn.countdown = function (options, callback) {
		var settings = $.extend({
			date: null,
			offset: null,
			day: 'Day',
			days: 'Days',
			hour: 'Hour',
			hours: 'Hours',
			minute: 'Minute',
			minutes: 'Minutes',
			second: 'Second',
			seconds: 'Seconds',
			hideOnComplete: false
		}, options);

		// Throw error if date is not set
		if (!settings.date) {
			$.error('Date is not defined.');
		}

		// Throw error if date is set incorectly
		if (!Date.parse(settings.date)) {
			$.error('Incorrect date format, it should look like this, 12/24/2012 12:00:00.');
		}

		// Save container
		var container = this;

		/**
		 * Change client's local date to match offset timezone
		 * @return {Object} Fixed Date object.
		 */
		var currentDate = function () {
			// get client's current date
			var date = new Date();

			// turn date to utc
			var utc = date.getTime() + (date.getTimezoneOffset() * 60000);

			// set new Date object
			var new_date = new Date(utc + (3600000*settings.offset));

			return new_date;
		};

		/**
		 * Main countdown function that calculates everything
		 */
		function countdown() {
			var target_date = new Date(settings.date), // set target date
				current_date = currentDate(); // get fixed current date

			// difference of dates
			var difference = target_date - current_date;

			// if difference is negative than it's pass the target date
			if (difference < 0) {
				// stop timer
				clearInterval(interval);

				if (settings.hideOnComplete) {
					$(container).hide();
				}

				if (callback && typeof callback === 'function') {
					callback(container);
				}

				return;
			}

			// basic math variables
			var _second = 1000,
				_minute = _second * 60,
				_hour = _minute * 60,
				_day = _hour * 24;

			// calculate dates
			var days = Math.floor(difference / _day),
				hours = Math.floor((difference % _day) / _hour),
				minutes = Math.floor((difference % _hour) / _minute),
				seconds = Math.floor((difference % _minute) / _second);

			// based on the date change the refrence wording
			var text_days = (days === 1) ? settings.day : settings.days,
				text_hours = (hours === 1) ? settings.hour : settings.hours,
				text_minutes = (minutes === 1) ? settings.minute : settings.minutes,
				text_seconds = (seconds === 1) ? settings.second : settings.seconds;

				// fix dates so that it will show two digets
				days = (String(days).length >= 2) ? days : '0' + days;
				hours = (String(hours).length >= 2) ? hours : '0' + hours;
				minutes = (String(minutes).length >= 2) ? minutes : '0' + minutes;
				seconds = (String(seconds).length >= 2) ? seconds : '0' + seconds;

			// set to DOM
			container.find('.days').text(days);
			container.find('.hours').text(hours);
			container.find('.minutes').text(minutes);
			container.find('.seconds').text(seconds);

			container.find('.days_text').text(text_days);
			container.find('.hours_text').text(text_hours);
			container.find('.minutes_text').text(text_minutes);
			container.find('.seconds_text').text(text_seconds);
		}

		// start
		var interval = setInterval(countdown, 1000);
	};

})(jQuery);

$('#add_reply').submit(function(e) {
	e.preventDefault();
    $([document.documentElement, document.body]).animate({
        scrollTop: $('#reply_main_div').offset().top
    }, 2000);
	$('#reply_main_div').hide();
	$.post($(this).attr('action'), $(this).serialize())
	.done(function( data ) {
		if (data == 'SUCCESS') {
			$('#reply_success_div').show();
		} else {
			$('#reply_error_div').show();
		}
	});
	return false;
})

/* End */
;; /* /local/templates/canpay/js/testonline.js?164365010015217*/
