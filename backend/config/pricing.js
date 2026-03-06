const PRICING = {
	standard: {
		byPool: {
			1: 69.99,
			2: 79.99,
			3: 89.99,
		},
	},
	premium: {
		byPool: {
			1: 89.99,
			2: 99.99,
			3: 109.99,
		},
	},
};

function resolvePool(paidCount) {
	const n = Number(paidCount) || 0;
	// Pula 1: pierwsze 100 opłaconych
	// Pula 2: 101-300 opłaconych
	// Pula 3: 301+ opłaconych
	if (n < 100) return 1;
	if (n < 300) return 2;
	return 3;
}

function calculateAmount(formData, { paidCount } = {}) {
	const packageType = String(formData?.packageType || '').toLowerCase();
	if (!packageType) {
		throw new Error('Brak packageType – nie można wyliczyć kwoty płatności');
	}

	const packagePricing = PRICING[packageType];
	if (!packagePricing) {
		throw new Error(`Nieznany packageType: ${packageType}`);
	}

	if (packageType === 'premium') {
		const tshirt = String(formData?.tshirt || '');
		if (!tshirt) {
			throw new Error('Pakiet premium wymaga podania rozmiaru koszulki (tshirt)');
		}
	}

	const pool = resolvePool(paidCount);
	const amount = packagePricing.byPool?.[pool];
	if (typeof amount !== 'number') {
		throw new Error(`Brak ceny dla packageType=${packageType} w puli=${pool}`);
	}

	return Number(amount.toFixed(2));
}

module.exports = {
	PRICING,
	resolvePool,
	calculateAmount,
};
