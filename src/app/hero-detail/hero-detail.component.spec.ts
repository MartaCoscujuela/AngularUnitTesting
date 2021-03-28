import { fakeAsync, flush, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { HeroService } from "../hero.service";
import { HeroDetailComponent } from "./hero-detail.component";
import { Location } from '@angular/common';
import { of } from "rxjs";
import { FormsModule } from "@angular/forms";
import { tick } from "@angular/core/testing";

describe('HeroDetailComponent', () => {
    
    let mockActivatedRoute, mockHeroService, mockLocation, fixture;
    
    beforeEach(() => {

        mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero' ])
        
        mockLocation = jasmine.createSpyObj(['back'])

        mockActivatedRoute = {
            snapshot: { paramMap: { get: () => { return '3' }}}
        }

        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [HeroDetailComponent],
            providers: [
                {
                    provide: ActivatedRoute, useValue: mockActivatedRoute
                },
                {
                    provide: HeroService,
                    useValue:
                    mockHeroService
                },
                {
                    provide: Location,
                    useValue: mockLocation
                }
            ]
        })

        fixture = TestBed.createComponent(HeroDetailComponent)

        mockHeroService.getHero.and.returnValue(of({id: 3, name: 'SUperDude', strength: '100'}));
    });
    
    it("it should render hero name in a h2 tag", () => {
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('h2').textContent).toContain('SUPERDUDE')
    });


    it("should call update hero when save is called", fakeAsync(() => {
        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();
        
        fixture.componentInstance.save();
        flush()
     //   expect(true).toBe(true);
        expect(mockHeroService.updateHero).toHaveBeenCalled();
        
    }))
})