import { timer } from 'rxjs';
import { AppService, httpRequests } from './app.service';

const service = new AppService();

service.getPosts().subscribe();
timer(3000).subscribe(() => {
  service.getPost(1).subscribe();
  service.getPosts().subscribe(console.log);
  service.getPostsOneArg({ a: 'a', b: 'b', c: 'c' });
  service.getPostsTwoArgs(1, { d: 'd', f: 'f', e: { g: 'g', h: [1, 2, 3] } });
});

timer(6000).subscribe(() => {
  console.log(`Number of http requests sent: ${httpRequests}`);
});
