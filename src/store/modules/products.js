import shop from '../../api/shop';

const state = {
  all: [],
};

const getters = {};

export const GET_ALL_PRODUCTS = 'getAllProducts';

const actions = {
  [GET_ALL_PRODUCTS]({commit}) {
    console.log('GET_ALL_PRODUCTS');
    shop.getProducts(products => commit(SET_PRODUCTS, products));
  },
};

export const SET_PRODUCTS = 'setProducts';
export const DECREMENT_PRODUCT_INVENTORY = 'decrementProductInventory';

const mutations = {
  [SET_PRODUCTS](state, products) {
    console.log('SET_PRODUCTS', products);
    state.all = products;
  },
  [DECREMENT_PRODUCT_INVENTORY](state, {id}) {
    const product = state.all.find(product => product.id === id);
    product.inventory--;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
