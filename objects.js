//predefined colors
white = "#ffffff65"; //com transparencia
black = "#000000"

SEGMENTS_CIRCLE = 30;

function Box(center = [0, 0, 1], height = 50, width = 50) {
    this.center = center;
    this.height = height;
    this.width = width;
    this.T = identity(); //matriz 3x3 de translação 
    this.R = identity(); //matriz 3x3 de rotação
    this.S = identity(); //matriz 3x3 de escala
    this.fill = white; //cor de preenchimento -> aceita cor hex, ex.: this.fill = "#4592af"
    this.stroke = black; //cor da borda -> aceita cor hex, ex.: this.stroke = "#a34a28"
    this.name = "";
}

Box.prototype.setName = function(name) {
    this.name = name;
}

Box.prototype.setTranslate = function(x, y) {
    this.T = translate(x, y);
}

Box.prototype.getTranslate = function() {
    return [this.T[0][2], this.T[1][2], 1];
}

Box.prototype.setRotate = function(theta) {
    this.R = rotate(theta);
}

Box.prototype.getRotate = function() {
    return [this.R[0][2], this.R[1][2], 1];
}

Box.prototype.setScale = function(x, y) {
    this.S = scale(x, y);
}

Box.prototype.getScale = function(x, y) {
    return [this.S[0][0], this.S[1][1], 1];
}

Box.prototype.get_inv_scale = function() {
    return inv_scale(this.S);
}

Box.prototype.get_inv_rotate = function() {
    return inv_rotate(this.R);
}

Box.prototype.get_inv_translate = function() {
    return inv_translate(this.T);
}

Box.prototype.setFill = function(color){
    this.fill = color;
}

Box.prototype.setStroke = function(color){
    this.stroke = color;
}

Box.prototype.tryIntersection = function(coords) {
    var inverse_scale = this.get_inv_scale();
    var inverse_rotate = this.get_inv_rotate();
    var inverse_translate = this.get_inv_translate();

    var inverse_m = mult(mult(inverse_scale, inverse_rotate), inverse_translate);
    var local_coords = multVec(inverse_m, coords);

    var points = [];
    points.push([this.center[0] + this.width / 2, this.center[1] + this.height / 2, 1]);
    points.push([this.center[0] - this.width / 2, this.center[1] + this.height / 2, 1]);
    points.push([this.center[0] - this.width / 2, this.center[1] - this.height / 2, 1]);
    points.push([this.center[0] + this.width / 2, this.center[1] - this.height / 2, 1]);

    if (local_coords[0] >= points[1][0] && local_coords[0] <= points[0][0]) {
        if (local_coords[1] >= points[2][1] && local_coords[1] <= points[1][1]) {
            return true;
        }
    }
    
    return false;
}

Box.prototype.draw = function(canv = ctx) { //requer o contexto de desenho
    //pega matriz de tranformação de coordenadas canônicas para coordenadas do canvas
    var M = transformCanvas(WIDTH, HEIGHT);
    var Mg = mult(M, mult(mult(this.T, this.R), this.S));
    canv.lineWidth = 2; //largura da borda
    canv.strokeStyle = this.stroke;
    canv.fillStyle = this.fill;
    //criação dos pontos do retângulo de acordo com o centro, largura e altura
    var points = [];
    points.push([this.center[0] + this.width / 2, this.center[1] + this.height / 2, 1]);
    points.push([this.center[0] - this.width / 2, this.center[1] + this.height / 2, 1]);
    points.push([this.center[0] - this.width / 2, this.center[1] - this.height / 2, 1]);
    points.push([this.center[0] + this.width / 2, this.center[1] - this.height / 2, 1]);

    ctx.beginPath();
    for (var i = 0; i < points.length; i++) {
        points[i] = multVec(Mg, points[i]); //transformando o ponto em coordenadas canonicas em coordenadas do canvas
        if (i == 0) canv.moveTo(points[i][0], points[i][1]);
        else canv.lineTo(points[i][0], points[i][1]);
    }
    canv.lineTo(points[0][0], points[0][1]); //fechando o retângulo
    canv.fill(); //aplica cor de preenchimento
    canv.strokeStyle = this.stroke;
    canv.stroke(); //aplica cor de contorno

    //desenho do nome
    canv.beginPath();
    canv.fillStyle = this.stroke;
    canv.font = "16px Courier";
    var center = multVec(Mg, this.center);
    canv.fillText(this.name, center[0] - this.name.length * 16 / 3, center[1] + 3); //deixa o texto mais ou menos centralizado no meio da caixa
}


