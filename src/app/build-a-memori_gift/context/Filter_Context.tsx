"use client";
import { Dispatch, createContext, useContext, useEffect, useReducer } from "react";
import { Filter_Reducer, T_FilterReducerAction } from "./Filter_Reducer";
import { useQuery } from "@tanstack/react-query";
import { getItems } from "../actions";

export type T_data = {
  id: string;
  name: string;
  images: string;
  price: number;
  theme: string;
  desc: string;
  categories: {
    cat_name: string;
  }[];
};
export type T_pagination = { page: number; limit: number; total: number };

export type T_FilteredData = {
  fullData: T_data[];
  fullFilteredData: T_data[];
  filteredData: T_data[];
  pagination: T_pagination;
  dispatch: Dispatch<T_FilterReducerAction>;
  isPending: boolean;
};
const initFilteredData: T_FilteredData = {
  fullData: [],
  fullFilteredData: [],
  filteredData: [],
  pagination: {
    page: 1,
    limit: 2,
    total: 2,
  },
  dispatch: () => {},
  isPending: true,
};
const FilteredDataContext = createContext<T_FilteredData>(initFilteredData);

export default function FilteredDataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(Filter_Reducer, initFilteredData);
  const { data, isPending } = useQuery({
    queryKey: ["getItems"],
    queryFn: async () => await getItems(),
    staleTime: 1000 * 60 * 155,
  });
  useEffect(() => {
    if (!isPending) {
      dispatch({ type: "isPending", payload: false });
    }

    if (data && data.success && state.fullData.length == 0) {
      const paginationData = data.data.slice(0, state.pagination.limit);
      dispatch({ type: "fullData", payload: data.data });
      dispatch({ type: "fullFilteredData", payload: data.data });
      dispatch({ type: "filteredData", payload: paginationData });
      dispatch({ type: "pagination", payload: { ...state.pagination, total: Math.ceil(data.data.length / state.pagination.limit) } });
    }
  }, [data]);
  return <FilteredDataContext.Provider value={{ ...state, dispatch }}>{children}</FilteredDataContext.Provider>;
}

export function useFilteredData() {
  const context = useContext(FilteredDataContext);
  const setPending = (isPending: boolean) => context.dispatch({ type: "isPending", payload: isPending });

  const setFullData = (data: T_data[]) => context.dispatch({ type: "fullData", payload: data });
  const setFullFilteredData = (data: T_data[]) => context.dispatch({ type: "fullFilteredData", payload: data });
  const setFilteredData = (data: T_data[]) => context.dispatch({ type: "filteredData", payload: data });

  const setPagination = (pagination: T_pagination) => context.dispatch({ type: "pagination", payload: pagination });
  return { ...context, setPending, setFullData, setFullFilteredData, setFilteredData, setPagination };
}
