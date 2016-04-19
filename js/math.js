function multiplicarMatriz (m1, m2) {
	var resultado = [];

	if (m1[0].length == m2.length) {
		for (var i = 0; i < m1.length; i++) {
			resultado.push([]);

			for (var j = 0; j < m2[i].length; j++) {
				var t = 0;
				for (var k = 0; k < m1[i].length; k++) {
					t += m1[i][k] * m2[k][j];
				}

				resultado[i][j] = t;
			}
		}

		return resultado;
	} else {
		return 'matrizes inválidas';
	}
}

function subtracaoPontos (ponto1, ponto2) {
	return new Point(ponto2.x - ponto1.x, ponto2.y - ponto1.y, ponto2.z - ponto1.z);	
}

function produtoEscalar (vetor1, vetor2) {
	return (vetor1.x * vetor2.x) + (vetor1.y * vetor2.y) + (vetor1.z * vetor2.z);
}

function produtoVetorial (vetor1, vetor2) {
	return new Point(
			vetor1.y * vetor2.z - vetor1.z * vetor2.y, 
			vetor1.z * vetor2.x - vetor1.x * vetor2.z, 
			vetor1.x * vetor2.y - vetor1.y * vetor2.x);
}

function norma (vetor1) {
	return Math.sqrt(Math.pow(vetor1.x, 2) + Math.pow(vetor1.y, 2) + Math.pow(vetor1.z, 2));
}

function normalizar (vector) {
	var n = norma(vector);

	return new Point(vector.x / n, vector.y / n, vector.z / n);
}

function coordenadasBaricentricas (p, p1, p2, p3) {
	var matriz = [
		[p1.x - p3.x, p2.x - p3.x],
		[p1.y - p3.y, p2.y - p3.y]
	];

	var cof = 1 / (matriz[1][1] * matriz[0][0] - matriz[0][1] * matriz[1][0]);
	var inv = [
		[cof * matriz[0][0], cof * matriz[0][1]],
		[cof * matriz[1][0], cof * matriz[1][1]]
	];

	var outraMatriz = [
		[p.x - p3.x],
		[p.y - p3.y]
	];

	var alphaBeta = multiplicarMatriz(inv, outraMatriz);

	return [
		[alphaBeta[0][0], alphaBeta[1][0], 1 - parseFloat(alphaBeta[0][0]) - parseFloat(alphaBeta[1][0])]
	];
}

function coordenadasCatesianas (p, p1, p2, p3) {
	return new Point(
		p.x * p1.x + p.y * p2.x + p.z * p3.x,
		p.x * p1.y + p.y * p2.y + p.z * p3.y);
}