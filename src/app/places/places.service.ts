import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private errorService = inject(ErrorService)
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient)
  loadedUserPlaces = this.userPlaces.asReadonly();


  addPlaceToUserPlaces(place: Place) {
    return this.httpClient.put<{ userPlaces: Place[] }>('http://localhost:3000/user-places', {
      placeId: place.id
    }).pipe(
      tap({ next: (updatePlaces) => { this.userPlaces.update(prevPlaces => updatePlaces.userPlaces) } }),
      catchError((error: Error) => {
        this.errorService.showError('Failed to store selected place.')
        return throwError(() => new Error('Failed to store selected place.'))
      })
    );
  }
  removeUserPlace(place: Place) {
    return this.httpClient.delete<{ userPlaces: Place[] }>(`http://localhost:3000/user-places/${place.id}`)
      .pipe(
        tap({ next: (updatePlaces) => { this.userPlaces.update(prevPlaces => updatePlaces.userPlaces) } }),
        catchError((error: Error) => {
          this.errorService.showError('Failed to delete selected place.')
          return throwError(() => new Error('Failed to delete selected place.'))
        })
      );
  }
  fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient
      .get<{ places: Place[] }>("http://localhost:3000/" + url)
      .pipe(
        map((resData) => resData.places),
        catchError((error: Error) => {
          this.errorService.showError(errorMessage)
          return throwError(() => new Error(errorMessage))
        }))

  }
  loadAvailablePlaces() {
    return this.fetchPlaces("places", "Something went wrong fetching the available places")
  }
  loadUserPlaces() {
    return this.fetchPlaces("user-places", "Something went wrong fetching the favorite places").pipe(
      tap({ next: (userPlaces) => { this.userPlaces.set(userPlaces) } })
    )
  }
}
