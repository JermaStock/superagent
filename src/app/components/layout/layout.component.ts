import { Component } from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {FiltersComponent} from "../users/filters/filters.component";
import {ListComponent} from "../users/list/list.component";
import {UsersComponent} from "../users/users.component";
import {MenuService} from "../../services/menu.service";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    FiltersComponent,
    ListComponent,
    UsersComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  constructor(
    readonly menuService: MenuService,
  ) {
  }

}
