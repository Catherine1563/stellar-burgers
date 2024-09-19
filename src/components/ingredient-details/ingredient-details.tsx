import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { selectIngredientById } from '../../slices/ingredientModalSlice';
import { useDispatch, useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { buns, mains, sauces, isLoading } = useSelector(
    (state) => state.ingredients
  );
  const dispatch = useDispatch();
  const selectedIngredient = useSelector(
    (state) => state.ingredient_modal.selectedIngredient
  );

  const allIngredients = useMemo(
    () => [...buns, ...mains, ...sauces],
    [buns, mains, sauces]
  );

  useEffect(() => {
    if (id) {
      dispatch(selectIngredientById({ id, ingredients: allIngredients }));
    }
  }, [id, allIngredients, dispatch]);

  if (isLoading || !selectedIngredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={selectedIngredient} />;
};
