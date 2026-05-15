function drawMouseCursor(){
    noCursor();
    
    push();
    
    translate(mouseX, mouseY);
    rectMode(CENTER);
    rotate(frameCount * 0.1);

    fill(255);
    stroke(0);
    rect(0, 0, 50, 50);

    pop();
}