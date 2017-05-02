
var resistances = ["acid","bludgeoning","cold","fire","force","lightning","necrotic","piercing","poison", "psychic", "radiant","slashing","thunder"];
var immunities = ["acid","bludgeoning","cold","fire","force","lightning","necrotic","piercing","poison", "psychic", "radiant","slashing","thunder"];


var options = [];
$( '.dropdown-menu a' ).on( 'click', function( event ) {

	var $target = $( event.currentTarget ),
		val = $target.attr( 'data-value' ),
		$inp = $target.find( 'input' ),
		idx;

	if ( ( idx = options.indexOf( val ) ) > -1 ) {
		options.splice( idx, 1 );
		setTimeout( function() { $inp.prop( 'checked', false ) }, 0);
	} else {
		options.push( val );
		setTimeout( function() { $inp.prop( 'checked', true ) }, 0);
	}

	$( event.target ).blur();
	  
	console.log( options );
	return false;
});

$(".add").click(function() {
	$(".arena").hide();
	$("body").prepend("<div class=\"adder\"></div>");
	// title
	$(".adder").append("<div class=\"container options\"><div class=\"row\"><h3 class=\"col-md-12 col-lg-12\">Add Creature</h3></div></div>");

	var row = '<div class="row">';
	var text = '<div class="row"><div class="col-md-2 col-md-offset-1 col-lg-2 col-lg-offset-1">';
	var input = '<div class="col-md-8 col-md-offset-1 col-lg-6 col-lg-offset-1">';
	var divClose = '</div>';

	// name
	$(".options").append(text + '<h4>Name</h4>' + divClose + input + '<input type="text" class="form-control creature-name" placeholder="Spooky Monster">' + divClose + divClose);
	// AC
	$(".options").append(text + '<h4>AC</h4>' + divClose + input + '<input type="number" class="form-control creature-ac" placeholder="0">' + divClose + divClose);
	// HP
	$(".options").append(text + '<h4>Hit points</h4>' + divClose + input + '<input type="number" class="form-control creature-hp" placeholder="0">' + divClose + divClose);
	// STR
	$(".options").append(text + '<h4>Strength</h4>' + divClose + input + '<input type="number" class="form-control creature-str" placeholder="10">' + divClose + divClose);
	// DEX
	$(".options").append(text + '<h4>Dexterity</h4>' + divClose + input + '<input type="number" class="form-control creature-dex" placeholder="10">' + divClose + divClose);
	// CON
	$(".options").append(text + '<h4>Constitution</h4>' + divClose + input + '<input type="number" class="form-control creature-con" placeholder="10">' + divClose + divClose);
	// INT
	$(".options").append(text + '<h4>Intelligence</h4>' + divClose + input + '<input type="number" class="form-control creature-int" placeholder="10">' + divClose + divClose);
	// WIS
	$(".options").append(text + '<h4>Wisdom</h4>' + divClose + input + '<input type="number" class="form-control creature-wis" placeholder="10">' + divClose + divClose);
	// CHA
	$(".options").append(text + '<h4>Charisma</h4>' + divClose + input + '<input type="number" class="form-control creature-cha" placeholder="10">' + divClose + divClose);
	// resistances

	// buttons for resistance and immunity dialogues
	$(".options").append(row + '<div class="res-btn col-md-11 col-md-offset-1 col-lg-8 col-lg-offset-1">' + divClose + '<div class="imm-btn col-md-11 col-md-offset-1 col-lg-8 col-lg-offset-1">' + divClose + divClose);
	$(".res-btn").append('<button type="button" class="btn btn-primary" data-toggle="modal" data-target=".res-modal">Resistances</button>');
	$(".imm-btn").append('<button type="button" class="btn btn-primary" data-toggle="modal" data-target=".imm-modal">Immunities</button>');

	// resistence pop-out
	$(".options").append('<div class="res-modal modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"></div>');
	$(".res-modal").append('<div class="modal-dialog modal-sm" role="document"><div class="res-modal-content modal-content"></div></div>');
	$(".res-modal-content").append('<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="gridSystemModalLabel">Modal title</h4></div>');
	$(".res-modal-content").append('<div class="modal-body"><div class="row"><div class="col-md-8 col-md-offset-1 col-lg-8 col-lg-offset-1"><ul class="resistances" style="list-style-type:none"></ul></div></div></div>');
	
	// add checklist
	for (var i = 0; i < resistances.length; i++) {
		$(".resistances").append('').append('<li><input type="checkbox" value="res'+ i + '">&nbsp;' + resistances[i] + '</li>');
	}

	// immunity pop-out
	$(".options").append('<div class="imm-modal modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"></div>');
	$(".imm-modal").append('<div class="modal-dialog modal-sm" role="document"><div class="imm-modal-content modal-content"></div></div>');
	$(".imm-modal-content").append('<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="gridSystemModalLabel">Modal title</h4></div>');
	$(".imm-modal-content").append('<div class="modal-body"><div class="row"><div class="col-md-8 col-md-offset-1 col-lg-8 col-lg-offset-1"><ul class="immunities" style="list-style-type:none"></ul></div></div></div>');
	
	// add checklist
	for (var i = 0; i < immunities.length; i++) {
		$(".immunities").append('').append('<li><input type="checkbox" value="imm'+ i + '">&nbsp;' + immunities[i] + '</li>');
	}

	/*

	<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="gridSystemModalLabel">Modal title</h4>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="btn-group" data-toggle="buttons">
							<label class="btn btn-primary active">
								<input type="checkbox" autocomplete="off" checked> Checkbox 1 (pre-checked)
							</label>
							<label class="btn btn-primary">
								<input type="checkbox" autocomplete="off"> Checkbox 2
							</label>
							<label class="btn btn-primary">
								<input type="checkbox" autocomplete="off"> Checkbox 3
							</label>
						</div>
					</div>
			</div>
		</div>
	</div>

	*/





	/*
	{
		"name":"Gladiator",
		"armor_class":16,
		"hit_points":165,
		"strength":18,
		"dexterity":15,
		"constitution":16,
		"intelligence":10,
		"wisdom":12,
		"charisma":15,
		"damage_resistances":[],
		"damage_immunities":[],
		"actions":{
			"attack":[
				{
					"number":3,
					"name":"spear",
					"attack_bonus":7,
					"damage_dice":"3d8",
					"damage_bonus":4,
					"damage_type":"piercing"
				}
			]
		}
	},
	*/
});

$(document).ready(function () {
		$('.dropdown-toggle').dropdown();
	});