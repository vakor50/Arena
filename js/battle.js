// return true if an array contains an instance of element
Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

// generate a random number between low and high
function generateRandom(low, high) {
	return Math.floor(Math.random() * high) + low; 
}

// given an ability score, find its modifier
function calculateModifier(attr) {
	return Math.floor((attr - 10) / 2);
}

// sum n calls of the generateRandom function
function generateSumRandom(n, low, high) {
	var sum = 0;
	for (var i = 0; i < n; i++) {
		var temp = generateRandom(low, high);
		sum += temp;
	}
	return sum;
}

function damagePerDice(dmg_dice, crit, gwf) {
	// separate die roll around 'd'
	var splitD = dmg_dice.split("d");
	
	var numDie = parseInt(splitD[0]);
	var dieValue = parseInt(splitD[1]);

	var critical = (crit) ? 2 : 1;

	// sum 
	var dieRoll = 0;

	// roll each die and sum result
	for (var i = 0; i < numDie; i++) {
		var temp = generateRandom(1, dieValue);

		// if roll uses Great Weapon Fighting
		if (gwf && (temp == 1 || temp == 2)) {
			temp = generateRandom(1, dieValue);
		}
		dieRoll += temp;
	}

	return (critical * dieRoll);
}


// use the damage string to generate a damage value
// EX:
//		damageValue(creatures[one].Action.Attack[0].Damage, false, false)
function damageValue(dmg_dice, dmg_bonus, crit, gwf) {
	
	var sum = 0;

	// check if there are multiple dice types in the attack
	if (dmg_dice.constructor === Array) {
		console.log("multiple die");
		for (var i = 0; i < dmg_dice.length; i++) {
			sum += damagePerDice(dmg_dice[i], crit, gwf);
		}
	} else {
		sum += damagePerDice(dmg_dice, crit, gwf);
	}

	return sum + dmg_bonus;
}


var winner = [];
var creatOneCrit = [];
var creatTwoCrit = [];
var margin = [];
var firstHitRatio = [];
var secondHitRatio = [];
var rounds = [];
var firstHit = 0;
var firstCount = 0;
var secondHit = 0;
var secondCount = 0;

// attempt to remove duplicates in figt()
function AvsB(hpOther, firstCrit, one, first, second, firstHit, firstCount) {
	var hit = 0;
	var count = 0;

	// first creature attacks second creature
	// for all attacks
	for (var a = 0; a < creatures[first].actions.attack.length; a++) {
		// for the number of times this attack is made
		for (var i = 0; i < creatures[first].actions.attack[a].number; i++) {
			// attack as long as Creature 2 is still alive
			if (hpOther > 0) {
				// roll d20
				var roll = generateRandom(1, 20);

				// increment the number of critical hits
				if (roll == 20) {
					firstCrit++;
				}

				// Creature 1's attack roll
				var atk = roll + creatures[first].actions.attack[a].attack_bonus;

					// Compare the attack roll against Creature 2's AC
				if (atk > creatures[second].armor_class) {
					// check if Creature 1 has an expanded crit range
					if(creatures[first].actions.attack[a].crit_range <= roll) {
						roll = 20;
						firstCrit++;
					}

					// account for Great Weapon Fighting style's ability to reroll 1's and 2's once
					var gwf = false;
					if (creatures[first].actions.attack[a].hasOwnProperty('great_weapon_fighting')) {
						gwf = true;
					}

					// Find the damage dealt by Creature 1's attacks 
					var damage = damageValue(creatures[first].actions.attack[a].damage_dice, creatures[first].actions.attack[a].damage_bonus, roll == 20, gwf); 

					// reduce the damage if Creature 2 has any resistances or immunities
					// damage = 0 if Creature 2 has immunity to this damage type
					// damage halved if Creature 2 has resistance to this damage type
					if (creatures[second].damage_immunities.contains(creatures[first].actions.attack[a].damage_type)) {
						damage = 0;
					} else if (creatures[second].damage_resistances.contains(creatures[first].actions.attack[a].damage_type)) {
						damage = Math.ceil(damage / 2);
					}

					// decrement the damage from Creature 2's health
					hpOther -= damage;
								
					// Creature 1 wins
					if (hpOther <= 0) {
						winner.push(first);
					}

					// increment the number of hits made by Creature 1
					hit++;
				}				
			}

			// increment the number of attacks made by Creature 1
			count++;
		}
	}

	// find the number of hits / the number of attacks
	var hmratio = (count == 0) ? 0 : hit/count;


	// store the hit-miss ratio for each creature for this round
	// account for initiative when storing data
	if (first == one) {
		firstHitRatio.push(hmratio);
	} else {
		secondHitRatio.push(hmratio);
	}

	return hpOther;
}

