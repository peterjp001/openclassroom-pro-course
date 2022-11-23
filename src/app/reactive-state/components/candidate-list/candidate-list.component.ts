import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {combineLatest, map, Observable, startWith} from "rxjs";
import {CandidatesService} from "../../service/candidates.service";
import {Candidate} from "../../models/candidate.model";
import {FormBuilder, FormControl} from "@angular/forms";
import {CandidateSearchType} from "../../enum/candidate-search-type.enum";

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateListComponent implements OnInit {

   loading$!: Observable<boolean>;
   candidates$!: Observable<Candidate[]>;

   searchControl!:FormControl;
   searchTypeControl!:FormControl;
   searchTypeOption!:{
     value:CandidateSearchType,
     label:string
   }[];


  constructor(private candidatesService: CandidatesService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.initObservables();
    this.candidatesService.getCandidateFromServer();
  }

  private initForm() {
    this.searchTypeOption = [
      {value:CandidateSearchType.LASTNAME,label:'Nom'},
      {value:CandidateSearchType.FIRSTNAME,label:'Prénom'},
      {value:CandidateSearchType.COMPANY,label:'Entreprise'}
    ];
    this.searchControl = this.formBuilder.control('');
    this.searchTypeControl = this.formBuilder.control(CandidateSearchType.LASTNAME)
  }

  private initObservables(){
    this.loading$ = this.candidatesService.loading$;
    const search$ = this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      map(value => value.toLowerCase())
    );
    const searchType$: Observable<CandidateSearchType> = this.searchTypeControl.valueChanges.pipe(
      startWith(this.searchTypeControl.value),
    );
    this.candidates$ = combineLatest([
      search$,
      searchType$,
      this.candidatesService.candidates$
    ]).pipe(
      map(([search, searchType, candidates]) => candidates.filter(candidate => candidate[searchType]
        .toLowerCase()
        .includes(search as string))
      )
    )
  }


}
