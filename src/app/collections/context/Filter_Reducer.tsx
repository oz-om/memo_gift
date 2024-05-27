import { T_FilteredData, T_data, T_pagination } from "./Filter_Context";

export type T_FilterReducerAction =
  | {
      type: "fullData" | "fullFilteredData" | "filteredData";
      payload: T_data[];
    }
  | {
      type: "pagination";
      payload: T_pagination;
    }
  | {
      type: "isPending";
      payload: boolean;
    };

export function Filter_Reducer(state: T_FilteredData, action: T_FilterReducerAction): T_FilteredData {
  const { type, payload } = action;
  switch (type) {
    case type == "fullData" ? "fullData" : type == "fullFilteredData" ? "fullFilteredData" : "filteredData":
      return { ...state, [type as keyof T_FilteredData]: payload };
    case "pagination":
      return { ...state, pagination: payload };
    case "isPending":
      return { ...state, isPending: payload };
    default:
      throw new Error(`Invalid action type`);
  }
}
