import { Component, OnInit } from '@angular/core';
import { Generations, ITEMS, MOVES, Pokemon, SPECIES } from '@smogon/calc';
import { SwordGrookey } from '../trainer-data/swsh/sword-grookey';
import { SwordGrookeyLateFly } from '../trainer-data/swsh/sword-grookey-late-fly';
import { ShieldSobble } from '../trainer-data/swsh/shield-sobble';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
	gen = Generations.get(8);
	pokemonList: string[] = [];
	movesList: string[] = [];
	itemsList: string[] = [];

	trainerData: any[] = [];

	main = '';
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

	ngOnInit(): void {
		for (const mon of Object.keys(SPECIES[8])) {
			this.pokemonList.push(mon);
		}
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
		} else {
			this.trainerData = [];
		}
	}

	getMain(trainer: any) {
		let main: any;
		if (this.main) {
			main = new Pokemon(this.gen, this.main, {
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
			if (!opponent || trainer === opponent) {
				break;
			}
			evs.hp = evs.hp + trainer.evs.hp;
			evs.atk = evs.atk + trainer.evs.atk;
			evs.def = evs.def + trainer.evs.def;
			evs.spa = evs.spa + trainer.evs.spa;
			evs.spd = evs.spd + trainer.evs.spd;
			evs.spe = evs.spe + trainer.evs.spe;
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
}
