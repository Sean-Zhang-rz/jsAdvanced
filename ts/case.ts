interface MyEvent {
  target: string;
}
interface MyMouseEvent extends MyEvent {
  x: number;
  y: number;
}
function listener(eType: string, fn: (n: MyEvent) => void) {
  if (eType === 'click') {
    fn({ target: 's' });
  }
}
// 报错
// listener('click', (e: MyMouseEvent) => console.log(e.x + ' ' + e.y));
// ok
listener('click', (e: MyEvent) => {
  console.log((e as MyMouseEvent).x + ' ' + (e as MyMouseEvent).y);
});
// 也ok，但不常用
// listener('click', ((e: MyMouseEvent) => console.log(e.x + ' ' + e.y)) as (e: myEvent) => void)
// 过于离谱
// listener('click', (e: numebr) => console.log(e))
export {};
