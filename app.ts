import { timer } from "rxjs";
import { AppService } from "./app.service";

const service = new AppService();

service.getPosts().subscribe(console.log);
timer(3000).subscribe(() => {
  service.getPost(1).subscribe(console.log);
  service.getPosts().subscribe(console.log);
});
