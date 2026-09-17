import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Router, RouterLink, provideRouter } from '@angular/router';
import {
  IonApp,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet,
  provideIonicAngular,
} from '@ionic/angular';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterLink,
        IonApp,
        IonMenu,
        IonHeader,
        IonContent,
        IonList,
        IonMenuToggle,
        IonItem,
        IonIcon,
        IonLabel,
        IonFooter,
        IonRouterOutlet,
      ],
      providers: [provideRouter([]), provideIonicAngular()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have four menu pages', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-label');
    expect(menuItems.length).toEqual(4);
    expect(menuItems[0].innerHTML).toContain('Dashboard');
    expect(menuItems[1].innerHTML).toContain('List of Products');
    expect(menuItems[2].innerHTML).toContain('About the App');
    expect(menuItems[3].innerHTML).toContain('Developers');
  });

  it('should have urls', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const links = fixture.debugElement
      .queryAll(By.directive(RouterLink))
      .map((el) => el.injector.get(RouterLink));
    expect(links.length).toEqual(4);
    expect(router.serializeUrl(links[0].urlTree!)).toEqual('/dashboard');
    expect(router.serializeUrl(links[1].urlTree!)).toEqual('/products');
    expect(router.serializeUrl(links[2].urlTree!)).toEqual('/about');
    expect(router.serializeUrl(links[3].urlTree!)).toEqual('/developers');
  });
});