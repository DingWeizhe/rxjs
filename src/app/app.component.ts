import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  public sessions: any;
  public movies: any;
  public selected = new Subject<any>();

  constructor(public http: HttpClient) {
    this.getMovieList();
  }

  async getMovieList() {
    this.movies = this.http.get("http://movie-api.gosu.bar/api/movie/findAll");

    this.sessions = this.selected.flatMap(movie =>
      this.http.get("http://movie-api.gosu.bar/api/session/" + movie.id)
    );
  }
}
