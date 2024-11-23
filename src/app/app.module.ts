import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DamageCellsComponent } from './damage-cell/damage-cells.component';

@NgModule({
	declarations: [
		AppComponent,
		DamageCellsComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		NgSelectModule,
		FormsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
