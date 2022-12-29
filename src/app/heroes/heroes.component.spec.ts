import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {HeroesComponent} from "./heroes.component";
import {heroServiceMock, resetHeroes} from "../mocks/hero-service.mock";
import {HeroService} from "../hero.service";
import {RouterTestingModule} from "@angular/router/testing";
import {By} from "@angular/platform-browser";
describe('Heroes component', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;


  beforeEach(waitForAsync( () => {
    resetHeroes();
     TestBed.configureTestingModule({
      declarations: [HeroesComponent],
       imports:[RouterTestingModule.withRoutes([])],
      providers: [{provide: HeroService, useValue: heroServiceMock}]
    }).compileComponents();
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }))

  it('should exist', () => {
    expect(component).toBeTruthy();
  })
  it('should populate heroes array on init', () => {
    expect(component.heroes.length).toBeGreaterThan(0);
  });
  it('should display heroes', () => {
    const heroesList = fixture.debugElement.queryAll(By.css('li'));
    heroesList.forEach((hero, index) =>
    {
      const heroName = hero.nativeElement.querySelector('.hero-name').textContent.trim();
      expect(heroName).toEqual(component.heroes[index].name);
    });
  });
  it('should add hero to list and display',  () => {
    const addHeroSpy = jest.spyOn(heroServiceMock, "addHero");
    const addButton = fixture.debugElement.query(By.css('button.add-button')).nativeElement as HTMLButtonElement;
    const heroNameInput = fixture.debugElement.query(By.css('#new-hero')).nativeElement as HTMLInputElement;
    const fakeHero = "fakeHero";

    heroNameInput.value = fakeHero;
    addButton.click();

    const lastHero = component.heroes[component.heroes.length-1];
    expect(lastHero.name).toEqual(fakeHero);
    expect(addHeroSpy).toHaveBeenCalled();

    fixture.detectChanges();
    const displayedLastHero = fixture.debugElement.query(By.css('li:last-of-type')).nativeElement;
    const displayedLastHeroText = displayedLastHero.querySelector('.hero-name').textContent.trim();

    expect(displayedLastHeroText).toEqual(fakeHero);
  });

  it('should delete hero from list and display', () => {
    const deleteHeroSpy = jest.spyOn(heroServiceMock, "deleteHero");
    const deleteButton = fixture.debugElement.query(By.css('button.delete')).nativeElement as HTMLButtonElement;

    expect(component.heroes.length).toEqual(9);

    deleteButton.click();
    expect(component.heroes.length).toEqual(8);

    fixture.detectChanges();

    const heroesList = fixture.debugElement.queryAll(By.css('li'));

    expect(deleteHeroSpy).toHaveBeenCalled();
    expect(heroesList.length).toEqual(8);
  });
});
