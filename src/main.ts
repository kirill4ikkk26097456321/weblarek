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

console.log('--- Тестирование Products (mock) ---');
productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога (mock): ', productsModel.getItems());

const mockProduct1 = apiProducts.items[0];
const mockProduct2 = apiProducts.items[1];

if (mockProduct1) {
  productsModel.setPreview(mockProduct1);
  console.log('Превью товара (mock): ', productsModel.getPreview());
  console.log('Поиск по ID (mock): ', productsModel.getProduct(mockProduct1.id));
}

console.log('--- Тестирование Basket ---');
if (mockProduct1 && mockProduct2) {
  basketModel.add(mockProduct1);
  basketModel.add(mockProduct2);
  console.log('Корзина после добавления (mock): ', basketModel.getItems());
  console.log('Сумма (mock): ', basketModel.getTotal());
  console.log('Количество (mock): ', basketModel.getCount());

  basketModel.remove(mockProduct1.id);
  console.log('После удаления (mock): ', basketModel.getItems());

  basketModel.clear();
  console.log('Корзина после clear (mock): ', basketModel.getItems());
}

console.log('--- Тестирование API ---');
const baseApi = new Api(API_URL, settings);
const larekApi = new LarekApi(baseApi);

larekApi.getProducts()
  .then((data) => {
    productsModel.setItems(data.items);
    console.log('Данные каталога из модели (API):', productsModel.getItems());
  })
  .catch((err) => {
    console.error('Ошибка при получении товаров с сервера:', err);
  });