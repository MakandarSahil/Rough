// src/hooks/useAppSelector.ts
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import type { RootState } from '../store'; // Correct import path

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;