import { SearchParams, SearchParamsHook } from "./index";

declare function useSearchParams<Params extends string>(): ReturnType<SearchParamsHook<Params>>;

export default useSearchParams;
