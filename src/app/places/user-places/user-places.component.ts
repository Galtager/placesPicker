import { Component, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {
  placeService = inject(PlacesService);
  places = this.placeService.loadedUserPlaces

  isFetching = signal(false)
  isError = signal('')

  ngOnInit() {
    this.isFetching.set(true)
    this.placeService.loadUserPlaces().subscribe(
      {
        error: (error: Error) => {
          console.log(error)
          this.isError.set(error.message)
        },
        complete: () => {
          this.isFetching.set(false)
        },
      });
  }

  removeUserPlace(place: Place) {
    this.placeService.removeUserPlace(place).subscribe()
  }
}
