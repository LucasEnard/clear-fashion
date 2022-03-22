// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// all products
let products = [];


// favorites
let favoriteSelectors = [];
let favoriteProducts;
if (localStorage.getItem('favoriteProducts') == null) {
	favoriteProducts = [];
}
else {
	favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts'));
}

// current products on the page
let currentProducts = [];
let brand = "all"
var currentPagination = {'currentPage':1,'pageSize':12};
let recentlyReleased = false;
let reasonablePrice = false;
let currentSort = -1;
let temp = [];

// initiate selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const selectSort = document.querySelector('#sort-select');
const sectionProducts = document.querySelector('#products');
const sectionFavorites = document.querySelector('#favorites');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbNewProducts = document.querySelector('#nbNewProducts');
const spanP50 = document.querySelector('#p50');
const spanP90 = document.querySelector('#p90');
const spanLastReleased = document.querySelector('#lastReleased');
const checkReleased = document.querySelector('#released-check');
const checkPrice = document.querySelector('#price-check');

/**
 * Set global value
 * @param {Number} size - number of products per page
 */
const setCurrentProducts = async () => {

	/**
	if (recentlyReleased) {
		temp = products.filter(product => {
			const rel = new Date(product.released);
			const today = new Date();
			return (today - rel)/(1000*60*60*24) < 14.0;
		});
	}
	else {
		temp = products;
	}
	*/
	if (reasonablePrice) {
		await fetchProducts(50).then(({result, meta}) => {temp = result;});
	}	
	else{
		await fetchProducts().then(({result, meta}) => {temp = result;});
	}
	
	currentProducts = temp;
};

/**
 * Get all the products and brands
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */

/**
 * Fetch products from api
 * @return {Object}
 */
const fetchProducts = async (price=-1) => {
	try {
		const response = await fetch(
			`https://clear-fashion-pearl.vercel.app/products/search?limit=${currentPagination.pageSize}&brand=${brand}&currentPage=${currentPagination.currentPage}&price=${price}&sort=${currentSort}`
		);
		const body = await response.json();

		if (body.success !== true) {
			console.error(body);
			return {currentProducts, currentPagination};
		}

		return body.data;
	} 
	catch (error) {
		console.error(error);
		return {currentProducts, currentPagination};
	}
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
	const fragment = document.createDocumentFragment();
	const div = document.createElement('div');
	let template = `
	<table>
		<thead>
			<tr>
				<th>Picture</th>
				<th>Name</th>
				<th>Price</th>
				<th>Brand</th>
				<th>Release date</th>
				<th>Favorite</th>
			</tr>
		</thead>
		<tbody>`;
	products.map(product => {
		let fav = '';
		if (favoriteProducts.includes(product.uuid)) {
			fav = 'checked';
		}
		template += `
		<tr>
			<td><img src="${product.image}" width="150"></td>
			<td><a href="${product.url}" target="_blank">${product.name}</a></td>
			<td>${product.price}€</td>
			<td>${product.brand}</td>
			<td>${product.released}</td>
			<td><input type="checkbox" id="check-${product.uuid}" ${fav}></td>
		</tr>`;
    });
	
	template += `
		</tbody>
	</table>`;

	div.innerHTML = template;
	fragment.appendChild(div);
	sectionProducts.innerHTML = '<h2>Products</h2>';
	sectionProducts.appendChild(fragment);
	/**
	favoriteSelectors.forEach(selector => {
		selector.removeEventListener('change', favEventListener);
		selector.parentElement.removeChild(selector);
	});
	favoriteSelectors = [];
	products.map(product => {
		const selector = document.querySelector(`#check-${product.uuid}`);
		selector.addEventListener('change', favEventListener);
		favoriteSelectors.push(selector);
	});*/
};

/**
 * Render indicators
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
	
	spanNbProducts.innerHTML = currentProducts.length;
	/**
	temp = currentProducts.filter(product => {
		const rel = new Date(product.released);
		const today = new Date();
		return (today - rel)/(1000*60*60*24) < 14.0;
	});
	spanNbNewProducts.innerHTML = temp.length;
	*/

	temp = currentProducts;
	temp.sort((product1, product2) => {
		return product1.price-product2.price;
	});
	spanP50.innerHTML = String(temp[Math.ceil(temp.length*0.50)].price) + '€';
	spanP90.innerHTML = String(temp[Math.ceil(temp.length*0.90)].price) + '€';
	
	temp.sort((product1, product2) => {
		const date1 = new Date(product1.released);
		const date2 = new Date(product2.released);
		return date2-date1;
	});
	spanLastReleased.innerHTML = temp[0].released;
};
/**
 * Render favorite products
 * 
 */
/**
 const renderFavorites = () => {
	const fragment = document.createDocumentFragment();
	const div = document.createElement('div');
	let template = `
	<table>
		<thead>
			<tr>
				<th>Picture</th>
				<th>Name</th>
				<th>Brand</th>
				<th>Price</th>
				<th>Release date</th>
			</tr>
		</thead>
		<tbody>`;
	favoriteProducts.map(uuid => {
		const product = products.filter(p => {return p.uuid == uuid;})[0];
		template += `
		<tr>
			<td><img src="${product.image}" width="150"></td>
			<td><a href="${product.url}" target="_blank">${product.name}</a></td>
			<td>${product.brand}</td>
			<td>${product.price}€</td>
			<td>${product.released}</td>
		</tr>`;
    });

	template += `
		</tbody>
	</table>`;

	div.innerHTML = template;
	fragment.appendChild(div);
	sectionFavorites.innerHTML = '<h2>Favorite Products</h2>';
	sectionFavorites.appendChild(fragment); 
 };
*/

/**
 * General rendering function
 * @param  {Object} products
 * @param  {Object} pagination
 */
const render = () => {
	renderProducts(currentProducts);
	renderIndicators(currentPagination);
	//renderFavorites();
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('input', event => {
	currentPagination.pageSize = event.target.value;
	setCurrentProducts().then(() =>render());
});

/**
 * Select the page to display
 * @type {[type]}
 */
selectPage.addEventListener('input', event => {
	currentPagination.currentPage = event.target.value;
	setCurrentProducts().then(() =>render());
});

/**
 * Select the brand
 * @type {[type]}
 */
selectBrand.addEventListener('input', event => {
	brand = event.target.value;
	setCurrentProducts().then(() =>render());
});

/**
 * Filter by recently released (less than 2 weeks)
 * @type {[type]}
 */
checkReleased.addEventListener('input', event => {
	recentlyReleased = event.target.checked;
	setCurrentProducts().then(() =>render());
});

/**
 * Filter by reasonable price (less than 50€)
 * @type {[type]}
 */
checkPrice.addEventListener('change', event => {
	reasonablePrice = event.target.checked;
	setCurrentProducts().then(() =>render());
});

/**
 * Select the sorting method
 * @type {[type]}
 */
selectSort.addEventListener('input', event => {
	currentSort = event.target.selectedIndex;
	setCurrentProducts().then(() =>render());
});

/**
 * Favorite event listener function
 * @type {Object}
 */
const favEventListener = (ev) => {
	if (ev.target.checked) {
		favoriteProducts.push(ev.target.id.split('-').splice(1).join('-'));
	}
	else {
		favoriteProducts.splice(favoriteProducts.indexOf(ev.target.id.split('-').splice(1).join('-')), 1);
	}
	localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
	setCurrentProducts().then(() =>render());
};

/**
 * On first load
 * @type {[type]}
 */
document.addEventListener('DOMContentLoaded', () => {
	setCurrentProducts().then(() =>render());
});