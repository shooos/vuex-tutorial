<template>
  <ul>
    <li v-for="product in products" :key="product.id">
      {{ product.title }} - {{ product.price | currency }}
      <br>
      <button
        :disabled="!product.inventory"
        @click="addProductToCart(product)">
        Add to cart
      </button>
    </li>
  </ul>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import * as productsActions from '../store/modules/products';
import * as cartActions from '../store/modules/cart';

export default {
  computed: mapState({
    products: state => state.products.all,
  }),
  methods: mapActions('cart', [cartActions.ADD_PRODUCT_TO_CART]),
  created() {
    console.log('created');
    this.$store.dispatch(`products/${productsActions.GET_ALL_PRODUCTS}`);
  },
};
</script>
