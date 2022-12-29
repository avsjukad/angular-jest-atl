import {of} from "rxjs";
import {HEROES} from "../mock-heroes";
import {Hero} from "../hero";

let heroesCopy = [...HEROES];
export const heroServiceMock = {
  getHeroes: jest.fn(() => of(heroesCopy)),
  addHero: jest.fn((hero: Hero) => {
    hero.id = heroesCopy.length + 1;
    heroesCopy.push(hero);
    return of(hero);
  }),
  deleteHero: jest.fn((heroId: number) =>{
    let heroIndexToDelete = heroesCopy.findIndex((hero) =>{
      return heroId === hero.id;
    });
    heroesCopy.splice(heroIndexToDelete, 1);
    return of(heroesCopy);
})

}
export function resetHeroes()
  {
  heroesCopy = [...HEROES];
}
