import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map, mergeMap } from "rxjs/operators";
import { of, from, Subscription } from "rxjs";
import URL_ENDPOINTS from "./endpoints";
import polling from "rx-polling";
@Injectable({
  providedIn: "root"
})
export class PollingService {
  urlArray = URL_ENDPOINTS;
  sub: Subscription;
  constructor(private http: HttpClient) {}
  poll() {
    const requests$ = from(this.urlArray).pipe(
      mergeMap(obj => this.getReq(obj))
    );

    this.sub = polling(requests$, {
      interval: 5000,
      backoffStrategy: "consecutive"
    }).subscribe(res => console.log(res));
  }
  stopPolling() {
    this.sub.unsubscribe();
  }
  getReq(obj) {
    return this.http.get(obj.url).pipe(
      map(() => {
        this.updateStatus(obj);
      }),
      catchError(err => {
        this.changeStatus(obj);
        return of(console.log(err));
      })
    );
  }
  changeStatus(obj) {
    this.urlArray.forEach(item => {
      if (item.name === obj.name) {
        item.downtime = item.downtime + 1;
        item.status = "Down";
      }
    });
  }

  updateStatus(obj) {
    this.urlArray.forEach(item => {
      if (item.name === obj.name) {
        item.status = "Active";
      }
    });
  }
}
