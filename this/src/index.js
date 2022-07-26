const fn = function(){
  this.name = 'sean'
  console.log(this);
}


function func() {
  console.log(this, this.__proto__ === func.prototype)
  console.log(this.__proto__);
}

boundFunc = func.bind(1)
new boundFunc()

