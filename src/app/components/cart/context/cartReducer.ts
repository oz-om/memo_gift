import { T_cart } from "../actions";
import { T_cartContent } from "./CartCtProvider";

export type T_cartReducerAction = { type: "setCartContent"; payload: T_cart[] } | { type: "increment" | "decrement"; payload: string } | { type: "deleteCartItem"; payload: string } | { type: "duplicate"; payload: T_cart } | { type: "loading"; payload: boolean };

export function cartReducer(state: T_cartContent, action: T_cartReducerAction): T_cartContent {
  const { type, payload } = action;

  switch (type) {
    case "setCartContent":
      return { ...state, cart: payload };
    case type == "increment" ? "increment" : "decrement":
      const inc_updated = in_decrement(state.cart, type, payload);
      return { ...state, cart: inc_updated };
    case "deleteCartItem":
      const updatedAfterDelete = deleteCartItem(state.cart, payload);
      return { ...state, cart: updatedAfterDelete };
    case "duplicate":
      return { ...state, cart: [payload, ...state.cart] };
    case "loading":
      return { ...state, loading: payload };
    default:
      throw new Error(`Action ${type} not supported`);
  }
}

function in_decrement(cartItems: T_cart[], action: "increment" | "decrement", targetItemId: string) {
  const updatedItems = cartItems.map((item) => {
    if (item.cart_item === targetItemId) {
      if (action == "increment") {
        item.cartItem.quantity++;
        console.log(item.cartItem.quantity);
      } else {
        item.cartItem.quantity--;
      }
    }
    return item;
  });

  return updatedItems;
}

function deleteCartItem(cartContent: T_cart[], targetCartItemId: string) {
  return cartContent.filter((cartItem) => {
    return cartItem.cart_item !== targetCartItemId;
  });
}
