/* @providesModule This */

function F() { this.x = 0; }
F.prototype.m = function() { this.y = 0; }

function foo(p:string) { }

var o1 = new F(); // sets o1.x to 0
o1.x = "";
foo(o1.x); // o1.x could be 0

var o2 = new F();
o1.y = 0;
o2.y = "";
foo(o2.y); // setting o1.y to 0 has no effect on o2.y

var o3 = new F();
o3.m(); // sets o3.y to 0
o3.y = "";
foo(o3.y); // o3.y could be 0
foo(o2.y); // setting o3.y to 0 has no effect on o2.y

/*
 * this bindings:
 */

/* standard functions may rebind this */
function f1() : number {
  return this.x
}

var f1_1 = f1.bind({x: 0})();            // ok
var f1_2 : string = f1.bind({x: 0})();   // error, number -> string
var f1_3 = f1.bind({x: ""})();           // error, string -> number
// TODO make this error blame the call site, rather than the function body
var f1_4 = f1();                         // error, (global object).x

/* arrow functions bind this at point of definition */
/* top level arrow functions bind this to global object */
var a1 = () => {
  return this.x
}

var ax = a1();                          // error, (this:mixed).x

/* nested arrows bind enclosing this (which may itself rebind) */
function f2() : number {
    var a2 = () => { return this.x };
    return a2()
}

var f2_1 = f2.bind({x: 0})();            // ok
var f2_2 : string = f2.bind({x: 0})();   // error, number -> string
var f2_3 = f2.bind({x: ""})();           // error, string -> number
// TODO make this error blame the call site, rather than the function body
var f2_4 = f2();                         // error, (global object).x

module.exports = true;
