import { Component, OnInit } from "@angular/core";
import { PollingService } from "./polling.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  urlArray = [];
  constructor(private svc: PollingService) {}

  ngOnInit(): void {
    this.urlArray = this.svc.urlArray;
    this.svc.poll();
  }
  stopPolling() {
    this.svc.stopPolling();
  }
}
