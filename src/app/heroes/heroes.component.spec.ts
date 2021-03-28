import { of } from "rxjs";
import { HeroesComponent } from "./heroes.component"

describe("HeroesComponent", () => {
    let component: HeroesComponent;
    let HEROES;
    let mockHeroService;

    beforeEach(() => {
        HEROES = [
            { id: 1, name: 'SpiderDude', strength: 8 },
            { id: 2, name: 'Wonderful Woman', strength: 24 },
            { id: 3, name: 'Superdude', strength: 5},
        ]
        
        mockHeroService = jasmine.createSpyObj(["getHeroes", "addHero", "deleteHero"])

        component = new HeroesComponent(mockHeroService);
    })
    
    describe("delete", () => {
        it("should remove the indicated hero from the heroes list", () => {
            mockHeroService.deleteHero.and.returnValue(of(true));           
            component.heroes = HEROES;

            component.delete(HEROES[2]);

            expect(component.heroes.length).toBe(2)
            expect(component.heroes).not.toContain({ id: 3, name: 'Superdude', strength: 5 })
            expect(component.heroes).toContain({ id: 2, name: 'Wonderful Woman', strength: 24 })
            expect(component.heroes).toContain({ id: 1, name: 'SpiderDude', strength: 8 },
            )

        })

        it("should call deleteHero with the correct value", () => {
            mockHeroService.deleteHero.and.returnValue(of(true));           
            component.heroes = HEROES;

            component.delete(HEROES[2]);

            expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
        })
        

    })

})