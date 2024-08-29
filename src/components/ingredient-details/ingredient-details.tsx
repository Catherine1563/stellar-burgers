import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import { useParams } from 'react-router-dom';
import {
  fetchIngredients,
  selectIngredientById
} from '../../slices/ingredientModalSlice';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedIngredient, isIngredientsLoading } = useSelector(
    (state: RootState) => state.ingredient_modal
  );

  useEffect(() => {
    if (!isIngredientsLoading && !selectedIngredient) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, isIngredientsLoading, selectedIngredient]);

  useEffect(() => {
    if (id) {
      if (!isIngredientsLoading) {
        dispatch(selectIngredientById(id));
      }
    }
  }, [id, dispatch, isIngredientsLoading]);

  if (isIngredientsLoading || !selectedIngredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={selectedIngredient} />;
};
