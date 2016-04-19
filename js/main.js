var m1 = [
	[1.5, 2.5, 3.5],
	[4.5, 5.5, 6.5]
];

var m2 = [
	[7.5, 8.5],
	[9.5, 10.5],
	[11.5, 12.5]
];

console.log('1.');
console.log('a) multiplicarMatriz:');
table(multiplicarMatriz(m1, m2));
console.log('b) subtracaoPontos', subtracaoPontos(new Point(10, 20), new Point(20, 10)).toString());
console.log('c) produtoEscalar', produtoEscalar(new Point(3.5, 1.5, 2), new Point(1, 2, 1.5)));
console.log('d) produtoVetorial', produtoVetorial(new Point(1, 2, 1), new Point(1, 0, -1)).toString());
console.log('e) norma', norma(new Point(3.5, 1.5, 2)));
console.log('f) normalizar', normalizar(new Point(3.5, 1.5, 2)).toString());
console.log('g) coordenadasBaricentricas:');
table(coordenadasBaricentricas(
	new Point(-0.25, 0.75), new Point(-1, 1), new Point(0, -1), new Point(1, 1)
));
console.log('h) coordenadasCatesianas', coordenadasCatesianas(
	new Point(0.5, 0.25, 0.25), new Point(-1, 1), new Point(0, -1), new Point(1, 1)
).toString());

function table (matriz) {
	for (var i = 0; i < matriz.length; i++) {
		console.log('\t' + i, matriz[i]);
	};
}