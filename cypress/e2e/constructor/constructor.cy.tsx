const SELECTORS = {
  addButton: (id) => `[data-cy="add-button-${id}"]`,
  burgerConstructorBuns: '[data-cy="burger-constructor-buns"]',
  burgerConstructorFilling: '[data-cy="burger-constructor-filling"]',
  burgerConstructorNotBunsTop: '[data-cy="burger-constructor-notBunsTop"]',
  burgerConstructorNotBunsBottom: '[data-cy="burger-constructor-notBunsBottom"]',
  burgerConstructorNotFilling: '[data-cy="burger-constructor-notFilling"]',
  ingredient: (id) => `[data-cy="ingredient-${id}"]`,
  modal: '[data-cy="modal"]',
  closeButton: '[data-cy="close-button"]',
  orderButton: '[data-cy="button-order"]',
};

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
      cy.visit('/');

      ingredients.forEach((ingredient) => {
        cy.contains(ingredient._id).scrollIntoView().should('be.visible');
      });
    });
  });
});

describe('проверяем отображение добавленного ингредиента на странице', () => {
  it('страница должна корректно отображать добавленный в заказ ингредиент на странице',() => {
      cy.intercept('GET', 'api/ingredients', {fixture: 'ingredients.json'});
      cy.visit('/');

      cy.get(SELECTORS.addButton(2)).find('button').click();

      cy.get(SELECTORS.burgerConstructorFilling).within(() => {
        cy.get(SELECTORS.ingredient(2)).should('exist');
      });
  });
});

describe('проверяем отображение добавленные ингредиенты на странице', () => {
  it('страница должна корректно отображать добавленных в заказ ингредиентов на странице',() => {
    getMockIngredients().then((ingredients) => {
        cy.intercept('GET', 'api/ingredients', {fixture: 'ingredients.json'});
        cy.visit('/');
        
        cy.get(SELECTORS.addButton(1)).find('button').click();
        cy.get(SELECTORS.addButton(2)).find('button').click();
        cy.get(SELECTORS.addButton(3)).find('button').click();

        cy.get(SELECTORS.burgerConstructorBuns).first().within(() => {
          cy.contains(`${ingredients[0].name} (верх)`).should('exist');
        });

        cy.get(SELECTORS.burgerConstructorBuns).last().within(() => {
          cy.contains(`${ingredients[0].name} (низ)`).should('exist');
        });

        cy.get(SELECTORS.burgerConstructorFilling).within(() => {
          cy.get(SELECTORS.ingredient(2)).should('exist');
          cy.get(SELECTORS.ingredient(3)).should('exist');
      });
    });
  });
});

describe('проверяем отображение модального окна ингредиента на странице', () => {
  it('страница должна корректно отображать модальное окно ингредиента на странице',() => {
    getMockIngredients().then((ingredients) => {
      cy.intercept('GET', 'api/ingredients', {fixture: 'ingredients.json'});
      cy.visit('/');

      cy.get(SELECTORS.addButton(1)).find('a').click();

      cy.url().should('include', '/ingredients/1');

      cy.get(SELECTORS.modal).should('be.visible');
      cy.get(SELECTORS.ingredient(1)).within(() => {
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
    cy.visit('/');

    cy.get(SELECTORS.addButton(1)).find('a').click();
    cy.get(SELECTORS.closeButton).click();
    cy.get(SELECTORS.modal).should('not.exist');
    cy.url().should('include', '/');
  });

  it('страница должна корректно закрывать модальное окно ингредиента при нажатии на оверлей',() => {
    cy.intercept('GET', 'api/ingredients', {fixture: 'ingredients.json'});
    cy.visit('/');

    cy.get(SELECTORS.addButton(1)).find('a').click();
    cy.get(SELECTORS.modal).should('be.visible');

    cy.get(SELECTORS.modal).then(($modal) => {
      const modalPosition = $modal[0].getBoundingClientRect();
      const clickX = modalPosition.right + 50;
      const clickY = modalPosition.top + (modalPosition.height / 2);

      cy.get('body').click(clickX, clickY);
    });

    cy.get(SELECTORS.modal).should('not.exist');
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
    cy.visit('/');

    cy.wait('@getIngredients');

    cy.get(SELECTORS.addButton(1)).find('button').click();
    cy.get(SELECTORS.addButton(2)).find('button').click();
    cy.get(SELECTORS.addButton(3)).find('button').click();

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

    cy.get(SELECTORS.orderButton).find('button').click();

    cy.wait('@postOrder');

    cy.get(SELECTORS.modal).should('be.visible');
    cy.get(SELECTORS.modal).should('contain', '12345');

    cy.get(SELECTORS.closeButton).click();
    cy.get(SELECTORS.modal).should('not.exist');

    cy.get(SELECTORS.burgerConstructorNotBunsTop).first().within(() => {
      cy.contains('Выберите булки').should('exist');
    });

    cy.get(SELECTORS.burgerConstructorNotBunsBottom).last().within(() => {
      cy.contains('Выберите булки').should('exist');
    });

    cy.get(SELECTORS.burgerConstructorNotFilling).within(() => {
      cy.contains('Выберите начинку').should('exist');
    });
  });

  it('страница не должна отображать модальное окно оформления заказа при отсутствии начинки', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get(SELECTORS.addButton(1)).find('button').click();

    cy.get(SELECTORS.orderButton).find('button').click();

    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('страница не должна отображать модальное окно оформления заказа при отсутствии булки', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get(SELECTORS.addButton(2)).find('button').click();
    cy.get(SELECTORS.addButton(3)).find('button').click();

    cy.get(SELECTORS.orderButton).find('button').click();

    cy.get(SELECTORS.modal).should('not.exist');
  });
});