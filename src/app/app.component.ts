import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/mergeMap";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  movies = this.http.get("http://movie-api.gosu.bar/api/movie/findAll");
  selected = new Subject<any>();
  sessions = this.selected.mergeMap(movie =>
    this.http.get(`http://movie-api.gosu.bar/api/session/${movie.id}`)
  );

  constructor(public http: HttpClient) {}
}
