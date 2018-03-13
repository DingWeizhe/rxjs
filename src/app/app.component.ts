import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import "rxjs/add/operator/filter";
import "rxjs/add/observable/combineLatest";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/do";
import "rxjs/add/operator/share";
import "rxjs/add/operator/scan";
import "rxjs/add/operator/take";
import "rxjs/add/operator/shareReplay";
import "rxjs/add/operator/debounceTime";

export type Movie = {
  id: number;
  uuid: string;
  enName: string;
  zhName: string;
  duration: number;
  grade: number;
  ezScore: number;
  imdbScore: number;
  rtScore: string;
  releaseDate: string;
  commentCount: string;
  category: string;
  description: string;
  mainPoster: string;
  posters: { poster_id: number; poster_type: number; poster_url: number }[];
  director: string;
  cast: string;
  trailer: string[];
  orderAvailible: boolean;
  lastUpdateTime: string;
  sort: null;
  status: null;
  clickCount: number;
  currentRanking: number;
  lastRanking: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type Session = {
  id: number;
  uuid: string;
  version: string;
  start: string;
  end: string;
  cinemaId: number;
  movieId: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  keyword = new BehaviorSubject<string>("");
  nextPage = new BehaviorSubject(1);
  page = this.nextPage.scan((acc, value, idx) => acc + value).shareReplay(1);

  zeroingSubscription = this.keyword
    .flatMap(e => this.page.take(1))
    .subscribe(page => this.nextPage.next(1 - page));

  movies = Observable.combineLatest(this.keyword.debounceTime(200), this.page)
    .mergeMap(([keyword, page]) =>
      this.http.get<Movie[]>(
        `http://movie-api.gosu.bar/api/movie/findAll?page=${page}&name=${keyword}`
      )
    )
    .shareReplay();

  clickMovie = new Subject();

  selected = Observable.merge(
    this.clickMovie,
    this.movies.filter(movies => movies.length !== 0).map(movie => movie[0])
  )
    .map(movie => {
      if (movie instanceof Array) {
        if (movie.length > 0) {
          return movie[0];
        } else return null;
      } else return movie;
    })
    .shareReplay(1);

  sessions = this.selected.mergeMap(movie => {
    if (movie) {
      return this.http.get<Session>(
        `http://movie-api.gosu.bar/api/session/${movie.id}`
      );
    } else {
      return [];
    }
  });

  constructor(public http: HttpClient) {}

  ngOnDestroy() {
    this.zeroingSubscription.unsubscribe();
  }
}
