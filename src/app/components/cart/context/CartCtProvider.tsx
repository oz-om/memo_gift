"use client";

import { Dispatch, createContext, useContext, useEffect, useReducer } from "react";
import { T_cartReducerAction, cartReducer } from "./cartReducer";
import { T_cart, getCartContent } from "../actions";

export type T_cartContent = {
  cart: T_cart[];
  dispatch: Dispatch<T_cartReducerAction>;
};
const cart: T_cartContent = {
  cart: [],
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
  return { ...context, setCartContent, increment, decrement };
}
