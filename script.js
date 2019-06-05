document.getElementById("info-object").style.display = "none";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = window.innerWidth;
const HEIGHT = window.outerHeight;

canvas.width = WIDTH;
canvas.height = HEIGHT;
//faz o desenho do triângulo

var objects = []; //lista de objetos
var objectSelected = null;
var flag = 0;

function drawCanvas() {

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    for (var i = 0; i < objects.length; i++) {
        objects[i].draw();
    }
    drawAxis();

}

function drawAxis() {
    ctx.strokeStyle = "#f3c1c6";
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.setLineDash([1, 1]);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

window.addEventListener("load", drawCanvas);

function pushBox() {
    var obj = new Box();
    objects.push(obj);
    objectSelected = objects[objects.length - 1];
    updateDisplay(objectSelected);
    document.getElementById("info-object").style.display = "block";
    drawCanvas();

}

function pushCircle() {
    var obj = new Circle();
    objects.push(obj);
    objectSelected = objects[objects.length - 1];
    updateDisplay(objectSelected);
    document.getElementById("info-object").style.display = "block";
    drawCanvas();
}

function updateDisplay(objectSelected) {
    document.getElementById("posx").value = objectSelected.getTranslate()[0];
    document.getElementById("posy").value = objectSelected.getTranslate()[1];
}

function updatePosition() {
    if (objectSelected != null) {
        try {
            posx = parseFloat(document.getElementById("posx").value);
            posy = parseFloat(document.getElementById("posy").value);
            objectSelected.setTranslate(posx, posy);
            drawCanvas();
        } catch (error) {
            alert(error);
        }
    }
}

function updateRotate(){
    if(objectSelected != null){
        try{
            valtetha = parseInt(document.getElementById("valtetha").value);
            objectSelected.setRotate(valtetha);
            drawCanvas();
        }catch(error){
            alert(error);
        }
    }
}

function updateScale(){
    if(objectSelected != null){
        try{
            valx = parseFloat(document.getElementById("valx").value);
            valy = parseFloat(document.getElementById("valy").value);
            objectSelected.setScale(valx, valy);
            drawCanvas();
        }catch(error){
            alert(error);
        }
    }
}

function updateName(){
    if(objectSelected != null){
        try{
            name = document.getElementById("objName").value;
            objectSelected.setName(name);
            drawCanvas();
        }
        catch(error){
            alert(error);
        }
    }
}

function updateFill(){
    if (objectSelected != null) {
        try {
            color = "#" + document.getElementById("objFill").value;
            objectSelected.setFill(color);
            drawCanvas();
        } catch (error) {
            alert(error);
        }
    }
}

function updateStroke(){
    if (objectSelected != null) {
        try {
            color = "#" + document.getElementById("objStroke").value;
            objectSelected.setStroke(color);
            drawCanvas();
        } catch (error) {
            alert(error);
        }
    }
}

function onClickMouse(event){
    var x = event.offsetX;
    var y = event.offsetY;
    console.log("x coords: " + x + ", y coords: " + y);
    var M = transformUsual(WIDTH, HEIGHT);
    console.log("x coords: " + M + ", y coords: " + M);
    var click_coords = [x, y, 1];
    var usual_coords = multVec(M, click_coords);

    objectSelected = null;
    for (var i = 0; i < objects.length; i++) {
        if (objects[i].tryIntersection(usual_coords)) {
            objectSelected = objects[i];
            updateDisplay(objectSelected);
        }
    }
}

function overClick(event) {
    flag = 0;
}

function setToMoveObject() {
    flag = 1;
}

document.addEventListener("dblclick", setToMoveObject);

document.addEventListener("mousemove", moveObject);

document.addEventListener("click", overClick);

function moveObject(event) {
    if (flag == 1) {
        if (objectSelected != null) {
            var x = event.offsetX;
            var y = event.offsetY;

            console.log(WIDTH);
            var M = transformUsual(WIDTH, HEIGHT);
            console.log(M);
            var click_coords = [x, y, 1];

            var pos = multVec(M, click_coords);
            objectSelected.setTranslate(pos[0], pos[1]);
            drawCanvas();
        }
    }
}