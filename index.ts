import { BehaviorSubject, filter, map, Observable, Subject } from 'rxjs';

//////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Interfaces et types utilisés pour l'exercice : ils n'ont pas vocations à être modifiés
 */

interface Person {
  name: string;
  email: string;
  type: 'connected' | 'not connected';
}

interface PersonStore {
  people: Person[];
  number: number;
}
type ActionName = 'UpdateAllPeople' | 'RemoveAllPeople';

interface Action {
  name: ActionName;
  props: unknown;
}

type ActionCreator<T = undefined> = (props: T) => Action;
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Voici un simple BehaviorSubject. Il va représenter notre Store durant cet exercice.
 *
 * Doc : https://ngrx.io/guide/store#diagram
 *
 * Question : la seule entité qui a le droit de MODIFIER un store c'est ...?
 * Question : la seule entité qui a le droit de LIRE un store c'est ...?
 *
 */
const store$ = new BehaviorSubject<PersonStore>({
  people: [],
  number: 0,
});

/**
 * EXO1 : On va commencer par créer des actions en respectant l'interface de la fonction ActionCreator défini
 * ci dessus.
 *
 * La première sera une action pour mettre à jour la totalité des personnes de notre Store. Elle prendra donc
 * en paramètre la nouvelle liste de personnes.
 *
 * La deuxième sera une action pour supprimer toutes les personnes de notre Store. Elle ne prendra rien en
 * paramètre
 *
 */

const updateAllPeople: ActionCreator<Person[]> = (props: Person[]) => ({
  name: 'UpdateAllPeople',
  props,
});
const removeAllPeople: ActionCreator = () => ({
  name: 'RemoveAllPeople',
  props: undefined,
});

/**
 * EXO2 :
 * * créer un sélecteur qui émet la nouvelle valeur de l'attribut people lorsque celui-ci est mis à jour (et que cet attribut)
 * * créer un selecteur qui émet la nouvelle valeur de number lorsque celui-ci est mis à jour (et que cet attribut)
 */
const people$: Observable<Person[]> = store$.pipe(map((store) => store.people));
const peopleNumber$: Observable<number> = store$.pipe(
  map((store) => store.number)
);

/**
 * EXO3 : voici un sujet nommé actions$. Et c'est pas par hasard.
 * Ce sujet sera trigger dès lors que vous souhaitez émettre une action.
 *
 * On va s'intéresser ici aux reducers.
 *
 * Créer deux reducers, qui écoutent le sujet `actions$` et qui mettent à jour le Store `store$` en fonction de l'action reçu.
 * Pour plus de simplicité, on va faire un reducer par action
 */
const actions$ = new Subject<Action>();

// Reducer de l'action  updateAllPeople
actions$
  .asObservable()
  .pipe(filter((action) => action.name === 'UpdateAllPeople'))
  .subscribe((action: Action) => {
    const people = action.props as Person[];
    store$.next({ people, number: people.length });
  });

// Reducer de l'action removeAllPeople
actions$
  .asObservable()
  .pipe(filter((action) => action.name === 'RemoveAllPeople'))
  .subscribe(() => {
    store$.next({ people: [], number: 0 });
  });

/**
 * EXO4 : Utiliser actions$ pour dispatch l'une après l'autre les deux actions créés
 */
people$.subscribe(console.log);
peopleNumber$.subscribe(console.log);
actions$.next(
  updateAllPeople([
    { email: 'test@test.fr', name: 'Pierre', type: 'connected' },
  ])
);
actions$.next(
  updateAllPeople([{ email: 'toto@toto.fr', name: 'Toto', type: 'connected' }])
);

actions$.next(removeAllPeople(undefined));

/**
 * EXO5 : Via les selecteurs créés précemment, vérifier que le Store est mis à jour correctement (un console log suffit) ?
 */

/**
 * EXO6 : créer une facade qui permet de wrapper et simplificer l'accès aux actions et aux selecteurs
 */
const facade: {
  people$: Observable<Person[]>;
  number$: Observable<number>;
  updateAllPeople: () => void;
  removeAllPeople: () => void;
} = undefined;
