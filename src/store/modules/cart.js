import shop from '../../api/shop';
import * as productsActions from './products';

const state = {
  items: [],
  checkoutStatus: null,
};

export const CART_PRODUCTS = 'cartProducts';
export const CART_TOTAL_PRICE = 'cartTotalPrice';

const getters = {
  [CART_PRODUCTS]: (state, getters, rootState) => {
    return state.items.map(({id, quantity}) => {
      const product = rootState.products.all.find(product => product.id === id);

      return {
        title: product.title,
        price: product.price,
        quantity,
      };
    });
  },

  cartTotalPrice: (state, getters) => {
    return getters.cartProducts.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  },
};

export const CHECKOUT = 'checkout';
export const ADD_PRODUCT_TO_CART = 'addProductToCart';

const actions = {
  [CHECKOUT]({commit, state}, products) {
    const savedCartItems = [...state.items];
    commit(SET_CHECKOUT_STATUS, null);
    commit(SET_CART_ITEMS, {items: []});

    shop.buyProducts(
      products,
      () => commit(SET_CHECKOUT_STATUS, 'successful'),
      () => {
        commit(SET_CHECKOUT_STATUS, 'failed');
        commit(SET_CART_ITEMS, {items: savedCartItems});
      }
    );
  },

  [ADD_PRODUCT_TO_CART]({state, commit}, product) {
    commit(SET_CHECKOUT_STATUS, null);

    if (product.inventory > 0) {
      const cartItem = state.items.find(item => item.id === product.id);

      if (!cartItem) {
        commit(PUSH_PRODUCT_TO_CART, {id: product.id});
      } else {
        commit(INCREMENT_ITEM_QUANTITY, cartItem);
      }

      commit(`products/${productsActions.DECREMENT_PRODUCT_INVENTORY}`, {id: product.id}, {root: true});
    }
  },
};

export const INCREMENT_ITEM_QUANTITY = 'incrementItemQuantity';
export const PUSH_PRODUCT_TO_CART = 'pushProductToCart';
export const SET_CART_ITEMS = 'setCartItems';
export const SET_CHECKOUT_STATUS = 'setCheckoutStatus';

const mutations = {
  [PUSH_PRODUCT_TO_CART](state, {id}) {
    state.items.push({
      id,
      quantity: 1,
    });
  },

  [INCREMENT_ITEM_QUANTITY](state, {id}) {
    const cartItem = state.items.find(item => item.id === id);
    cartItem.quantity++;
  },

  [SET_CART_ITEMS](state, {items}) {
    state.items = items;
  },

  [SET_CHECKOUT_STATUS](state, status) {
    state.checkoutStatus = status;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
