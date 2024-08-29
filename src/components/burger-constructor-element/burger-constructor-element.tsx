import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../services/store';
import {
  handleDeleteIngredient,
  handleMoveDownIngredient,
  handleMoveUpIngredient
} from '../../slices/addIngredientSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch<AppDispatch>();

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
