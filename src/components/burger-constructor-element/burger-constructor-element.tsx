import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  handleDeleteIngredient,
  handleMoveDownIngredient,
  handleMoveUpIngredient
} from '../../slices/addIngredientSlice';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(handleMoveDownIngredient(index));
    };

    const handleMoveUp = () => {
      dispatch(handleMoveUpIngredient(index));
    };

    const handleClose = () => {
      dispatch(handleDeleteIngredient({ ingredient, index }));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
