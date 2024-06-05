"use client";

import { Dispatch, createContext, useContext, useReducer } from "react";
import { T_cartReducerAction, cartReducer } from "./cartReducer";
import { T_cart } from "../actions";

export type T_cartContent = {
  cart: T_cart[];
  loading: boolean;
  dispatch: Dispatch<T_cartReducerAction>;
};
const cart: T_cartContent = {
  cart: [],
  loading: true,
  dispatch: () => {},
};

const cartContent = createContext<T_cartContent>(cart);

export default function CartCtProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, cart);
  return <cartContent.Provider value={{ ...state, dispatch }}>{children}</cartContent.Provider>;
}

export function useCartContent() {
  const { dispatch, ...context } = useContext(cartContent);
  const setCartContent = (cartContent: T_cart[]) => dispatch({ type: "setCartContent", payload: cartContent });
  const increment = (targetItemId: string) => dispatch({ type: "increment", payload: targetItemId });
  const decrement = (targetItemId: string) => dispatch({ type: "decrement", payload: targetItemId });
  const deleteCartItem = (targetCartItemId: string) => dispatch({ type: "deleteCartItem", payload: targetCartItemId });
  const duplicateCartItem = (cartItem: T_cart) => dispatch({ type: "duplicate", payload: cartItem });
  const setLoading = (isLoading: boolean) => dispatch({ type: "loading", payload: isLoading });
  return { ...context, setCartContent, increment, decrement, deleteCartItem, duplicateCartItem, setLoading };
}
