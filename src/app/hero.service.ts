import { Injectable } from '@angular/core';
import { Observable, of, pipe } from 'rxjs';
import { MessageService } from './message.service';
import { Hero } from './hero';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';

  constructor(
    private messageService: MessageService,
    private http: HttpClient) { }
    
    httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'appication/json'})
    };


  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
     .pipe(
      catchError(this.handleError<Hero[]>('getHeroes', []))
     );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      )
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error:any): Observable<T> => {
      console.error(error);

      this.log('${operation} failed: ${error.message}');

      return of(result as T);
    }
  }

  log(message: string) {
    this.messageService.add(message);
  }
}
