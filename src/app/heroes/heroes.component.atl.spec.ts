import {render, screen, fireEvent, findByText, findByRole, getByRole} from '@testing-library/angular'
import { HeroesComponent } from './heroes.component'
import { RouterTestingModule } from '@angular/router/testing'
import { HeroService } from '../hero.service'
import { heroServiceMock, resetHeroes } from '../mocks/hero-service.mock'
import userEvent from '@testing-library/user-event'
import { within } from '@testing-library/dom'

describe('Heroes component ATL', () => {
  const renderComponent = async() => {
    resetHeroes();
    return await render(HeroesComponent, {
      declarations: [HeroesComponent],
       imports:[RouterTestingModule.withRoutes([])],
      providers: [{provide: HeroService, useValue: heroServiceMock}]
    })
  }

  test('component should render', async() => {
    const {container} = await renderComponent();
    expect(container).toBeTruthy();
  });

  test('should add new hero', async() => {
    const user = userEvent.setup();
    await renderComponent();

    const input = await screen.findByLabelText(/Hero name:/i);
    await user.type(input, 'My new hero');

    const addButton = await screen.findByText(/Add hero/i);
    user.click(addButton);

    const newHero = await screen.findByText(/My new hero/i);
    expect(newHero).toBeInTheDocument();
  });

  test('should remove Dr Nice from hero list', async() => {
    const user = userEvent.setup();
    await renderComponent();

    const hero = await screen.findByText(/Dr. Nice/i)
    expect(hero).toBeInTheDocument();

    const li = hero.closest('li') as HTMLElement;
    const deleteButton = within(li).getByRole('button', {
      hidden: true
    });
    await user.click(deleteButton);

    expect(screen.queryByText(/Dr. Nice/)).not.toBeInTheDocument();
  });
})
