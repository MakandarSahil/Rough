// src/hooks/useAppDispatch.ts
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store'; // Correct import path

export const useAppDispatch = () => useDispatch<AppDispatch>();