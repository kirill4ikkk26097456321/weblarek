import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api }          from './components/base/Api';

import { Products } from './components/Products';
import { Basket }   from './components/Basket';
import { Buyer }    from './components/Buyer';

import { LarekApi } from './components/LarekApi';

import { Page }       from './components/view/Page';
import { Modal }      from './components/view/Modal';
import { BasketView } from './components/view/BasketView';
import { CardCatalog, CardPreview, CardBasket } from './components/view/Card';
import { OrderForm, ContactsForm }              from './components/view/Form';
import { Success }    from './components/view/Success';

import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, settings }            from './utils/constants';
import { IBuyer, IProduct, FormErrors }  from './types';

const events = new EventEmitter();

events.onAll(({ eventName, data }) => {
  console.log(`[EVENT] ${eventName}`, data);
});

const productsModel = new Products(events);
const basketModel   = new Basket(events);
const buyerModel    = new Buyer(events);

const baseApi   = new Api(API_URL, settings);
const larekApi  = new LarekApi(baseApi);

const cardCatalogTemplate  = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate  = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate   = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate       = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate        = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate     = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate      = ensureElement<HTMLTemplateElement>('#success');

const page = new Page(document.body, events);

const modal = new Modal(
  ensureElement<HTMLElement>('#modal-container'),
  events
);

const basketView = new BasketView(
  cloneTemplate(basketTemplate),
  events
);

const orderForm = new OrderForm(
  cloneTemplate<HTMLFormElement>(orderTemplate),
  events
);

const contactsForm = new ContactsForm(
  cloneTemplate<HTMLFormElement>(contactsTemplate),
  events
);

const successView = new Success(
  cloneTemplate(successTemplate),
  events
);

function renderBasket(): HTMLElement {
  const items = basketModel.getItems();

  return basketView.render({
    total: basketModel.getTotal(),
    items: items.map((product, index) => {
      const card = new CardBasket(cloneTemplate(cardBasketTemplate), events);
      return card.render({
        id:    product.id,
        title: product.title,
        price: product.price,
        index: index + 1,
      });
    }),
  });
}

events.on('basket:change', () => {
  page.render({ counter: basketModel.getCount() });
});

events.on<FormErrors>('formErrors:change', (errors) => {

  const orderMessages = [errors.payment, errors.address].filter(Boolean) as string[];
  orderForm.render({
    valid:  orderMessages.length === 0,
    errors: orderMessages,
  });

  const contactsMessages = [errors.email, errors.phone].filter(Boolean) as string[];
  contactsForm.render({
    valid:  contactsMessages.length === 0,
    errors: contactsMessages,
  });
});

events.on<{ id: string }>('card:select', ({ id }) => {
  const product = productsModel.getProduct(id);
  if (!product) return;

  productsModel.setPreview(product);
});

events.on<{ item: IProduct }>('preview:change', ({ item: product }) => {
  const card = new CardPreview(cloneTemplate(cardPreviewTemplate), events);

  if (product.price === null) {
    card.buttonDisabled = true;
    card.buttonText     = 'Недоступно';
  } else if (basketModel.contains(product.id)) {
    card.buttonDisabled = false;
    card.buttonText     = 'Удалить из корзины';
  } else {
    card.buttonDisabled = false;
    card.buttonText     = 'Купить';
  }

  modal.render({
    content: card.render({
      id:          product.id,
      title:       product.title,
      image:       product.image,
      price:       product.price,
      category:    product.category,
      description: product.description,
    }),
  });
});

events.on<{ id: string }>('card:toBasket', ({ id }) => {
  const product = productsModel.getProduct(id);
  if (!product) return;

  if (basketModel.contains(id)) {
    basketModel.remove(id);
  } else {
    basketModel.add(product);
  }

  modal.close();
});

events.on<{ id: string }>('card:fromBasket', ({ id }) => {
  basketModel.remove(id);
  modal.close();
});

events.on<{ id: string }>('card:removeFromBasket', ({ id }) => {
  basketModel.remove(id);

  modal.render({ content: renderBasket() });
});

events.on('basket:open', () => {
  modal.render({ content: renderBasket() });
});

events.on('order:open', () => {
  const buyer = buyerModel.getData();
  modal.render({
    content: orderForm.render({
      payment: buyer.payment,
      address: buyer.address,
      valid:   false,
      errors:  [],
    }),
  });
});

events.on<{ field: keyof IBuyer; value: string }>(
  /^order\..+:change$/,
  ({ field, value }) => {
    buyerModel.setField(field, value as IBuyer[typeof field]);
  }
);

events.on('order:submit', () => {
  const buyer = buyerModel.getData();
  modal.render({
    content: contactsForm.render({
      email: buyer.email,
      phone: buyer.phone,
      valid: false,
      errors: [],
    }),
  });
});

events.on<{ field: keyof IBuyer; value: string }>(
  /^contacts\..+:change$/,
  ({ field, value }) => {
    buyerModel.setField(field, value as IBuyer[typeof field]);
  }
);

events.on('contacts:submit', () => {
  const buyer  = buyerModel.getData();
  const items  = basketModel.getItems();
  const total  = basketModel.getTotal();

  larekApi
    .orderProducts({
      ...buyer,
      items: items.map((p: IProduct) => p.id),
      total,
    })
    .then((result) => {
      modal.render({
        content: successView.render({ total: result.total }),
      });
      basketModel.clear();
      buyerModel.clear();
      page.render({ counter: 0 });
    })
    .catch((err: string) => {
      console.error('Ошибка при оформлении заказа:', err);
    });
});

events.on('success:close', () => {
  modal.close();
});

events.on('modal:close', () => {
  page.render({ locked: false });
});

const _originalModalRender = modal.render.bind(modal);
modal.render = (data) => {
  page.render({ locked: true });
  return _originalModalRender(data);
};

larekApi
  .getProducts()
  .then((data) => {
    productsModel.setItems(data.items);

    page.render({
      counter: basketModel.getCount(),
      catalog: productsModel.getItems().map((product) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events);
        return card.render({
          id:       product.id,
          title:    product.title,
          image:    product.image,
          price:    product.price,
          category: product.category,
        });
      }),
    });
  })
  .catch((err) => {
    console.error('Ошибка загрузки товаров:', err);
  });
