import { Component } from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NgOptimizedImage} from "@angular/common";
import {MatMiniFabButton} from "@angular/material/button";
import {MatDrawer} from "@angular/material/sidenav";
import {MenuService} from "../../services/menu.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIcon,
    NgOptimizedImage,
    MatMiniFabButton,
    MatDrawer
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(
    public menuService: MenuService,
  ) {
  }
}
