function is_int(input) {
    return (parseFloat(input) == input);
}
jQuery(document).ready(function ($) {
    $(".js-vote-rating").click(function () {	
		var what_search = $(this).parent().data('target-type');
		var search_id = $(this).parent().data('target-id');
        if (is_int($.trim($(this).html()))) {
            ls.voter.getInfo({
                type: what_search,
                button: this,
                id: search_id
            });
        }
        return false;
    }); 
});

			
var ls = ls || {};

ls.voter = (function ($) {

    this.closeDiv = function () {
        $('#vs-vote').css('display', 'none');
        $(ls.voter.button).removeClass('js-vs');
        $(ls.voter.button).removeClass('js-vs_waiting');
        ls.voter.opened = false;		
    },

    this.getInfo = function (params) {
		if ($('#vs-votequestion').length) {
			ls.voterquestion.closeDiv();
		}
        if ($('#vs-vote').length) {
		
            $('#vs-vote .vs_plus_users').height(0);


            if ($(params.button).hasClass('js-vs_loading')) {
                return false;
            }
            if ($(params.button).hasClass('js-vs')) {
                ls.voter.closeDiv();
                return false;
            }
            if (ls.voter.loading) {
                ls.voter.closeDiv();
            }
            if (ls.voter.opened) {
                ls.voter.closeDiv();
            }
            ls.voter.loading = true;
            ls.voter.button = params.button;
            $(params.button).addClass('js-vs_loading');

            var params_to = {};
            params_to['id'] = params.id;
            params_to['what'] = params.type;
            params_to['security_ls_key'] = ALTO_SECURITY_KEY;
            var data = params_to;
            var url = aRouter['ajax'] + 'vote/whovote/';

            $(params.button).addClass('js-vs_waiting');
            ls.ajax(url, params_to, function (response) {
                if (!response) {
                    ls.msg.error('Error', 'Please try again later');
                }
                if (response.bStateError) {
                    ls.msg.error(response.sMsgTitle, response.sMsg);
                } else {
                    $(params.button).removeClass('js-vs_loading');
                    if (!$(params.button).hasClass('js-vs_waiting')) {
                        return false;
                    }
                    ls.voter.loading = false;
                    $(params.button).removeClass('js-vs_waiting');
                    $(params.button).addClass('js-vs');
                    plus_minus = '';
					rating_class=' class="none" ';
                    if (response.rating > 0){ plus_minus = '+'; rating_class=' class="green" ';}
					if (response.rating < 0){  rating_class=' class="red" ';}
                    if (params.type == 'topic') {
                        $('#vs-vote .vs_header').html( ls.lang.get('plugin.voter.topic_rating') + ' <em' + rating_class + '>' + plus_minus + response.rating + '</em>');
                        $(params.button).html(plus_minus + response.rating);
                    }
                    if (params.type == 'comment') {
                        $('#vs-vote .vs_header').html( ls.lang.get('plugin.voter.comment_rating') + ' <em' + rating_class + '>' + plus_minus + response.rating + '</em>');
                        $(params.button).html(plus_minus + response.rating);
                    }
                    if (params.type == 'user') {
                        $('#vs-vote .vs_header').html( ls.lang.get('plugin.voter.user_rating') + ' <em' + rating_class + '>' + plus_minus + response.rating + '</em>');
                        $(params.button).html(plus_minus + response.rating);
                    }
                    if (params.type == 'blog') {
                        $('#vs-vote .vs_header').html( ls.lang.get('plugin.voter.blog_rating') + ' <em' + rating_class + '>' + plus_minus + response.rating + '</em>');
                        $(params.button).html(plus_minus + response.rating);
                    }
                    var minusArray = [
                        []
                    ];
                    var plusArray = [
                        []
                    ];
                    var minusPageCounter = 0;
                    var plusPageCounter = 0;
					if (response.votes.length > 0){
						$('#vs-vote .vs_users_table_holder').css('display', 'block');
					}else{
						$('#vs-vote .vs_users_table_holder').css('display', 'none');
					}
                    $.each(response.votes, function () {

                        if (this.attitude >= 0) {
                            if (plusArray[plusPageCounter].length == 20) {
                                plusArray[++plusPageCounter] = [];
                            }
                            plusArray[plusPageCounter].push(this);
                        } else {
                            if (minusArray[minusPageCounter].length == 20) {
                                minusArray[++minusPageCounter] = [];
                            }
                            minusArray[minusPageCounter].push(this);
                        }
                    });
                    var minusCol = minusPageCounter * 20 + minusArray[minusPageCounter].length;
                    var plusCol = plusPageCounter * 20 + plusArray[plusPageCounter].length;
                    if (plusPageCounter >= minusPageCounter) {
                        var overallPages = plusPageCounter + 1;
                    } else {
                        var overallPages = minusPageCounter + 1;
                    }
                    ls.voter.overallPages = overallPages;
                    ls.voter.plusArray = plusArray;
                    ls.voter.minusArray = minusArray;
                    ls.voter.activePage = 0;
                    if (plusPageCounter < 1 && minusPageCounter < 1) {
                        $('#vs-vote').find('.vs_paginator, .vs_user_prev, .vs_user_next').css('display', 'none');
                    } else {
                        $('#vs-vote').find('.vs_paginator, .vs_user_next').css('display', 'block');
                        $('#vs-vote .vs_user_prev').css('display', 'none');
                        var html_addpaginator = '';
                        html_addpaginator += '<a href="#" onclick="ls.voter.setPage(0); return false;" class="active"> </a>';
                        for (var i = 1; i < overallPages; i++) {
                            html_addpaginator += '<a href="#" onclick="ls.voter.setPage(' + i + '); return false;"> </a>';
                        }
                        $('#vs-vote .vs_pag_inner_2').html(html_addpaginator);
                    }
                    if (plusCol == 0) {
                        var html_addplus = '<ul class="vs_users"></ul>';
                    } else {
                        var html_addplus = '<ul class="vs_users">';
                        html_addplus += ls.voter.createUsersLi(plusArray[0]);
                        html_addplus += '</ul>';
                    }
                    if (minusCol == 0) {
                        var html_addminus = '<ul class="vs_users"></ul>';
                    } else {

                        var html_addminus = '<ul class="vs_users">';
                        html_addminus += ls.voter.createUsersLi(minusArray[0]);
                        html_addminus += '</ul>';
                    }
                    html_addplus = '<h4>'+ls.lang.get('plugin.voter.vote_plus')+': ' + plusCol + '</h4>' + html_addplus;
                    html_addminus = '<h4>'+ls.lang.get('plugin.voter.vote_minus')+': ' + minusCol + '</h4>' + html_addminus;
                    if (plusCol == 0 && minusCol == 0 && (response.abstain === undefined || response.abstain == 0)) {
                        html_addplus = '';
                        html_addminus = '';
                        $('#vs-vote .vs_header').html($('#vs-vote .vs_header').html() + '<br />'+ls.lang.get('plugin.voter.nobody_vote'));
                        $('#vs-vote .vs_users_table').addClass('hidden');
                    } else {
                        if (response.abstain !== undefined) {
                            $('#vs-vote .vs_header').html($('#vs-vote .vs_header').html() + '<br /><span class="abstain_result">'+ls.lang.get('topic_question_abstain_result')+': ' + response.abstain + '</span>');

                        }
                        $('#vs-vote .vs_users_table').removeClass('hidden');
                    }

                    $('#vs-vote .vs_plus_users').html(html_addplus);
                    $('#vs-vote .vs_minus_users').html(html_addminus);
                    if (params.type == 'topic' || params.type == 'blog' || params.type == 'user') {
                        $('#vs-vote').css({
                            'display': 'block',
                            'position': 'absolute',
                            'top': '-10000px',
                            'left': '-10000px'
                        });
                        var offset = $(params.button).offset();
                        var x = offset.left;
                        var y = offset.top;
                        var y1 = $(params.button).offset().top - $(window).scrollTop();
                        var y2 = $(window).height() - y1 - $(params.button).height();
                        var win_height = $('#vs-vote').height();
                        if (y1 <= y2) {
                            var putToBottom = true;
                        } else {
                            var putToBottom = false;
                        }
                        if (!putToBottom) {
                            if ($(params.button).offset().top <= win_height) {
                                putToBottom = true;
                            }
                        }

                        if (putToBottom) {
                            $('#vs-vote').css({
                                'top': $(params.button).offset().top + $(params.button).height() + 'px',
                                'left': ($(params.button).offset().left -15) + 'px'
                            });
                            $('#vs-vote .vs_arrow_bubble_top').css('display', 'block');
                            $('#vs-vote .vs_arrow_bubble_bottom').css('display', 'none');
                        } else {
                            $('#vs-vote').css({
                                'top': $(params.button).offset().top - win_height  + 'px',
                                'left': ($(params.button).offset().left-15) + 'px'
                            });
                            $('#vs-vote .vs_arrow_bubble_top').css('display', 'none');
                            $('#vs-vote .vs_arrow_bubble_bottom').css('display', 'block');
                        }
                    }
                    if (params.type == 'comment') {
                        $('#vs-vote').css({
                            'display': 'block',
                            'position': 'absolute',
                            'top': '-10000px',
                            'left': '-10000px'
                        });
                        var y1 = $(params.button).offset().top - $(window).scrollTop();
                        var y2 = $(window).height() - y1 - $(params.button).height();
                        var win_height = $('#vs-vote').height();
                        if (y1 <= y2) {
                            var putToBottom = true;
                        } else {
                            var putToBottom = false;
                        }
                        if (!putToBottom) {
                            if ($(params.button).offset().top <= win_height) {
                                putToBottom = true;
                            }
                        }
                        if (putToBottom) {
                            $('#vs-vote').css({
                                'top': $(params.button).offset().top + $(params.button).height() + 3 + 'px',
                                'left': $(params.button).offset().left - 25 + 'px'
                            });
                            $('#vs-vote .vs_arrow_bubble_top').css('display', 'block'); 
                            $('#vs-vote .vs_arrow_bubble_bottom').css('display', 'none');
                        } else {
                            $('#vs-vote').css({
                                'top': $(params.button).offset().top - win_height + 3 + 'px',
                                'left': $(params.button).offset().left - 25 + 'px'
                            });
                            $('#vs-vote .vs_arrow_bubble_top').css('display', 'none');
                            $('#vs-vote .vs_arrow_bubble_bottom').css('display', 'block');
                        }
                    }
                    ls.voter.opened = true;
                    ls.voter.height_td = $('#vs-vote .vs_plus_users').height();
                }
            });									
        }
    },
    this.prevPage = function () {
        ls.voter.setPage(ls.voter.activePage - 1);
    },
    this.nextPage = function () {
        ls.voter.setPage(ls.voter.activePage + 1);
    },
    this.setPage = function (num) {
        var html_addplus = '';
        $('#vs-vote .vs_plus_users').height(ls.voter.height_td);
        if (num != ls.voter.activePage) {
            ls.voter.activePage = num;
            if (num == ls.voter.overallPages - 1) {
                $('#vs-vote .vs_user_next').css('display', 'none');
            } else {
                $('#vs-vote .vs_user_next').css('display', 'block');
            }
            if (num == 0) {
                $('#vs-vote .vs_user_prev').css('display', 'none');
            } else {
                $('#vs-vote .vs_user_prev').css('display', 'block');
            }
            $('#vs-vote .vs_paginator .active').removeClass('active');
            $('#vs-vote .vs_paginator a:eq(' + num + ')').addClass('active');
            var html_addplus = '';
            if (ls.voter.plusArray[num]) {
                html_addplus += ls.voter.createUsersLi(ls.voter.plusArray[num]);
            }
            $('#vs-vote .vs_plus_users .vs_users').html(html_addplus);
            var html_addminus = '';
            if (ls.voter.minusArray[num]) {
                html_addminus += ls.voter.createUsersLi(ls.voter.minusArray[num]);
            }
            $('#vs-vote .vs_minus_users .vs_users').html(html_addminus);
        }
    },

    this.createUsersLi = function (people) {
        var html_add = ''; 
        $.each(people, function () {
            html_add += '<li>';
            html_add += '<a href="' + aRouter['profile'] + this.login + '">' + this.login + '</a> ';
			plus_minus = ''; 
            if (this.attitude > 0)plus_minus = '+'; 
            html_add += '<span class="user_count_st">' + plus_minus + this.attitude + '</span>';
            html_add += '</li>';
        }); 
        return html_add;
    }

    return this;
}).call(ls.voter || {}, jQuery);