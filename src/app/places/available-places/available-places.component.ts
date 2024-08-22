import { Component, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent]
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  placeService = inject(PlacesService)

  isFetching = signal(false)
  isError = signal('')
  private httpClient = inject(HttpClient);

  ngOnInit() {
    this.isFetching.set(true)
    this.placeService.loadAvailablePlaces().subscribe(
      {
        next: (places) => {
          this.places.set(places);
        },
        complete: () => {
          this.isFetching.set(false)
        },
      });
  }
  onSelectPlace(place: Place) {
    this.placeService.addPlaceToUserPlaces(place).subscribe()
  }

}
