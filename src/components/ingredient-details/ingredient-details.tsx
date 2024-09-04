import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { selectIngredientById } from '../../slices/ingredientModalSlice';
import { useDispatch, useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { selectedIngredient, isIngredientsLoading } = useSelector(
    (state) => state.ingredient_modal
  );

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
