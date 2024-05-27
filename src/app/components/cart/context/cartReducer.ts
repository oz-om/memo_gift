import { T_cart } from "../actions";
import { T_cartContent } from "./CartCtProvider";

export type T_cartReducerAction =
  | {
      type: "setCartContent";
      payload: T_cart[];
    }
  | {
      type: "increment" | "decrement";
      payload: string;
    };

export function cartReducer(state: T_cartContent, action: T_cartReducerAction): T_cartContent {
  const { type, payload } = action;

  switch (type) {
    case "setCartContent":
      return { ...state, cart: payload };
    case type == "increment" ? "increment" : "decrement":
      const inc_updated = in_decrement(state.cart, type, payload);
      if (!inc_updated) return state;
      return { ...state, cart: inc_updated };
    default:
      throw new Error(`Action ${type} not supported`);
  }
}

function in_decrement(cartItems: T_cart[], action: "increment" | "decrement", targetItemId: string) {
  const restItems = cartItems.filter((cartItem) => cartItem.cart_item !== targetItemId);

  let targetItem = cartItems.find((cartItem) => cartItem.cart_item === targetItemId);

  if (!targetItem) {
    return;
  }
  if (action == "increment") {
    targetItem.cartItem.quantity++;
  } else {
    targetItem.cartItem.quantity--;
  }

  return [targetItem, ...restItems];
}
