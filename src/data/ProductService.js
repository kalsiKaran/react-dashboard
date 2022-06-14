export class ProductService {

    getProductsSmall() {
        return fetch('data/products-small.json')
        .then(res => res.json())
        .then(d => d.data);
    }
}
     