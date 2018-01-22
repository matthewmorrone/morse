(function($){
	$.fn.shuffle = function() {
		return this.each(function(){
			var items = $(this).find('tr') || $(this).children();
			return (items.length) ? $(this).html($.shuffle(items)) : this;
		});
	}
	$.shuffle = function(arr) {
		for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
		return arr;
	}
})(jQuery);

$(function() {
	$("nav div").click(function() {
 		$(".selected").removeClass("selected")
 		$(this).addClass("selected")
 		$('article').hide()
 		$("#" + $(this).attr('page')).show()
 	})
 	$("div[page='3']").click()
	$("div[page='3']").click(function() {
		$('#guess').focus()
	})

	$("#showall").click(function() {
		if ($(this).is(":checked")) {
			$("#1 tr").each(function() {
				if ($(this).find("th").text() == "_") {
					$(this).show()
				}
			})
		}
		else {
			$("#1 tr").each(function() {
				if ($(this).find("th").text() == "_") {
					$(this).hide()
				}
			})
		}
	}).click().click()

 	var encodex = "{", decodex = "{", str, result, i, j
	$("#all tr").each(function() {
		encodex += "\"" + $(this).find("th").html().trim() + "\"" + ": \"" + $(this).find("td").html().trim() + "\","
		decodex += "\"" + $(this).find("td").html().trim() + "\"" + ": \"" + $(this).find("th").html().trim() + "\","
	})
	encodex = encodex.substring(0, encodex.length-1)
	decodex = decodex.substring(0, decodex.length-1)
	encodex += "}"
	decodex += "}"
	encodex = $.parseJSON(encodex)
	decodex = $.parseJSON(decodex)

	$("#t1").keyup(function() {
		$("#readout tr").html("")
		$(this).val($(this).val().toUpperCase())
		str = $(this).val().split('')
		result = ""

		str.map(function(a, b) {
			if (a == " ") {
				result += " ";
				return
			}
			if (typeof encodex[a] == "undefined") {
				result += "";
				return
			}
			$("#readout tr").append($("#tables").find("th." + a).parent().find("td").clone())
			result += encodex[a] + " "
		})
		$("#t2").val(result)
	})
	$("#t2").keyup(function(e) {
		$("#readout tr").html("")

		str = $(this).val().split(/\s/)
		result = ""
		str.map(function(a, b) {
			if (typeof decodex[a] == "undefined") {
				result += "";
				return
			}
			result += decodex[a]
			$("#readout tr").append($("#tables").find("th." + decodex[a]).parent().find("td").clone())
		})
		$("#t1").val(result)
	})
	$("#t2").keydown(function(e) {
		if ([8, 13, 32, 189, 190].includes(e.which)) {

		}
		else {
			e.preventDefault()
			$(this).val($(this).val().substring(0, $(this).val().length-1))
		}
	})

	$(".play").click(function(e) {
		$("#readout audio").eq(0).get(0).play()
		i = 1
		$("#readout audio").on("ended", function() {
			if (!$("#readout audio").eq(i).get(0)) return
			$("#readout audio").eq(i).get(0).play()
			i++
		})
	})
	
	var mode = false
	$('#mode').click(function() {		mode = !mode		$('#dot, #dash').toggle()	})


	function bool(string){
		string = string+""
    	switch(string.toLowerCase().trim()){
        	case "true": case "yes": case "1": return true;
        	case "false": case "no": case "0": case null: return false;
        	default: return Boolean(string);
    	}
	}
	var counts = [2, 4, 8, 12]
	function total() {
		return Array.from($('.lenControl').map(function(a, b) {
			return $(b).is(':checked') ? counts[a] : 0
		})).reduce(function(a, b) {
			return a + b
		})
	}

	var j = 0, lens, lett, code, title = document.title, score = 0, count = 0

	$("#flashcard").click(function() {
		$('#guess').removeAttr('disabled')
		$('#guess').focus()
		$("#guess").val("").css("background-color", "rgb(255, 255, 255)")
		
		lens = Array.from($('.lenControl').map(function(a, b) {
			return $(b).is(':checked')
		}))
		lett = $("#all").find("th").eq(j).html()
		code = $("#all").find("td").eq(j).html()
		if (!lens[code.length-1] || lett === "_") {
			j++
			$("#flashcard").click()
			return
		}
		$(this).html($("#all").find(mode ? 'td' : 'th').eq(j).html())
		j++
	})

	var bs = 8
	var enter = 13
	var space = 32
	var dot = 190
	var dash = 191	var wrongs = []
	$("#guess").keydown(function(e) {		$(this).val($(this).val().toUpperCase())
		if (mode === false) {
			e.preventDefault()
			if (e.which === bs) {
				$(this).val($(this).val().slice(0, -1))
			}
			if (e.which === dot) {
				$(this).val($(this).val()+'.')
			}
			if (e.which === dash) {
				$(this).val($(this).val()+'-')
			}
		}		if (e.which === enter || e.which === space) {
			$('#submit').click()
		}
	})
	$("#guess").keyup(function(e) {
		e.preventDefault()		$(this).val($(this).val().toUpperCase())

	})
	$('#dot').click(function() {
		$('#guess').val($('#guess').val()+'.')
		$('#guess').keyup().focus()
	})
	$('#dash').click(function() {
		$('#guess').val($('#guess').val()+'-')
		$('#guess').keyup().focus()
	})
	$('#submit').click(function() {
		var guess = $('#guess').val(),
			a = $("#flashcard").html(),
			check = mode ? encodex[guess] : decodex[guess],
			b = mode ? decodex[a] : encodex[a]

		$('#guess').css("background-color", "rgb(255, 255, 255)")
		if (check == a) {
			$('#guess').css('background-color', 'rgb(0, 128, 0)')
			score++
		}
		else {
			$('#guess').css('background-color', 'rgb(255, 0, 0)')			wrongs.push([guess, a, check, b])			$('#wrongs').html(wrongs)
		}		count++		setTimeout(function() {			if (count == total()) {
				document.title = `${title} (${score}/${count}/${total()})`

				alert(`${score}/${count}/${total()}`)
				$('#guess').html('')
				$('#flashcard').html('Start')
				$('#guess').attr('disabled', true)
				$('#guess').focus()
				$("#guess").val("").css("background-color", "rgb(255, 255, 255)")
				j = 0				score = 0
				count = 0				wrongs = []
				$('#shuffle').click()
	
				document.title = `${title} (${score}/${count}/${total()})`
			}
			else { 				document.title = `${title} (${score}/${count}/${total()})`
				$("#flashcard").click()
				$('#guess').focus()
			}
		}, 1500)
	})

	$('.lenControl').each(function(a, b) {
		$(b).prop('checked', bool(localStorage.getItem($(b).attr('id'))))
	})
	$(document).on('click', '.lenControl', function() {
		$('.lenControl').each(function(a, b) {
			localStorage.setItem($(b).attr('id'), bool($(b).is(':checked')))
		})
		$('#guess').focus()
		document.title = title + " (" + score + "/" + total() + ")"
		
	})
	$('#shuffle').click(function() {
		$('#all').shuffle()
		$('#guess').keyup().focus()
	}).click()


	simple_chart_config = {
		chart: {
			container: "#codetree",
			rootOrientation: 'WEST',
			hideRootNode: true,
			connectors: {
				type: 'bCurve',
			},
			animation: {
				nodeAnimation: "easeOutBounce",
				nodeSpeed: 700,
				connectorsAnimation: "bounce",
				connectorsSpeed: 700
			},
			// padding: 25,
			levelSeparation:   20,
			siblingSeparation: 0,
			subTreeSeparation: 0
		},
		nodeStructure: {
			text: {name: "start"},
			children: [{
				text: {name: "."},
				children: [{
					text: {name: ".."},
					children: [{
						text: {name: "..."},
						children: [{
							text: {name: "...."},
						},{
							text: {name: "...-"},
						}],
					},{
						text: {name: "..-"},
						children: [{
							text: {name: "..-."},
						},{
							text: {name: "..--"},
						}],
					}]
				},{
					text: {name: "-."},
					children: [{
						text: {name: "-.."},
						children: [{
							text: {name: "-..."},
						},{
							text: {name: "-..-"},
						}],
					},{
						text: {name: "-.-"},
						children: [{
							text: {name: "-.-."},
						},{
							text: {name: "-.--"},
						}],
					}]
				}]
			},{
				text: {name: "-"},
				children: [{
					text: {name: "-."},
					children: [{
						text: {name: "-.."},
						children: [{
							text: {name: "-..."},
						},{
							text: {name: "-..-"},
						}],
					},{
						text: {name: "-.-"},
						children: [{
							text: {name: "--."},
						},{
							text: {name: "---"},
						}],
					}]
				},{
					text: {name: "--"},
					children: [{
						text: {name: "--."},
						children: [{
							text: {name: "--.."},
						},{
							text: {name: "--.-"},
						}],
					},{
						text: {name: "---"},
						children: [{
							text: {name: "---."},
						},{
							text: {name: "----"},
						}],
					}]
				}]
			}]
		}
	};
	var my_chart = new Treant(simple_chart_config);
	function cmb(arr, n) {
		var result = [];
		for(var i = 1; i <= n; i++) {
			result = result.concat(Combinatorics.baseN(arr, i).toArray())
		}
		return result;
	}

	$("a.sound").click(function(e) {
		$(this).next('audio').get(0).play()
	})
	$("table tbody, div").disableSelection()

	$(document).on('mouseenter', '.node', function() {
		$(this).addClass('invert')
		$('a:contains("'+$(this).text()+'")').parents('tr').addClass('invert')
	})
	.on('mouseleave', '.node', function() {
		$(this).removeClass('invert')
		$('.invert').removeClass('invert')
	})

	var cheat = $('#tables').clone()
	cheat.attr('id', 'cheat')
	$('#game').after(cheat)
	$('#cheat').toggle()

	$(document).on('keydown', function(e) {
		if (e.which === 27 && $("div[page='3']").is(':visible')) {
			$('#cheat').toggle()
		}
	})

return

	$("#tables tbody").sortable({
		snap: true,
		helper: "clone",
		handle: "th",
		connectWith: "#tables tbody"
	});
	$(".accept").droppable({
		drop: function(event, ui) {
			$(this).css("background-color", "rgba(0, 255, 0, .5)")
		},
		out: function(event, ui) {
			$(this).css("background-color", "rgba(255, 255, 255, 1)")
		}
	})

	$("th, td").each(function() {
		$(this).data({
			'originalLeft': $(this).css('left'),
			'originalTop':  $(this).css('top')
		})
	})

	$("#revert").click(function() {
		$("th, td").each(function() {
			$(this).css({
				'left': $(this).data('originalLeft'),
				'top':  $(this).data('originalTop')
			})
		})
	})

	$("#all").shuffleRows()

})