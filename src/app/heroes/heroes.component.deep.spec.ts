import { Component, Directive, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { HeroService } from "../hero.service";
import { HeroComponent } from "../hero/hero.component";
import { HeroesComponent } from "./heroes.component"


@Directive({
    selector: '[routerLink]',
    host: {'(click)': 'onClick()'}
})

export class RouterLinkDirectiveStub {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;
    onClick() {
        this.navigatedTo = this.linkParams;
     }
}

describe("HeroesComponent (deep test", () => {

    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;


    beforeEach(() => {
        HEROES = [
            { id: 1, name: 'SpiderDude', strength: 8 },
            { id: 2, name: 'Wonderful Woman', strength: 24 },
            { id: 3, name: 'Superdude', strength: 5 },
        ]
        mockHeroService = jasmine.createSpyObj(["getHeroes", "addHero", "deleteHero"])
        TestBed.configureTestingModule({
            declarations: [HeroesComponent, HeroComponent, RouterLinkDirectiveStub],
            providers: [{
                provide: HeroService, useValue: mockHeroService
            }],
        })
        fixture = TestBed.createComponent(HeroesComponent)
    })
    

    it("should render each hero as a HeroComponent", () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES))

        fixture.detectChanges()

        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent))
    
        expect(heroComponentDEs.length).toEqual(3)
        HEROES.forEach((hero, index) => {
            expect(heroComponentDEs[index].componentInstance.hero).toEqual(hero)
        });
    });

    it(`should call heroService.deleteHero when the Hero Components delete button is clicked`, () => {
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES))

        fixture.detectChanges()

        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        heroComponents[0].query(By.css('button')).triggerEventHandler('click', { stopPropagation: () => { } });
        
        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0])
    })

    it(`should call heroService.deleteHero when the Hero Components delete even is raised`, () => {
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES))

        fixture.detectChanges()

        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        //(<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined)
        
        heroComponents[0].triggerEventHandler('delete', null);

        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0])
        
    })

    it('we should add a new hero to hero list when the add button is clicked', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        const name = 'Mr. Ice';
        mockHeroService.addHero.and.returnValue(of({ id: 5, name: name, strength: 4 }));
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        const addButton = fixture.debugElement.queryAll(By.css('button'))[0];
        inputElement.value = name;
        addButton.triggerEventHandler('click', null);
        fixture.detectChanges();
        
        const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
 
        expect(heroText).toContain(name);
    })
    

    it("should have the correct route for the first hero", () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES))
        fixture.detectChanges()
        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

        const routerLink = heroComponents[0].query(By.directive(RouterLinkDirectiveStub)).injector.get(RouterLinkDirectiveStub);

        heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

        console.log(heroComponents[0].query(By.css('a')));
 
        expect(routerLink.navigatedTo).toBe('/detail/1'); 

    });
 });