function Circle(center = [0, 0, 1], radius = 50) {
    this.center = center;
    this.radius = radius;
    this.T = identity(); //matriz 3x3 de translação 
    this.R = identity(); //matriz 3x3 de rotação
    this.S = identity(); //matriz 3x3 de escala
    this.fill = white; //cor de preenchimento -> aceita cor hex, ex.: this.fill = "#4592af"
    this.stroke = black; //cor da borda -> aceita cor hex, ex.: this.stroke = "#a34a28"
    this.name = "";
}

Circle.prototype.setName = function(name) {
    this.name = name;
}

Circle.prototype.setTranslate = function(x, y) {
    this.T = translate(x, y);
}

Circle.prototype.getTranslate = function() {
    return [this.T[0][2], this.T[1][2], 1];
}

Circle.prototype.setRotate = function(theta) {
    this.R = rotate(theta);
}

Circle.prototype.getRotate = function() {
    return [this.R[0][0], this.R[0][1], 1];
}

Circle.prototype.setScale = function(x, y) {
    this.S = scale(x, y);
    if(x == y){
        this.radius = x * this.radius;
    }
}

Circle.prototype.getScale = function() {
    return [this.S[0][0], this.S[1][1], 1];
}

Circle.prototype.setRadius = function(r) {
    this.radius = r;
}

Circle.prototype.setFill = function(color) {
    this.fill = color;
}

Circle.prototype.setStroke = function(color) {
    this.stroke = color;
}

Circle.prototype.get_inv_scale = function() {
    return inv_scale(this.S);
}

Circle.prototype.get_inv_rotate = function() {
    return inv_rotate(this.R);
}

Circle.prototype.get_inv_translate = function() {
    return inv_translate(this.T);
}

Circle.prototype.tryIntersection = function(coords) {
    var inverse_scale = this.get_inv_scale();
    var inverse_rotate = this.get_inv_rotate();
    var inverse_translate = this.get_inv_translate();

    var inverse_m = mult(mult(inverse_scale, inverse_rotate), inverse_translate);
    var local_coords = multVec(inverse_m, coords);

    var distance = Math.sqrt(Math.pow(this.center[0], local_coords[0]) + Math.pow(this.center[1], local_coords[1]));

    if(distance <= this.radius){
        
        return true;
    }
    console.log("n interc CIRCLE");
    return false;
}

Circle.prototype.draw = function(canv = ctx) { //requer o contexto de desenho
    //pega matriz de tranformação de coordenadas canônicas para coordenadas do canvas
    var M = transformCanvas(WIDTH, HEIGHT);
    var Mg = mult(M, mult(mult(this.T, this.R), this.S));
    canv.lineWidth = 2; //largura da borda
    canv.strokeStyle = this.stroke;
    canv.fillStyle = this.fill;
    //criação dos pontos do retângulo de acordo com o centro, largura e altura
    var points = [];
    var alpha = 2 * Math.PI / SEGMENTS_CIRCLE;
    for (i = 0; i < SEGMENTS_CIRCLE; i++) {
        points.push([Math.cos(alpha * i) * this.radius + this.center[0], Math.sin(alpha * i) * this.radius + this.center[1], 1]);
    }
    ctx.beginPath();
    for (var i = 0; i < points.length; i++) {
        points[i] = multVec(Mg, points[i]); //transformando o ponto em coordenadas canonicas em coordenadas do canvas
        if (i == 0) canv.moveTo(points[i][0], points[i][1]);
        else canv.lineTo(points[i][0], points[i][1]);
    }
    canv.lineTo(points[0][0], points[0][1]); //fechando o retângulo
    canv.fill(); //aplica cor de preenchimento
    canv.strokeStyle = this.stroke;
    canv.stroke(); //aplica cor de contorno

    //desenho do nome
    canv.beginPath();
    canv.fillStyle = this.stroke;
    canv.font = "16px Courier";
    var center = multVec(Mg, this.center);
    canv.fillText(this.name, center[0] - this.name.length * 16 / 3, center[1] + 3); //deixa o texto mais ou menos centralizado no meio da caixa
}