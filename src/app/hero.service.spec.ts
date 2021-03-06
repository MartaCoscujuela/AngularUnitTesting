import { inject, TestBed } from "@angular/core/testing";
import { HeroService } from "./hero.service";
import { MessageService } from "./message.service";
import { HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing"

describe('HeroService', () => {
    let mockMessageService = jasmine.createSpyObj(["add"])
    let httpTestingController: HttpTestingController
    let service: HeroService

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [
                HeroService,
                {provide: MessageService, useValue: mockMessageService}
            ]
        });

        httpTestingController = TestBed.get(HttpTestingController)
        service = TestBed.get(HeroService)

    });


    describe("getHero", () => {
        it("should call get with the correct url", ()=> {
           
            service.getHero(4).subscribe();

            const req = httpTestingController.expectOne('api/heroes/4');
            req.flush({ id: 4, name: "SuperDude", strength: 100 })
            httpTestingController.verify();
        });
    }) 
})