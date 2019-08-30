import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { IconLoaderService } from '../../../index';
import { MinimizeService } from '../../panes/window/minimize-service.service';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { AmexioCardCEComponent } from './amexio.cards.component';
import { AmexioCardCEHeaderComponent } from '../common/amexio.header.component';
import { LifeCycleBaseComponent } from '../../base/lifecycle.base.component';
import { AmexioCardCEActionComponent } from '../common/amexio.action.component';
import { AmexioCardCEBodyComponent } from '../common/amexio.body.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
@Component({
    selector: 'test-cmp',
    template: `
    <amexio-card-ce>
       <amexio-header-ce>
       </amexio-header-ce>
       </amexio-card-ce>
       
       `,
})
class TestCeWindowComponent { }
describe('amexio-card-ce', () => {
    let comp: AmexioCardCEComponent;
    let fixture: ComponentFixture<TestCeWindowComponent>;
    let miniservice:any;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [
                AmexioCardCEComponent,
                AmexioCardCEHeaderComponent,
                TestCeWindowComponent,
                AmexioCardCEComponent,
                LifeCycleBaseComponent,
                AmexioCardCEActionComponent,
                AmexioCardCEBodyComponent
            ],
            providers: [IconLoaderService, FormBuilder,MinimizeService],
        }).overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [] } }).compileComponents();
    }));
    beforeEach(() => {
        // service = TestBed.get(DeviceQueryService);
        fixture = TestBed.createComponent(TestCeWindowComponent);
        comp = fixture.debugElement.children[0].componentInstance;
        event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
        fixture.detectChanges();
        comp.yesFullScreen = true;
        miniservice = TestBed.get(MinimizeService);
    });


    it('variable check', () => {
        comp.maximizeflagchanged = true;

    });
 

    it('ngAfterContentInit  method check', () => {
        fixture.detectChanges();
        comp.ngAfterContentInit();
     

        expect(comp.AmexioCardCEHeaderQueryList).toBeDefined();
        comp.amexioCardHeaderList = comp.AmexioCardCEHeaderQueryList.toArray();
        expect(comp.amexioCardHeaderList).toBeDefined()
        expect(comp.amexioCardHeaderList.length).toBeGreaterThan(0)
        comp.amexioCardHeaderList.forEach((element: any) => {
            element.ribbonType = false;
            element.amexioComponentId = comp.amexioComponentId;
            element.fullScreenFlag = comp.yesFullScreen;
            element.desktopFlag = comp.desktopFlag;
            element.fullscreenMax = true;
          });

          expect(comp.yesFullScreen).toEqual(true);
          comp.AmexioCardCEHeaderQueryList.toArray()[0].fullScreenFlag = comp.yesFullScreen;
          comp.AmexioCardCEHeaderQueryList.toArray()[0].maximizeWindow.subscribe((event: any) => {
          comp.maximizeflagchanged = event.fullscreenMax;
          })

    });
   
});