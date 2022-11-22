import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {CandidatesService} from "../../service/candidates.service";
import {Candidate} from "../../models/candidate.model";

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateListComponent implements OnInit {

   loading$!: Observable<boolean>;
   candidates$!: Observable<Candidate[]>;

  constructor(private candidatesService: CandidatesService) { }

  ngOnInit(): void {
    this.initObservables();
    this.candidatesService.getCandidateFromServer();
  }

  private initObservables(){
    this.loading$ = this.candidatesService.loading$;
    this.candidates$ = this.candidatesService.candidates$;
  }

}
