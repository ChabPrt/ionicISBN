import {BehaviorSubject, Subject} from "rxjs";

export class StateSubject<T,S> extends Subject<T>{

  state;

  /**
   * Implémentation d'un BehaviorSubject avec un état
   *
   * @param defaultState Valeur par défaut de l'état
   */
  constructor(defaultState: S) {
    super();
    this.state = new BehaviorSubject<S>(defaultState);
  }


  nextWithState(value: T,state: S){
    this.setState(state);
    super.next(value);
  }

  setState(state: S){
    this.state.next(state);
  }

  override complete() {
    super.complete();
    this.state.complete();
  }

}
