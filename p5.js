function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  if(backgroundNum == 1){
    // drawMyBackground1()
  }
  if(backgroundNum == 2){
  }
  if(backgroundNum == 3){
  }
  //drawMouseCursor()
 
}
  function keyPressed(){
    if(key == '1'){
      backgroundNum = '1'
    }
    if(key == '2'){
      backgroundNum = '2'
    }

  if (key == '3'){
    backgroundNum = '3'
  }
  }
