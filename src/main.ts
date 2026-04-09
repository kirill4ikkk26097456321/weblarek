import { Products } from './components/base/Models/Products';
import { Basket } from './components/base/Models/Basket';
import { Buyer } from './components/base/Models/Buyer';
import { LarekApi } from './components/base/LarekApi';
import { API_URL, settings } from './utils/constants';

const api = new LarekApi(API_URL, settings);
console.log('Мой API_URL:', API_URL);
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

api.getProducts()
  .then((data) => {
    console.log('--- Тестирование Products ---');
    productsModel.setItems(data.items);
    console.log('Массив товаров из каталога: ', productsModel.getItems());

    const firstProduct = data.items[0];
    if (firstProduct) {
      productsModel.setPreview(firstProduct);
      console.log('Превью товара: ', productsModel.getPreview());
      console.log('Поиск по ID: ', productsModel.getProduct(firstProduct.id));

      console.log('--- Тестирование Basket ---');
      basketModel.add(firstProduct);
      console.log('Корзина после добавления: ', basketModel.getItems());
      console.log('Сумма: ', basketModel.getTotal());
      console.log('Количество: ', basketModel.getCount());
      console.log('Есть в корзине? ', basketModel.contains(firstProduct.id));

      basketModel.remove(firstProduct.id);
      console.log('После удаления: ', basketModel.getItems());
    }
  })
  .catch((err) => {
    console.error('Ошибка при получении товаров:', err);
  });