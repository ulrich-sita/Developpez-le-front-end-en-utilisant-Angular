import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic} from '../models/Olympic';
import { Participation } from '../models/Participation';
import { Medal } from '../models/medal';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => {this.olympics$.next(value);
        console.log("Bonjour")
      }),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getCountryDetails(id: number): Observable<Olympic> {
    return  this.http.get<Olympic[]>(this.olympicUrl).pipe(
      map((olympics) => { 
        console.log(olympics);
    const olympic =  olympics?.find(olympic => olympic.id == id );
    if(!olympic){
      console.error('Country not found:', id);
  throw new Error('Country not found');
    }
    return olympic;
      } )
    )
      }
  
  getCountryByName(name: string): Observable<number | undefined> {
    return this.getOlympics().pipe(
      map((olympics: Olympic[]) => {
        const country = olympics.find(olympic => olympic.country === name);
        return country ? country.id : undefined;
      })
    );
  }

  getTotalParticipations(participations: Participation[]): number {
    return participations.length;
  }
 
}