// attempt to remove duplicates in figt()
function fight2() {
	// get creature IDs from 
	var one = $("#comb-1 option:selected").val();
	var two = $("#comb-2 option:selected").val();

	// roll initiative
	var initOne = generateRandom(1, 20) + calculateModifier(creatures[one].dexterity);
	var initTwo = generateRandom(1, 20) + calculateModifier(creatures[two].dexterity);

	var first = 0;
	var second = 0;

	// decide who goes first
	if (initOne > initTwo) {
		first = one;
		second = two;
	} else {
		first = two;
		second = one;
	}

	// Set hit points
	var hpFirst = creatures[first].hit_points;
	var hpSecond = creatures[second].hit_points;

	// Reset all counters
	firstCrit = 0;
	secondCrit = 0;

	var roundCount = 0;

	while(hpFirst > 0 && hpSecond > 0) {
		
		roundCount++;

		// reset number of hits vs. number of attacks
		firstHit = 0;
		firstCount = 0;
		secondHit = 0;
		secondCount = 0;

		// first creature attacks second creature
		hpSecond = AvsB(hpSecond, firstCrit, one, first, second, firstHit, firstCount);

		// second creature attacks first creature if it still has health
		if (hpSecond > 0) {
			hpFirst = AvsB(hpFirst, secondCrit, one, second, first, secondHit, secondCount)
		}
	}


	// if a creature has been reduced to lower than 0 hp, set it to 0 for margin calculation for this round
	if (hpFirst < 0) {hpFirst = 0;}
	if (hpSecond < 0) {hpSecond = 0;}

	// store the margin of defeat for the fight
	margin.push(Math.abs(hpFirst - hpSecond));

	// store the count for the number of crits for each creature for this round
	// account for initiative when storing data
	if (first == one) {
		creatOneCrit.push(firstCrit);
		creatTwoCrit.push(secondCrit);
	} else {
		creatOneCrit.push(secondCrit);
		creatTwoCrit.push(firstCrit);
	}
	
	hpFirst = creatures[first].hit_points;
	hpSecond = creatures[second].hit_points;

	rounds.push(roundCount);
}



