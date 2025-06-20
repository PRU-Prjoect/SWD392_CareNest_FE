// store/hooks.ts
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { RootState, AppDispatch } from "./store";

// ✅ Typed version của useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// ✅ Typed version của useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
