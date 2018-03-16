import { Component, ViewChild, ElementRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import "rxjs/add/operator/filter";
import "rxjs/add/observable/combineLatest";
import "rxjs/add/observable/merge";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/operator/do";
import "rxjs/add/operator/combineAll";
import "rxjs/add/operator/share";
import "rxjs/add/operator/scan";
import "rxjs/add/operator/take";
import "rxjs/add/operator/takeUntil";
import "rxjs/add/operator/shareReplay";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";

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
  // keyword = new BehaviorSubject<string>("");

  // turn = new BehaviorSubject(1);
  // page = this.turn.scan((acc, value, idx) => acc + value).shareReplay(1);

  // movies = Observable.combineLatest(
  //   this.keyword
  //     .debounceTime(200)
  //     .distinctUntilChanged()
  //     .do(event => {
  //       this.page.take(1).subscribe(page => this.turn.next(1 - page));
  //     }),
  //   this.page.distinctUntilChanged()
  // )
  //   .mergeMap(([keyword, page]) =>
  //     this.http.get<Movie[]>(
  //       `http://movie-api.gosu.bar/api/movie/findAll?page=${page}&name=${keyword}`
  //     )
  //   )
  //   .shareReplay();

  // clickMovie = new Subject();

  // selected = Observable.merge(
  //   this.clickMovie,
  //   this.movies.filter(movies => movies.length !== 0).map(movie => movie[0])
  // )
  //   .map(movie => {
  //     if (movie instanceof Array) {
  //       if (movie.length > 0) {
  //         return movie[0];
  //       } else return null;
  //     } else return movie;
  //   })
  //   .shareReplay(1);

  // sessions = this.selected.mergeMap(movie => {
  //   if (movie) {
  //     return this.http.get<Session>(
  //       `http://movie-api.gosu.bar/api/session/${movie.id}`
  //     );
  //   } else {
  //     return [];
  //   }
  // });

  @ViewChild("box") box: ElementRef = null;

  constructor(public http: HttpClient) {}

  x: number = 0;
  y: number = 0;
  offsetX = 0;
  offsetY = 0;

  public ngAfterContentInit() {
    Observable.fromEvent(this.box.nativeElement, "mousedown")
      .do((e: MouseEvent) => {
        this.offsetX = e.offsetX;
        this.offsetY = e.offsetY;
      })
      .mergeMap(e =>
        Observable.fromEvent(document.body, "mousemove").takeUntil(
          Observable.fromEvent(document.body, "mouseup")
        )
      )
      .subscribe((e: MouseEvent) => {
        this.x = e.pageX - this.offsetX;
        this.y = e.pageY - this.offsetY;
      });
  }
}
