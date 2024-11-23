import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { calculate, Field, Generations, Pokemon } from '@smogon/calc';
import { Generation } from '@smogon/calc/dist/data/interface';
import { Move } from '@smogon/calc/dist/move';

@Component({
	selector: '[app-damage-cells]',
	templateUrl: './damage-cells.component.html',
	styleUrl: './damage-cells.component.css'
})
export class DamageCellsComponent implements OnChanges {
	@Input() gen: Generation = Generations.get(1);
	@Input() main: any;
	@Input() moves: string[] = [];
	@Input() trainer: any;
	@Input() pokemon: Pokemon = new Pokemon(1, 'Bulbasaur');
	@Input() trainerData: any[] = [];
	@Input() weatherOverride: any;

	koCounts: number[] = [0, 0, 0, 0];

	ngOnChanges(): void {
		this.getRange(0);
		this.getRange(1);
		this.getRange(2);
		this.getRange(3);
	}

	getRange(i: number) {
		if (this.main && this.moves[i]) {
			this.koCounts[i] = 0;

			const gameType = this.trainer.isDouble ? 'Doubles' : 'Singles';
			let field = new Field({ gameType });
			if (this.weatherOverride) {
				field.weather = this.weatherOverride;
			} else if (this.trainer.weather) {
				field.weather = this.trainer.weather;
			}

			const damageCalc = calculate(this.gen, this.main, this.pokemon, new Move(this.gen, this.moves[i]), field);
			if (Array.isArray(damageCalc.damage)) {
				for (const roll of damageCalc.damage) {
					if (!Array.isArray(roll) && roll >= damageCalc.defender.rawStats.hp) {
						this.koCounts[i] = this.koCounts[i] + 1;
					}
				}
			}
		}
	}
}
