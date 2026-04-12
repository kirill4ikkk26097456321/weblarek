import './scss/styles.scss';
import { Products } from './components/Products';
import { Basket } from './components/Basket';
import { Buyer } from './components/Buyer';
import { LarekApi } from './components/LarekApi';
import { Api } from './components/base/Api';
import { API_URL, settings } from './utils/constants';
import { apiProducts } from './utils/data';


const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();


console.log('--- Тестирование Buyer ---');
buyerModel.setField('email', 'test@test.ru');
buyerModel.setField('address', 'Москва, ул. Пушкина');
console.log('Данные покупателя:', buyerModel.getData());
console.log('Ошибки валидации:', buyerModel.validate());
buyerModel.clear();
console.log('После очистки:', buyerModel.getData());

console.log('--- Тестирование Products ---');
productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога (mock): ', productsModel.getItems());

const mockProduct = apiProducts.items[0];
if (mockProduct) {
  productsModel.setPreview(mockProduct);
  console.log('Превью товара (mock): ', productsModel.getPreview());
  console.log('Поиск по ID (mock): ', productsModel.getProduct(mockProduct.id));

  console.log('--- Тестирование Basket ---');
  basketModel.add(mockProduct);
  console.log('Корзина после добавления (mock): ', basketModel.getItems());
  console.log('Сумма (mock): ', basketModel.getTotal());
  console.log('Количество (mock): ', basketModel.getCount());
  console.log('Есть в корзине? (mock): ', basketModel.contains(mockProduct.id));

  basketModel.remove(mockProduct.id);
  console.log('После удаления (mock): ', basketModel.getItems());
}

console.log('--- Тестирование API ---');
const baseApi = new Api(API_URL, settings);
const larekApi = new LarekApi(baseApi);

larekApi.getProducts()
  .then((data) => {
    console.log('Ответ сервера (GET /product):', data.items);
  })
  .catch((err) => {
    console.error('Ошибка при получении товаров с сервера:', err);
  });