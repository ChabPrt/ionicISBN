import { BehaviorSubject, Subject } from "rxjs";

/**
 * Une extension de Subject qui inclut un état sous forme de BehaviorSubject.
 * Permet de gérer et de diffuser des états parallèlement à des valeurs.
 *
 * @template T Le type des valeurs émises par le subject.
 * @template S Le type de l'état associé.
 */
export class StateSubject<T, S> extends Subject<T> {
  private readonly _state: BehaviorSubject<S>;

  /**
   * Crée une instance de StateSubject avec un état initial.
   *
   * @param defaultState La valeur initiale de l'état.
   */
  constructor(defaultState: S) {
    super();
    this._state = new BehaviorSubject<S>(defaultState);
  }

  /**
   * Émet une valeur avec un nouvel état.
   *
   * @param value La valeur à émettre.
   * @param state Le nouvel état à définir.
   */
  nextWithState(value: T, state: S): void {
    this.setState(state);
    super.next(value);
  }

  /**
   * Définit un nouvel état.
   *
   * @param state Le nouvel état à définir.
   */
  setState(state: S): void {
    this._state.next(state);
  }

  /**
   * Retourne l'état actuel en tant qu'observable.
   * Utile pour écouter les changements d'état.
   */
  getState(): BehaviorSubject<S> {
    return this._state;
  }

  /**
   * Retourne la valeur actuelle de l'état.
   */
  get currentState(): S {
    return this._state.value;
  }

  /**
   * Termine le subject ainsi que l'état associé.
   */
  override complete(): void {
    super.complete();
    this._state.complete();
  }

  /**
   * Libère les ressources associées au subject et à l'état.
   */
  override unsubscribe(): void {
    super.unsubscribe();
    this._state.unsubscribe();
  }
}
