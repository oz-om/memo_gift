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

export function filterReducer(state: T_FilteredData, action: T_FilterReducerAction): T_FilteredData {
  const { type, payload } = action;
  switch (type) {
    case type == "fullData" ? "fullData" : type == "fullFilteredData" ? "fullFilteredData" : type == "filteredData" ? "filteredData" : type:
      return { ...state, [type]: payload };
    case "pagination":
      return { ...state, pagination: payload };
    case "isPending":
      return { ...state, isPending: payload };
    default:
      throw new Error("the type is not valid");
  }
}
