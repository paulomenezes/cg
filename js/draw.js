var camera = {
	C: { x: 0, y: -500, z: 500 },
	N: { x: 0, y: 1, z: -1 },
	V: { x: 0, y: -1, z: -1 },
	d: 5,
	hX: 2,
	hY: 2
};

function initialize () {
	$("#cameraCX").value = camera.C.x;
	$("#cameraCY").value = camera.C.y;
	$("#cameraCZ").value = camera.C.z;
	$("#cameraNX").value = camera.N.x;
	$("#cameraNY").value = camera.N.y;
	$("#cameraNZ").value = camera.N.z;
	$("#cameraVX").value = camera.V.x;
	$("#cameraVY").value = camera.V.y;
	$("#cameraVZ").value = camera.V.z;
	$("#cameraD").value = camera.d;
	$("#cameraHX").value = camera.hX;
	$("#cameraHY").value = camera.hY;
};
initialize();

var vertices = [];
var triangulos = [];

var color = false;

function $ (element) {
	return document.querySelector(element);
}

function update () {
	camera = {
		C: {
			x: parseFloat($("#cameraCX").value),
			y: parseFloat($("#cameraCY").value),
			z: parseFloat($("#cameraCZ").value),
		},
		N: {
			x: parseFloat($("#cameraNX").value),
			y: parseFloat($("#cameraNY").value),
			z: parseFloat($("#cameraNZ").value),
		},
		V: {
			x: parseFloat($("#cameraVX").value),
			y: parseFloat($("#cameraVY").value),
			z: parseFloat($("#cameraVZ").value),
		},
		d: parseFloat($("#cameraD").value),
		hX: parseFloat($("#cameraHX").value),
		hY: parseFloat($("#cameraHY").value)
	};

	color = $("#color").checked;

	draw();
}