function fight() {
	// get creature IDs from 
	var one = $("#comb-1 option:selected").val();
	var two = $("#comb-2 option:selected").val();

	// roll initiative
	var initOne = generateRandom(1, 20) + calculateModifier(creatures[one].dexterity);
	var initTwo = generateRandom(1, 20) + calculateModifier(creatures[two].dexterity);

	var first = 0;
	var second = 0;

	// decide who goes first
	if (initOne > initTwo) {
		first = one;
		second = two;
	} else {
		first = two;
		second = one;
	}

	// Set hit points
	var hpFirst = creatures[first].hit_points;
	var hpSecond = creatures[second].hit_points;

	// Reset all counters
	firstCrit = 0;
	secondCrit = 0;



	var roundCount = 0;

	while(hpFirst > 0 && hpSecond > 0) {
		
		roundCount++;

		// reset number of hits vs. number of attacks
		firstHit = 0;
		firstCount = 0;
		secondHit = 0;
		secondCount = 0;

		// first creature attacks second creature
		// for all attacks
		for (var a = 0; a < creatures[first].actions.attack.length; a++) {
			// for the number of times this attack is made
			for (var i = 0; i < creatures[first].actions.attack[a].number; i++) {
				// attack as long as Creature 2 is still alive
				if (hpSecond > 0) {
					// roll d20
					var roll = generateRandom(1, 20);

					// increment the number of critical hits
					if (roll == 20) {
						firstCrit++;
					}

					// Creature 1's attack roll
					var atk = roll + creatures[first].actions.attack[a].attack_bonus;

					// Compare the attack roll against Creature 2's AC
					if (atk > creatures[second].armor_class) {
						// check if Creature 1 has an expanded crit range
						if(creatures[first].actions.attack[a].crit_range <= roll) {
							roll = 20;
							firstCrit++;
						}

						// account for Great Weapon Fighting style's ability to reroll 1's and 2's once
						var gwf = false;
						if (creatures[first].actions.attack[a].hasOwnProperty('great_weapon_fighting')) {
							gwf = true;
						}

						// Find the damage dealt by Creature 1's attacks 
						var damage = damageValue(creatures[first].actions.attack[a].damage_dice, creatures[first].actions.attack[a].damage_bonus, roll == 20, gwf); 

						// reduce the damage if Creature 2 has any resistances or immunities
						// damage = 0 if Creature 2 has immunity to this damage type
						// damage halved if Creature 2 has resistance to this damage type
						if (creatures[second].damage_immunities.contains(creatures[first].actions.attack[a].damage_type)) {
							damage = 0;
						} else if (creatures[second].damage_resistances.contains(creatures[first].actions.attack[a].damage_type)) {
							damage = Math.ceil(damage / 2);
						}

						// decrement the damage from Creature 2's health
						hpSecond -= damage;
						
						// Creature 1 wins
						if (hpSecond <= 0) {
							winner.push(first);
						}

						// increment the number of hits made by Creature 1
						firstHit++;
					}				
				}

				// increment the number of attacks made by Creature 1
				firstCount++;
			}
		}
		

		// second creature attacks first creature if it still has health
		if (hpSecond > 0) {
			// for all attacks
			for (var a = 0; a < creatures[second].actions.attack.length; a++) {
				// for the number of times this attack is made
				for (var i = 0; i < creatures[second].actions.attack[a].number; i++) {
					// attack as long as Creature 1 is still alive
					if (hpFirst > 0) {
						// roll d20
						var roll = generateRandom(1, 20);

						// increment the number of critical hits
						if (roll == 20) {
							secondCrit++;
						}

						// Creature 2's attack roll
						var atk = roll + creatures[second].actions.attack[a].attack_bonus;

						// Compare the attack roll against Creature 1's AC
						if (atk > creatures[first].armor_class) {
							// check if Creature 2 has an expanded crit range
							if(creatures[second].actions.attack[a].crit_range <= roll) {
								roll = 20;
								secondCrit++;
							}

							// account for Great Weapon Fighting style's ability to reroll 1's and 2's once
							var gwf = false;
							if (creatures[second].actions.attack[a].hasOwnProperty('great_weapon_fighting')) {
								gwf = true;
							}

							// Find the damage dealt by Creature 2's attacks 
							var damage = damageValue(creatures[second].actions.attack[a].damage_dice, creatures[second].actions.attack[a].damage_bonus, roll == 20, creatures[second].actions.attack[a].great_weapon_fighting); 

							// reduce the damage if Creature 1 has any resistances or immunities
							// damage = 0 if Creature 1 has immunity to this damage type
							// damage halved if Creature 1 has resistance to this damage type
							if (creatures[first].damage_immunities.contains(creatures[second].actions.attack[a].damage_type)) {
								damage = 0;
							} else if (creatures[first].damage_resistances.contains(creatures[second].actions.attack[a].damage_type)) {
								damage = Math.ceil(damage / 2);
							}

							// decrement the damage from Creature 1's health
							hpFirst -= damage;
							
							// Creature 2 wins
							if (hpFirst <= 0) {
								winner.push(second);
							}

							// increment the number of hits made by Creature 2
							secondHit++;
						} 
					}

					// increment the number of attacks made by Creature 2
					secondCount++;
				}
			}
		}


		// find the number of hits / the number of attacks
		var f = (firstCount == 0) ? 0 : firstHit/firstCount;
		var s = (secondCount == 0) ? 0 : secondHit/secondCount;


		// store the hit-miss ratio for each creature for this round
		// account for initiative when storing data
		if (first == one) {
			firstHitRatio.push(f);
			secondHitRatio.push(s);
		} else {
			secondHitRatio.push(f);
			firstHitRatio.push(s);
		}
	}

	// if a creature has been reduced to lower than 0 hp, set it to 0 for margin calculation for this round
	if (hpFirst < 0) {hpFirst = 0;}
	if (hpSecond < 0) {hpSecond = 0;}

	// store the margin of defeat for the fight
	margin.push(Math.abs(hpFirst - hpSecond));

	// store the count for the number of crits for each creature for this round
	// account for initiative when storing data
	if (first == one) {
		creatOneCrit.push(firstCrit);
		creatTwoCrit.push(secondCrit);
	} else {
		creatOneCrit.push(secondCrit);
		creatTwoCrit.push(firstCrit);
	}
	

	hpFirst = creatures[first].hit_points;
	hpSecond = creatures[second].hit_points;

	rounds.push(roundCount);
}


