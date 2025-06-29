import { Component, OnInit } from '@angular/core';
import { ABILITIES, Generations, ITEMS, MOVES, Pokemon, SPECIES } from '@smogon/calc';
import { SwordGrookey } from '../trainer-data/swsh/sword-grookey';
import { SwordSobble } from '../trainer-data/swsh/sword-sobble';
import { SwordGrookeyLateFly } from '../trainer-data/swsh/sword-grookey-late-fly';
import { ShieldSobble } from '../trainer-data/swsh/shield-sobble';
import { SwordTamScorbunny } from '../trainer-data/swsh/sword-tam-scorbunny';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
	gen = Generations.get(8);
	pokemonList: string[] = [];
	abilityList: string[] = [];
	movesList: string[] = [];
	itemsList: string[] = [];

	trainerData: any[] = [];

	main = '';
	ability = '';
	mainNature = 'Serious';
	mainLevel = 65;
	mainHp = 31;
	mainAtk = 31;
	mainAtkStage = 0;
	mainDef = 31;
	mainDefStage = 0;
	mainSpa = 31;
	mainSpaStage = 0;
	mainSpd = 31;
	mainSpdStage = 0;
	mainSpe = 31;
	mainSpeStage = 0;
	moveOne = '';
	moveTwo = '';
	moveThree = '';
	moveFour = '';
	mainItem = '';
	weatherOverride = '';

	addEvsTrainer = '';
	addEvs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
	addedEvs: any = [];

	ngOnInit(): void {
		for (const mon of Object.keys(SPECIES[8])) {
			this.pokemonList.push(mon);
		}
		this.abilityList = ABILITIES[8];
		for (const move of Object.keys(MOVES[8])) {
			this.movesList.push(move);
		}
		this.itemsList = ITEMS[8];

		this.trainerData = [];
	}

	routeChanged(e: any) {
		const route = e.target.value;
		if (route === 'shieldSobble') {
			this.trainerData = new ShieldSobble().trainerData;
		} else if (route === 'swordGrookey') {
			this.trainerData = new SwordGrookey().trainerData;
		} else if (route === 'swordGrookeyLateFly') {
			this.trainerData = new SwordGrookeyLateFly().trainerData;
		} else if (route === 'swordSobble') {
			this.trainerData = new SwordSobble().trainerData;
		} else if (route === 'swordTamScorbunny') {
			this.trainerData = new SwordTamScorbunny().trainerData;
		} else {
			this.trainerData = [];
		}
		this.addedEvs = [];
	}

	getMain(trainer: any) {
		let main: any;
		if (this.main) {
			main = new Pokemon(this.gen, this.main, {
				ability: this.ability,
				level: this.mainLevel,
				ivs: { hp: this.mainHp, atk: this.mainAtk, def: this.mainDef, spa: this.mainSpa, spd: this.mainSpd, spe: this.mainSpe },
				evs: this.getEvsTotals(trainer),
				boosts: { atk: this.mainAtkStage, def: this.mainDefStage, spa: this.mainSpaStage, spd: this.mainSpdStage, spe: this.mainSpeStage },
				nature: this.mainNature,
				item: this.mainItem
			});
		}
		return main;
	}

	getEvsTotals(opponent: any) {
		const evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
		for (const trainer of this.trainerData) {
			for (const addEv of this.addedEvs) {
				if (trainer.name === addEv.before) {
					evs.hp = Math.min(evs.hp + addEv.evs.hp, 252);
					evs.atk = Math.min(evs.atk + addEv.evs.atk, 252);
					evs.def = Math.min(evs.def + addEv.evs.def, 252);
					evs.spa = Math.min(evs.spa + addEv.evs.spa, 252);
					evs.spd = Math.min(evs.spd + addEv.evs.spd, 252);
					evs.spe = Math.min(evs.spe + addEv.evs.spe, 252);
				}
			}
			if (!opponent || trainer === opponent) {
				break;
			}
			evs.hp = Math.min(evs.hp + trainer.evs.hp, 252);
			evs.atk = Math.min(evs.atk + trainer.evs.atk, 252);
			evs.def = Math.min(evs.def + trainer.evs.def, 252);
			evs.spa = Math.min(evs.spa + trainer.evs.spa, 252);
			evs.spd = Math.min(evs.spd + trainer.evs.spd, 252);
			evs.spe = Math.min(evs.spe + trainer.evs.spe, 252);
		}

		return evs;
	}

	speedCheck(trainer: any, pokemon: Pokemon) {
		const mainSpe = this.getMain(trainer)?.rawStats.spe * this.getStageMultiplier(this.mainSpeStage);
		let opponentSpe = pokemon.rawStats.spe;
		let weather = trainer.weather;
		if (this.weatherOverride) {
			weather = this.weatherOverride;
		}
		if ((weather === 'Sun' && pokemon.ability === 'Chlorophyll') || (weather === 'Rain' && pokemon.ability === 'Swift Swim') || (weather === 'Hail' && pokemon.ability === 'Sand Rush') || (weather === 'Sand' && pokemon.ability === 'Slush Rush')) {
			opponentSpe = opponentSpe * 2;
		}

		let result = '';
		if (opponentSpe > mainSpe) {
			result = 'Outspeeds';
		} else if (opponentSpe === mainSpe) {
			result = 'Speed-Tie';
		}

		return result;
	}

	getStageMultiplier(stage: number) {
		let multiplier = 1;
		if (stage < 0) {
			multiplier = 2 / (2 - stage);
		} else {
			multiplier = (2 + stage) / 2;
		}
		return multiplier;
	}

	getRawStats() {
		return this.getMain('')?.rawStats;
	}

	mainChanged(e: any) {
		const main = new Pokemon(this.gen, e);
		this.ability = main.ability ? main.ability : '';
	}

	addEvsToRoute() {
		this.addedEvs.push({
			before: this.addEvsTrainer,
			evs: this.addEvs
		});

		this.addEvsTrainer = '';
		this.addEvs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
	}

	removeEvs(i: number) {
		this.addedEvs.splice(i, 1);
	}
}