function coordenadaVista (ponto) {
	// ortogonalizar V
	var prod = produtoEscalar(camera.V, camera.N) / produtoEscalar(camera.N, camera.N);
	var vLinha = new Point(camera.V.x - prod * camera.N.x, camera.V.y - prod * camera.N.y, camera.V.z - prod * camera.N.z);

	// Normalização
	camera.N = normalizar(camera.N);
	vLinha = normalizar(vLinha);

	// U = N x V'
	var U = {
		x: camera.N.y * vLinha.z - camera.N.z * vLinha.y, 
		y: camera.N.z * vLinha.x - camera.N.x * vLinha.z, 
		z: camera.N.x * vLinha.y - camera.N.y * vLinha.x
	};

	var alpha = {
		x: normalizar(U),
		y: vLinha,
		z: camera.N
	};
	var matrizTransformacao = [
		[alpha.x.x, alpha.x.y, alpha.x.z],
		[alpha.y.x, alpha.y.y, alpha.y.z],
		[alpha.z.x, alpha.z.y, alpha.z.z]
	];

	var subPonto = subtracaoPontos(camera.C, ponto);
	return multiplicarMatriz(matrizTransformacao, [[subPonto.x],[subPonto.y],[subPonto.z]]);
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

function draw (data) {
	try {
		if (data) {
			vertices = [];
			triangulos = [];

			var data = data.split('\n');
			var vLen = data[0].split(' ')[0];
			var tLen = data[0].split(' ')[1];

			for (var i = 1; i <= parseInt(vLen); i++) {
				vertices.push(data[i].split(' '));
			}

			for (var i = parseInt(vLen) + 1; i < data.length - 1; i++) {
				triangulos.push(data[i].split(' '));
			}
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (var i = 0; i < triangulos.length; i++) {
			var verticesTriangulo = [
				[vertices[triangulos[i][0] - 1][0], vertices[triangulos[i][0] - 1][1], vertices[triangulos[i][0] - 1][2]], 
				[vertices[triangulos[i][1] - 1][0], vertices[triangulos[i][1] - 1][1], vertices[triangulos[i][1] - 1][2]], 
				[vertices[triangulos[i][2] - 1][0], vertices[triangulos[i][2] - 1][1], vertices[triangulos[i][2] - 1][2]]
			];

			var triV = [];

			for (var j = 0; j < verticesTriangulo.length; j++) {
				var vista = coordenadaVista(new Point(verticesTriangulo[j][0], verticesTriangulo[j][1], verticesTriangulo[j][2]));
				
				var Xs = (camera.d / camera.hX) * (vista[0][0] / vista[2][0]);
				var Ys = (camera.d / camera.hY) * (vista[1][0] / vista[2][0]);				

				var Xs1 = Xs / camera.hX;
				var Ys1 = Ys / camera.hY;

				var outroPonto = normalizar(new Point(Xs, Ys, 0));

				var xi = (((Xs + 1) / 2) * 500);
				var xj = (500 - ((Ys + 1) / 2) * 500);

				triV.push({
					x: xi, 
					y: xj
				});
			}

			if (triV[0].y > triV[1].y) swap(triV, 0, 1);
			if (triV[0].y > triV[2].y) swap(triV, 0, 2);
			if (triV[1].y > triV[2].y) swap(triV, 1, 2);

			var a1 = 0;
			var a2 = 0;
			if (triV[1].y == triV[2].y) {
				a1 = (triV[2].y - triV[0].y) / (triV[2].x - triV[0].x);
				a2 = (triV[1].y - triV[0].y) / (triV[1].x - triV[0].x);

				ctx.fillStyle = getRndColor();
				drawTopBottom(triV, a1, a2);
			} else if (triV[0].y == triV[1].y) {
				a1 = (triV[0].y - triV[2].y) / (triV[0].x - triV[2].x);
				a2 = (triV[1].y - triV[2].y) / (triV[1].x - triV[2].x);

				ctx.fillStyle = getRndColor();
				drawBottomTop(triV, a1, a2);
			} else {
				var v4x = (triV[0].x + ((triV[1].y - triV[0].y) / (triV[2].y - triV[0].y)) * (triV[2].x - triV[0].x));

				a1 = (triV[1].y - triV[0].y) / (triV[1].x - triV[0].x);
				a2 = (triV[1].y - triV[0].y) / (v4x - triV[0].x);

				triV.push({
					x: v4x,
					y: triV[1].y
				})

				ctx.fillStyle = getRndColor();
				drawTopBottom(triV, a1, a2);

				a1 = (triV[0].y - triV[2].y) / (triV[0].x - triV[2].x);
				a2 = (triV[1].y - triV[2].y) / (triV[1].x - triV[2].x);

				drawBottomTop(triV, a1, a2);
			}

			/*ctx.fillStyle = '#FFF';
			for (var j = 0; j < triV.length; j++) {
				ctx.beginPath();
				ctx.fillRect(triV[j].x, triV[j].y, 1, 1);
			}*/
		}
	} catch (error) {
		console.log(error);
		alert('Arquivo inválido');
	}
}

function drawTopBottom (triV, a1, a2) {
	var xMin = triV[0].x;
	var xMax = triV[0].x;

	if (triV[0].x > triV[3].x || triV[0].x < triV[1].x) {
		var aux = a1;
		a1 = a2;
		a2 = aux;
	}

	for (var j = triV[0].y; j < triV[1].y; j++) {
		for (var k = xMin; k < xMax; k++) {
			ctx.fillRect(k, j, 1, 1);
		}
		xMin += 1 / a1;
		xMax += 1 / a2;
	}
}

function drawBottomTop (triV, a1, a2) {
	var xMin = triV[2].x;
	var xMax = triV[2].x;

	if (triV[2].x > triV[3].x || triV[2].x < triV[1].x) {
		var aux = a1;
		a1 = a2;
		a2 = aux;
	}

	for (var j = triV[2].y; j >= triV[1].y; j--) {
		for (var k = xMax; k >= xMin; k--) {
			ctx.fillRect(k, j, 1, 1);
		}
		xMin -= 1 / a2;
		xMax -= 1 / a1;
	}
}

function swap (array, i, j) {
	var aux = array[i];
	array[i] = array[j];
	array[j] = aux;
}

function getRndColor() {
	if (color) {
	    var r = 255*Math.random()|0,
	        g = 255*Math.random()|0,
	        b = 255*Math.random()|0;
	    return 'rgb(' + r + ',' + g + ',' + b + ')';
	} else {
		return '#FFF';
	}
}