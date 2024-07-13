"use client";
import { Dispatch, createContext, useContext, useEffect, useReducer } from "react";
import { T_FilterReducerAction, filterReducer } from "./Filter_Reducer";
import { useQuery } from "@tanstack/react-query";
import { getItems } from "../../_actions/actions";

export type T_data = {
  id: string;
  name: string;
  price: number;
  images: string;
  theme: string;
  categories: {
    cat_name: string;
  }[];
};
export type T_pagination = {
  page: number;
  limit: number;
  total: number;
};
export type T_FilteredData = {
  fullData: T_data[];
  fullFilteredData: T_data[];
  filteredData: T_data[];
  pagination: T_pagination;
  isPending: boolean;
  dispatch: Dispatch<T_FilterReducerAction>;
};

const initialFilteredData: T_FilteredData = {
  fullData: [],
  fullFilteredData: [],
  filteredData: [],
  pagination: {
    page: 1,
    limit: 24,
    total: 1,
  },
  isPending: true,
  dispatch: () => {},
};
const FilterContext = createContext<T_FilteredData>(initialFilteredData);

export default function FilterContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(filterReducer, initialFilteredData);
  const { data, isPending } = useQuery({
    queryKey: ["getItems"],
    queryFn: async () => getItems(),
    staleTime: 1000 * 60 * 5,
  });

  const setFullData = (data: T_data[]) => dispatch({ type: "fullData", payload: data });
  const setFullFilteredData = (data: T_data[]) => dispatch({ type: "fullFilteredData", payload: data });
  const setFilteredData = (data: T_data[]) => dispatch({ type: "filteredData", payload: data });

  const setPending = (pending: boolean) => dispatch({ type: "isPending", payload: pending });
  const setPagination = (data: T_pagination) => dispatch({ type: "pagination", payload: data });
  useEffect(() => {
    if (!isPending) {
      setPending(false);
    }
    if (data && data.success && state.fullData.length == 0) {
      const paginatedData = data.items.slice(0, state.pagination.limit);
      setFullData(data.items);
      setFullFilteredData(data.items);
      setFilteredData(paginatedData);
      setPagination({ ...state.pagination, total: Math.ceil(data.items.length / state.pagination.limit) });
    }
  }, [isPending]);
  return <FilterContext.Provider value={{ ...state, dispatch }}>{children}</FilterContext.Provider>;
}

export function useFilteredData() {
  const { dispatch, ...context } = useContext(FilterContext);
  const setPending = (pending: boolean) => dispatch({ type: "isPending", payload: pending });
  const setFullData = (data: T_data[]) => dispatch({ type: "fullData", payload: data });
  const setFullFilteredData = (data: T_data[]) => dispatch({ type: "fullFilteredData", payload: data });
  const setFilteredData = (data: T_data[]) => dispatch({ type: "filteredData", payload: data });
  const setPagination = (data: T_pagination) => dispatch({ type: "pagination", payload: data });
  return { ...context, setPending, setFullData, setFullFilteredData, setFilteredData, setPagination };
}
