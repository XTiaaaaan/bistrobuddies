import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
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
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  homeSharp,
  listOutline,
  listSharp,
  informationCircleOutline,
  informationCircleSharp,
  peopleOutline,
  peopleSharp,
  logOutOutline,
  logOutSharp,
  chevronForwardOutline,
  chevronForwardSharp,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    NgFor,
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
})
export class AppComponent implements OnInit {
  protected readonly appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'home' },
    { title: 'List of Products', url: '/products', icon: 'list' },
    { title: 'About the App', url: '/about', icon: 'information-circle' },
    { title: 'Developers', url: '/developers', icon: 'people' },
  ];

  selectedIndex = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    addIcons({
      homeOutline,
      homeSharp,
      listOutline,
      listSharp,
      informationCircleOutline,
      informationCircleSharp,
      peopleOutline,
      peopleSharp,
      logOutOutline,
      logOutSharp,
      chevronForwardOutline,
      chevronForwardSharp,
    });
  }

  ngOnInit() {
    this.updateSelected(this.router.url);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateSelected(event.urlAfterRedirects);
      }
    });
  }

  private updateSelected(url: string) {
    const index = this.appPages.findIndex((page) =>
      url.startsWith(page.url)
    );
    this.selectedIndex = index >= 0 ? index : 0;
  }

  onLogout() {
    // Placeholder logout handler — no auth logic wired up yet.
    console.log('Log Out tapped');
  }
}