$(".fight").click(function() {
	// empty the output log
	$(".log").empty();

	// set the number of trials
	var cases = 1000;

	// Run a fight 'cases' times
	for (var i = 0; i < cases; i++) {
		fight();
	}

	var one = $("#comb-1 option:selected").val();
	var two = $("#comb-2 option:selected").val();

	// Average the number of crits for both Creature 1 and 2
	var numFirst = 0
	critsOne = 0;
	critsTwo = 0;
	var mDiff = 0;
	for (var i = 0; i < cases; i++) {
		if (parseInt(winner[i]) == one) {
			numFirst++;
		}
		critsOne += creatOneCrit[i];
		critsTwo += creatTwoCrit[i];
		mDiff += margin[i];
	}

	// Average the hit-miss ratio for Creature 1
	var oneRatio = 0;
	for (var i = 0; i < firstHitRatio.length; i++) {
		oneRatio += firstHitRatio[i];
	}
	oneRatio = oneRatio/firstHitRatio.length;

	// Average the hit-miss ratio for Creature 2
	var twoRatio = 0;
	for (var i = 0; i < secondHitRatio.length; i++) {
		twoRatio += secondHitRatio[i];
	}
	twoRatio = twoRatio/secondHitRatio.length;

	// Average the number of rounds of each fight
	var roundAvg = 0;
	for (var i = 0; i < rounds.length; i++) {
		roundAvg += rounds[i];
	}
	roundAvg = roundAvg/rounds.length;

	

	// Print out all analytics

	// Creature A won X/S times.
	$(".log").append("<div class=\"bubble \"><h4>The <span style=\"color: #337ab7\">" + creatures[one].name + "</span> won <span style=\"color: #337ab7\">" + numFirst + "</span>/"+ cases +" times.</h4></div>");
	// Each fight lasted an average X rounds.
	$(".log").append("<div class=\"bubble \"><h4>Each fight lasted an average <span style=\"color: #337ab7\">"+ roundAvg +" rounds</span>.</h4></div>");
	// The A had an average X critical hits per fight.
	$(".log").append("<div class=\"bubble \"><h4>The <span style=\"color: #337ab7\">" + creatures[one].name + "</span> had an average of <span style=\"color: #337ab7\">" + (critsOne/cases).toFixed(3) + " critical hits </span> per fight.</h4></div>");
	// The B had an average Y critical hits per fight.
	$(".log").append("<div class=\"bubble \"><h4>The <span style=\"color: #337ab7\">" + creatures[two].name + "</span> had an average of <span style=\"color: #337ab7\">" + (critsTwo/cases).toFixed(3) + " critical hits </span> per fight.</h4></div>");
	// The A had an average attack hit-miss ratio of X per fight.
	$(".log").append("<div class=\"bubble \"><h4>The " + creatures[one].name + " had an average attack <span style=\"color: #337ab7\">hit-miss ratio</span> of <span style=\"color: #337ab7\">" + oneRatio.toFixed(3) + "</span> per fight.</h4></div>");
	// The B had an average attack hit-miss ratio of Y per fight.
	$(".log").append("<div class=\"bubble \"><h4>The " + creatures[two].name + " had an average attack <span style=\"color: #337ab7\">hit-miss ratio</span> of <span style=\"color: #337ab7\">" + twoRatio.toFixed(3) + "</span> per fight.</h4></div>");
	// There was an average margin of defeat of X hit points.
	$(".log").append("<div class=\"bubble \"><h4>There was an average <span style=\"color: #337ab7\">margin</span> of defeat of <span style=\"color: #337ab7\">" + (mDiff/cases).toFixed(3) + " hit points</span>.</h4></div>");

	// After calculations, reset data stores
	winner = [];
	creatOneCrit = [];
	creatTwoCrit = [];
	margin = [];
	firstHitRatio = [];
	secondHitRatio = [];
	rounds = [];
	firstHit = 0;
	firstCount = 0;
	secondHit = 0;
	secondCount = 0;
});



$(document).ready(function() {
	// var data = [3, 12, 20, 14, 15, 20, 9, 16, 2, 20, 14, 9, 7, 7, 20, 2, 5, 19, 3, 12, 16, 20, 7, 11, 2, 1, 10, 18, 14, 5, 15, 14, 18, 6, 20, 9, 14, 1, 5, 2, 10, 5, 5, 19, 13, 18, 19, 16, 15, 6, 1, 6, 8, 3, 6, 1, 18, 14, 13, 5, 17, 18, 16, 4, 15, 3, 2, 8, 6, 1, 9, 8, 20, 10, 17, 20, 14, 16, 3, 6, 19, 2, 5, 20, 14, 11, 1, 10, 6, 14, 6, 7, 16, 2, 5, 17, 13, 16, 4, 20, 6, 1, 15, 9, 12, 4, 15, 5, 16, 17, 9, 7, 7, 13, 7, 9, 16, 8, 1, 10, 20, 3, 11, 18, 1, 9, 17, 1, 17, 15, 3, 1, 8, 15, 20];
	// var dtwenty = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

	// var overtwelve = 0;

	// for (var i = data.length - 1; i >= 0; i--) {
	// 	dtwenty[data[i]-1]++;
	// 	if (data[i] >= 12) {
	// 		overtwelve++;
	// 	}
	// }

	// for (var i = 0; i < dtwenty.length ; i++) {
	// 	console.log(dtwenty[i]);
	// }

	// console.log(data.length);
	// console.log(overtwelve);


	$('.dropdown-toggle').dropdown()
	// populate drop-down with creatures in JSON
	for (var i = 0; i < creatures.length; i++) {
		console.log(creatures[i].name);
		$("#comb-1").append('<option value="' + i + '">' + creatures[i].name + '</option>');
		$("#comb-2").append('<option value="' + i + '">' + creatures[i].name + '</option>');
	}


});

