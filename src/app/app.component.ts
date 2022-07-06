export class Pokemon {
  url: string | undefined;
  name: string | undefined;
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ExampleNgxMatSelectSearch';
  pokemons: Pokemon[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getList()
      .pipe()
      .subscribe(data => (this.pokemons = data['results']));
  }

  getList(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(
      'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20'
    );
  }
}
