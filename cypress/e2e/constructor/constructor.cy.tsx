const getMockIngredients = () => {
  return cy.fixture('ingredients.json').then((data) => data.data);
};

describe('проверяем доступность приложения', () => {
  it('сервис должен быть доступен по адресу localhost:4000', () => {
      cy.visit('http://localhost:4000'); 
  });
});

describe('проверяем отображение ингредиентов на странице', () => {
  it('страница должна корректно отображать ингредиенты на странице',() => {
    getMockIngredients().then((ingredients) => {
      cy.intercept('GET', 'api/ingredients', {fixture: 'ingredients.json'});
      cy.visit('http://localhost:4000');

      ingredients.forEach((ingredient) => {
        cy.contains(ingredient._id).scrollIntoView().should('be.visible');
      });
    });
  });
});

describe('проверяем отображение добавленного ингредиента на странице', () => {
  it('страница должна корректно отображать добавленный в заказ ингредиент на странице',() => {
      cy.intercept('GET', 'api/ingredients', {fixture: 'ingredients.json'});
      cy.visit('http://localhost:4000');

      cy.get('[data-cy="add-button-2"]').find('button').click();

      cy.get('[data-cy="burger-constructor-filling"]').within(() => {
        cy.get('[data-cy="ingredient-2"]').should('exist');
      });
  });
});

describe('проверяем отображение добавленные ингредиенты на странице', () => {
  it('страница должна корректно отображать добавленных в заказ ингредиентов на странице',() => {
    getMockIngredients().then((ingredients) => {
        cy.intercept('GET', 'api/ingredients', {fixture: 'ingredients.json'});
        cy.visit('http://localhost:4000');
        
        cy.get('[data-cy="add-button-1"]').find('button').click();
        cy.get('[data-cy="add-button-2"]').find('button').click();
        cy.get('[data-cy="add-button-3"]').find('button').click();

        cy.get('[data-cy="burger-constructor-buns"]').first().within(() => {
          cy.contains(`${ingredients[0].name} (верх)`).should('exist');
        });

        cy.get('[data-cy="burger-constructor-buns"]').last().within(() => {
          cy.contains(`${ingredients[0].name} (низ)`).should('exist');
        });

        cy.get('[data-cy="burger-constructor-filling"]').within(() => {
          cy.get('[data-cy="ingredient-2"]').should('exist');
          cy.get('[data-cy="ingredient-3"]').should('exist');
      });
    });
  });
});

describe('проверяем отображение модального окна ингредиента на странице', () => {
  it('страница должна корректно отображать модальное окно ингредиента на странице',() => {
    getMockIngredients().then((ingredients) => {
      cy.intercept('GET', 'api/ingredients', {fixture: 'ingredients.json'});
      cy.visit('http://localhost:4000');

      cy.get('[data-cy="add-button-1"]').find('a').click();

      cy.url().should('include', '/ingredients/1');

      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="ingredient-1"]').within(() => {
        cy.get('img').should('have.attr', 'src', `${ingredients[0].image_large}`);
        cy.get('h3').should('contain.text', `${ingredients[0].name}`);
        cy.contains('Калории, ккал').next().should('contain.text', `${ingredients[0].calories}`);
        cy.contains('Белки, г').next().should('contain.text', `${ingredients[0].proteins}`);
        cy.contains('Жиры, г').next().should('contain.text', `${ingredients[0].fat}`);
        cy.contains('Углеводы, г').next().should('contain.text', `${ingredients[0].carbohydrates}`);
    });
    });
  });
});

describe('проверяем закртытие модального окна ингредиента при нажатии на крестик', () => {
  it('страница должна корректно закрывать модальное окно ингредиента при нажатии на крестик',() => {
    cy.intercept('GET', 'api/ingredients', {fixture: 'ingredients.json'});
    cy.visit('http://localhost:4000');

    cy.get('[data-cy="add-button-1"]').find('a').click();
    cy.get('[data-cy="close-button"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
    cy.url().should('include', '/');
  });

  it('страница должна корректно закрывать модальное окно ингредиента при нажатии на оверлей',() => {
    cy.intercept('GET', 'api/ingredients', {fixture: 'ingredients.json'});
    cy.visit('http://localhost:4000');

    cy.get('[data-cy="add-button-1"]').find('a').click();
    cy.get('[data-cy="modal"]').should('be.visible');

    cy.get('[data-cy="modal"]').then(($modal) => {
      const modalPosition = $modal[0].getBoundingClientRect();
      const clickX = modalPosition.right + 50;
      const clickY = modalPosition.top + (modalPosition.height / 2);

      cy.get('body').click(clickX, clickY);
    });

    cy.get('[data-cy="modal"]').should('not.exist');
    cy.url().should('include', '/');
  });
});

describe('проверяем оформление и создание заказа с моковыми данными', () => {
  const mockAccessToken = 'mockAccessToken';
  const mockRefreshToken = 'mockRefreshToken';

  beforeEach(() => {
    localStorage.setItem('refreshToken', mockRefreshToken);

    cy.intercept('POST', 'api/auth/token', {
      statusCode: 200,
      body: {
        success: true,
        refreshToken: mockRefreshToken,
        accessToken: mockAccessToken
      }
    }).as('refreshTokenRequest');

    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
  });

  it('страница должна корректно отображать модальное окно оформления заказа, а также корректно оформлять заказ', () => {
    cy.visit('http://localhost:4000');

    cy.wait('@getIngredients');

    cy.get('[data-cy="add-button-1"]').find('button').click();
    cy.get('[data-cy="add-button-2"]').find('button').click();
    cy.get('[data-cy="add-button-3"]').find('button').click();

    cy.intercept('POST', 'api/orders', {
      statusCode: 200,
      body: {
        success: true,
        order: {
          _id: 'order123',
          status: 'done',
          name: 'Test Burger',
          createdAt: '2023-09-17T12:34:56.789Z',
          updatedAt: '2023-09-17T12:34:56.789Z',
          number: 12345,
          ingredients: ['ingredient1', 'ingredient2', 'ingredient3']
        },
        name: 'Test Burger'
      }
    }).as('postOrder');

    cy.get('[data-cy="button-order"]').find('button').click();

    cy.wait('@postOrder');

    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal"]').should('contain', '12345');

    cy.get('[data-cy="close-button"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    cy.get('[data-cy="burger-constructor-notBunsTop"]').first().within(() => {
      cy.contains('Выберите булки').should('exist');
    });

    cy.get('[data-cy="burger-constructor-notBunsBottom"]').last().within(() => {
      cy.contains('Выберите булки').should('exist');
    });

    cy.get('[data-cy="burger-constructor-notFilling"]').within(() => {
      cy.contains('Выберите начинку').should('exist');
    });
  });

  it('страница не должна отображать модальное окно оформления заказа при отсутствии начинки', () => {
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');

    cy.get('[data-cy="add-button-1"]').find('button').click();

    cy.get('[data-cy="button-order"]').find('button').click();

    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('страница не должна отображать модальное окно оформления заказа при отсутствии булки', () => {
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');

    cy.get('[data-cy="add-button-2"]').find('button').click();
    cy.get('[data-cy="add-button-3"]').find('button').click();

    cy.get('[data-cy="button-order"]').find('button').click();

    cy.get('[data-cy="modal"]').should('not.exist');
  });
});